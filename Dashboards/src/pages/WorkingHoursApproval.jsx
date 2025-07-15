
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Eye,
  Download
} from "lucide-react";
import { exportWorkingHoursToExcel } from "@/lib/excelExport";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const WorkingHoursApproval = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkingHours = async () => {
    const token = localStorage.getItem("nssUserToken");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No token found. Please login again.",
        variant: "destructive"
      });
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/working-hours/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        toast({
          title: "Token Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive"
        });
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      
      const data = await response.json();
      if (response.ok) {
        setWorkingHours(data);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch working hours",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Fetch error occurred
      toast({
        title: "Error",
        description: "Failed to fetch working hours data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("nssUserToken");
    const userStr = localStorage.getItem("nssUser");
    if (!token || !userStr) {
      window.location.href = "/login";
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const role = user.role ? user.role.toLowerCase() : "";
      // Map role to abbreviated form
      let mappedRole = role;
      if (role === "program coordinator") mappedRole = "pc";
      else if (role === "program officer") mappedRole = "po";
      else if (role === "student coordinator") mappedRole = "sc";
      else if (role === "head student coordinator") mappedRole = "hsc";
      setUserRole(mappedRole);
      setUserName(user.name);
      setUserEmail(user.email);
      fetchWorkingHours();
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  // Filter working hours by status
  const pendingHours = workingHours.filter(wh => wh.status === 'pending');
  const approvedHours = workingHours.filter(wh => wh.status === 'approved');
  const rejectedHours = workingHours.filter(wh => wh.status === 'rejected');

  const handleApprove = async (id) => {
    const token = localStorage.getItem("nssUserToken");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No token found. Please login again.",
        variant: "destructive"
      });
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/working-hours/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Working Hours Approved",
          description: "The working hours have been approved successfully.",
        });
        // Refresh the list
        fetchWorkingHours();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || data.message || "Failed to approve working hours",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Approve error occurred
      toast({
        title: "Error",
        description: "Failed to approve working hours.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("nssUserToken");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No token found. Please login again.",
        variant: "destructive"
      });
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/working-hours/reject/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Working Hours Rejected",
          description: "The working hours have been rejected successfully.",
        });
        // Refresh the list
        fetchWorkingHours();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || data.message || "Failed to reject working hours",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Reject error occurred
      toast({
        title: "Error",
        description: "Failed to reject working hours.",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      // Get current filters
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (userRole) filters.userRole = userRole;

      // Export all working hours (or you can filter by status if needed)
      const result = exportWorkingHoursToExcel(workingHours, filters);
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Working hours exported to ${result.filename}`,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "Failed to export working hours",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export working hours: " + error.message,
        variant: "destructive"
      });
    }
  };

  const filteredPendingHours = pendingHours.filter(item =>
    item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.activity_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canApprove = ["pc", "program coordinator", "hsc", "head student coordinator"].includes((userRole || "").toLowerCase());

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Working Hours Approval</h1>
            <p className="text-muted-foreground">Review and approve student coordinator working hours</p>
          </div>
          <Button variant="outline" onClick={handleExportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-50 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <h3 className="text-2xl font-bold text-blue-900">{pendingHours.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved This Month</p>
                  <h3 className="text-2xl font-bold text-blue-900">{approvedHours.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected This Month</p>
                  <h3 className="text-2xl font-bold text-blue-900">{rejectedHours.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by student name or activity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Working Hours Management</CardTitle>
            <CardDescription>
              Review, approve, or reject student working hours submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending ({pendingHours.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedHours.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedHours.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-6">
                <div className="space-y-4">
                  {filteredPendingHours.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{item.student_name}</h3>
                            <Badge variant="outline">{item.login_id}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Submitted on {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-medium text-blue-900 mb-1">{item.activity_name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</span>
                            <span><strong>Hours:</strong> {item.hours}</span>
                            <span><strong>Department:</strong> {item.department_name}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Working Hours Details</DialogTitle>
                                <DialogDescription>
                                  Review the complete details of this working hours submission
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="font-medium">Student Name</label>
                                    <p>{item.studentName}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Student ID</label>
                                    <p>{item.studentId}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Activity</label>
                                    <p>{item.activity}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Hours</label>
                                    <p>{item.hours} hours</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Date</label>
                                    <p>{new Date(item.date).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <label className="font-medium">Evidence</label>
                                    <p>{item.evidence}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="font-medium">Description</label>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {canApprove && (
                            <>
                              <Button variant="success" size="sm" onClick={() => handleApprove(item.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleReject(item.id)}>
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredPendingHours.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No matching pending approvals found." : "No pending working hours approvals."}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="approved" className="mt-6">
                <div className="space-y-4">
                  {approvedHours.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{item.student_name}</h3>
                            <Badge variant="outline">{item.login_id}</Badge>
                            <Badge className="bg-green-100 text-green-800">Approved</Badge>
                          </div>
                          <h4 className="font-medium text-blue-900 mb-1">{item.activity_name}</h4>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</span>
                            <span><strong>Hours:</strong> {item.hours}</span>
                            <span><strong>Department:</strong> {item.department_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {approvedHours.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No approved working hours this month.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-6">
                <div className="space-y-4">
                  {rejectedHours.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-red-50">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{item.student_name}</h3>
                            <Badge variant="outline">{item.login_id}</Badge>
                            <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                          </div>
                          <h4 className="font-medium text-blue-900 mb-1">{item.activity_name}</h4>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</span>
                            <span><strong>Hours:</strong> {item.hours}</span>
                            <span><strong>Department:</strong> {item.department_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {rejectedHours.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No rejected working hours this month.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkingHoursApproval;

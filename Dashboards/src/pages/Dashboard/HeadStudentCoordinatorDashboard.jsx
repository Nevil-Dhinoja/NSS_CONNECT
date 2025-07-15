import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Clock, 
  Search, 
  Eye,
  Building,
  User,
  Calendar,
  Mail,
  GraduationCap,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HeadStudentCoordinatorDashboard = () => {
  const [studentCoordinators, setStudentCoordinators] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSC, setSelectedSC] = useState(null);
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalSC: 0,
    totalDepartments: 0,
    totalWorkingHours: 0,
    averageHoursPerSC: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentCoordinators();
    fetchWorkingHours();
  }, []);

  const fetchStudentCoordinators = async () => {
    try {
      const token = localStorage.getItem("nssUserToken");
      const roleName = encodeURIComponent("Student Coordinator");
      const response = await fetch(`http://localhost:5000/api/auth/users/${roleName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudentCoordinators(data);
        
        // Calculate stats
        const departments = [...new Set(data.map(sc => sc.department_name))];
        setStats({
          totalSC: data.length,
          totalDepartments: departments.length,
          totalWorkingHours: 0, // Will be calculated from working hours
          averageHoursPerSC: 0
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch student coordinators",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student coordinators",
        variant: "destructive"
      });
    }
  };

  const fetchWorkingHours = async () => {
    try {
      const token = localStorage.getItem("nssUserToken");
      const response = await fetch("http://localhost:5000/api/working-hours/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkingHours(data);
        
        // Update stats with working hours data
        const totalHours = data.reduce((sum, wh) => sum + (parseFloat(wh.hours) || 0), 0);
        setStats(prev => ({
          ...prev,
          totalWorkingHours: totalHours,
          averageHoursPerSC: studentCoordinators.length > 0 ? (totalHours / studentCoordinators.length).toFixed(1) : 0
        }));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch working hours",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch working hours",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSCs = studentCoordinators.filter(sc =>
    sc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sc.department_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sc.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSCs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSCs.slice(startIndex, endIndex);

  const getWorkingHoursForSC = (scId) => {
    return workingHours.filter(wh => wh.login_id === scId);
  };

  const getStatusBadge = (hours) => {
    const totalHours = parseFloat(hours) || 0;
    if (totalHours >= 120) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    } else if (totalHours >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Started</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-primary">Head Student Coordinator Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of all Student Coordinators and their activities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SCs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSC}</div>
            <p className="text-xs text-muted-foreground">Student Coordinators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Active Departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkingHours}</div>
            <p className="text-xs text-muted-foreground">Working Hours Logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Hours/SC</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageHoursPerSC}</div>
            <p className="text-xs text-muted-foreground">Average per SC</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Student Coordinators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Student Coordinators Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            All Student Coordinators
          </CardTitle>
          <CardDescription>
            View all Student Coordinators across all departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Coordinator</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading student coordinators...
                    </TableCell>
                  </TableRow>
                ) : currentItems.length > 0 ? (
                  currentItems.map((sc) => {
                    const scWorkingHours = getWorkingHoursForSC(sc.login_id);
                    const totalHours = scWorkingHours.reduce((sum, wh) => sum + (parseFloat(wh.hours) || 0), 0);
                    
                    return (
                      <TableRow key={sc.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {sc.name.split(" ").map(name => name[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <div className="font-medium">{sc.name}</div>
                              <div className="text-sm text-gray-500">
                                {sc.login_id || sc.loginId || "N/A"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{sc.email}</span>
                          </div>
                          {sc.contact && (
                            <div className="flex items-center text-sm mt-1">
                              <Phone className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{sc.contact}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{sc.department_name || sc.department || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium">{totalHours} hours</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(totalHours)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSC(sc);
                              setShowWorkingHours(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No Student Coordinators found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredSCs.length)} of {filteredSCs.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Working Hours Modal */}
      {showWorkingHours && selectedSC && (
          //   <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          // <div className="rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden m-4 pointer-events-auto"></div>
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden m-4">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Working Hours Details</h2>
                  <p className="text-blue-100 mt-1">{selectedSC.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowWorkingHours(false);
                    setSelectedSC(null);
                  }}
                  className="text-white hover:bg-blue-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="bg-gray-100 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Student Info */}
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedSC.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedSC.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{selectedSC.department_name || selectedSC.department || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours Entries</h3>
                
                {getWorkingHoursForSC(selectedSC.login_id).map((wh) => (
                  <div key={wh.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{wh.activity_name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{wh.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(wh.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {wh.hours} hours
                          </span>
                        </div>
                      </div>
                      <Badge 
                        className={
                          wh.status === 'approved' ? 'bg-green-100 text-green-800' :
                          wh.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {wh.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {getWorkingHoursForSC(selectedSC.login_id).length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Working Hours</h3>
                    <p className="text-gray-500">This Student Coordinator hasn't logged any working hours yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadStudentCoordinatorDashboard; 
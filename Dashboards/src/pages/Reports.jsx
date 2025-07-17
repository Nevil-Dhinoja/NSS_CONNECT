import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  Calendar,
  User,
  Search,
  Filter,
  PlusCircle,
  Eye,
  BarChart3,
  Upload,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { exportReportsToExcel } from "@/lib/excelExport";

const Reports = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

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
      // Allow SC and HSC users to access reports page (PO users should use Approvals page)
      if (role !== "sc" && role !== "student coordinator" && role !== "hsc" && role !== "head student coordinator") {
        window.location.href = "/dashboard";
        return;
      }
      setUserRole(role);
      setUserName(user.name);
      setUserEmail(user.email);
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  // Fetch reports when user data is loaded
  React.useEffect(() => {
    if (userRole) {
      fetchReports();
    }
  }, [userRole]);

  const fetchReports = async () => {
    const token = localStorage.getItem("nssUserToken");
    try {
      const response = await fetch("http://172.16.11.213:5000/api/events/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
    toast({
          title: "Error",
          description: "Failed to fetch reports",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReport = (report) => {
    setSelectedReport(report);
    setApprovalComments("");
    setIsApproving(true);
  };

  const handleRejectReport = (report) => {
    setSelectedReport(report);
    setApprovalComments("");
    setIsApproving(true);
  };

  const submitApproval = async (status) => {
    if (!selectedReport) return;

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
      const response = await fetch(`http://172.16.11.213:5000/api/events/reports/${selectedReport.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: status,
          comments: approvalComments
        }),
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
        toast({
          title: `Report ${status}`,
          description: `Report has been ${status} successfully.`,
        });
        setIsApproving(false);
        setSelectedReport(null);
        setApprovalComments("");
        fetchReports(); // Refresh the list
      } else {
        throw new Error(data.error || `Failed to ${status} report`);
      }
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        toast({
          title: "Server Error",
          description: "Cannot connect to server. Please make sure the backend is running.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const downloadReport = async (reportId) => {
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
      const response = await fetch(`http://172.16.11.213:5000/api/events/reports/${reportId}/download`, {
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

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Get the original filename from the response headers or use a default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `report_${reportId}.docx`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Success",
          description: "Report downloaded successfully",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to download report");
      }
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        toast({
          title: "Server Error",
          description: "Cannot connect to server. Please make sure the backend is running.",
          variant: "destructive"
        });
      } else {
    toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteReport = async (report) => {
    if (!confirm(`Are you sure you want to delete the report for "${report.event_name}"?`)) {
      return;
    }

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
      const response = await fetch(`http://172.16.11.213:5000/api/events/reports/${report.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Report deleted successfully",
        });
        fetchReports(); // Refresh the list
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete report");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    return type === "Working Hours Report" ? <BarChart3 className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const handleExportToExcel = () => {
    try {
      // Get current filters (if any are added in the future)
      const filters = {};
      if (userRole) filters.userRole = userRole;

      // Export filtered reports
      const result = exportReportsToExcel(reports, filters);
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Reports exported to ${result.filename}`,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "Failed to export reports",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export reports: " + error.message,
        variant: "destructive"
      });
    }
  };

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const isPO = userRole === 'po' || userRole === 'program officer';
  const isSC = userRole === 'sc' || userRole === 'student coordinator';
  const isHSC = userRole === 'hsc' || userRole === 'head student coordinator';

  return (
    <DashboardLayout userRole={userRole} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nss-primary">Event Reports</h1>
          </div>
          <Button variant="outline" onClick={handleExportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isPO ? "Department Reports" : "My Reports"}
            </CardTitle>
            <CardDescription>
              {isPO 
                ? "Manage event reports submitted by Student Coordinators"
                : "Track the status of your submitted reports"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    {(isPO || isHSC) && <TableHead>Submitted By</TableHead>}
                    <TableHead>Event Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted On</TableHead>
                    {isSC && <TableHead>PO Comments</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Loading reports...
                      </TableCell>
                    </TableRow>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="font-medium">{report.event_name}</div>
                        </TableCell>
                        {(isPO || isHSC) && (
                      <TableCell>
                            <div className="flex items-center text-sm">
                              <User className="mr-1 h-4 w-4 text-gray-400" />
                              {report.submitted_by_name || report.submitted_by}
                        </div>
                      </TableCell>
                        )}
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            {report.event_date ? new Date(report.event_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          {new Date(report.created_at).toLocaleDateString()}
                        </TableCell>
                        {isSC && (
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {report.comments ? (
                                <div className="max-w-xs truncate" title={report.comments}>
                                  {report.comments}
                                </div>
                              ) : (
                                <span className="text-gray-400">No comments</span>
                              )}
                            </div>
                          </TableCell>
                        )}
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            {(isPO || isHSC) ? (
                              <>
                            <Button
                                  onClick={() => downloadReport(report.id)}
                                  variant="outline"
                              size="sm"
                            >
                              <Download className="h-4 w-4" />
                                  Download
                                </Button>
                                {/* Approve/Reject buttons removed for PO */}
                              </>
                            ) : (
                              // SC actions - only delete (if pending or rejected)
                              <>
                                {['pending', 'rejected'].includes(report.status) && (
                                  <Button
                                    onClick={() => handleDeleteReport(report)}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Delete
                            </Button>
                                )}
                              </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No reports found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">{currentPage} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Dialog */}
        {!(isPO || isHSC) && (
        <Dialog open={isApproving} onOpenChange={setIsApproving}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedReport && (
                  selectedReport.status === 'pending' ? 'Review Report' : 'Update Report Status'
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedReport && (
                  `Review report for "${selectedReport.event_name}" submitted by ${selectedReport.submitted_by_name || selectedReport.submitted_by}`
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Comments (Optional)</label>
                <Textarea
                  placeholder="Add comments or feedback for the Student Coordinator..."
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsApproving(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => submitApproval('rejected')}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => submitApproval('approved')}
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Reports;

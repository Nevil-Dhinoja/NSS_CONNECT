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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Search,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { exportWorkingHoursToExcel, exportReportsToExcel } from "@/lib/excelExport";

const Approvals = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userDepartment, setUserDepartment] = React.useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [workingHours, setWorkingHours] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isApproving, setIsApproving] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [approvalComments, setApprovalComments] = useState("");
  const { toast } = useToast();
  const [eventCurrentPage, setEventCurrentPage] = useState(1);
  const [eventItemsPerPage] = useState(10);
  const [whCurrentPage, setWhCurrentPage] = useState(1);
  const [whItemsPerPage] = useState(10);

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
      const response = await fetch("http://172.16.11.213:5000/api/working-hours/all", {
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
      toast({
        title: "Error",
        description: "Failed to fetch working hours: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
      setLoadingReports(false);
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

  const submitReportApproval = async (status) => {
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const downloadReport = async (reportId) => {
    const token = localStorage.getItem("nssUserToken");
    try {
      const response = await fetch(`http://172.16.11.213:5000/api/events/reports/${reportId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Get the original filename from the response headers or use a default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `report-${reportId}.docx`;
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
          title: "Download Successful",
          description: "Report downloaded successfully.",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to download report");
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleApproval = async (id, action) => {
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
      const endpoint = action === "approve" 
        ? `http://172.16.11.213:5000/api/working-hours/approve/${id}`
        : `http://172.16.11.213:5000/api/working-hours/reject/${id}`;

      const response = await fetch(endpoint, {
        method: "PUT",
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
        // Find the working hours entry to get details for notification
        const entry = workingHours.find(wh => wh.id === id);
        
        // Add notification for the student (this would ideally be sent to the student's account)
        // For now, we'll add it to the current user's notifications as a demo
        const addNotification = (notification) => {
          const newNotification = {
            ...notification,
            id: `notification-${Date.now()}`,
            timestamp: new Date()
          };
          
          // Get existing notifications from localStorage
          const existingNotifications = JSON.parse(localStorage.getItem('nssNotifications') || '[]');
          const updatedNotifications = [newNotification, ...existingNotifications].slice(0, 50);
          localStorage.setItem('nssNotifications', JSON.stringify(updatedNotifications));
        };

        if (entry) {
          addNotification({
            type: 'working_hours',
            title: `Working Hours ${action === 'approve' ? 'Approved' : 'Rejected'}`,
            message: `${entry.activity_name} - ${entry.hours} hours has been ${action === 'approve' ? 'approved' : 'rejected'} by ${userName}`,
            status: action === 'approve' ? 'approved' : 'rejected',
            date: new Date(entry.date),
            priority: action === 'approve' ? 'low' : 'high'
          });
        }

        toast({
          title: `${action === "approve" ? "Approved" : "Rejected"}`,
          description: `Working hours have been ${action === "approve" ? "approved" : "rejected"} successfully.`,
          variant: action === "approve" ? "default" : "destructive",
        });
        fetchWorkingHours(); // Refresh the data
      } else {
        throw new Error(data.error || `Failed to ${action} working hours`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Use real reports data instead of mock data for event approvals
  const eventApprovals = userRole === "po" ? 
    reports.filter(report => report.department_name === userDepartment) : 
    reports; // PC can see all reports
  
  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case "submitted":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Submitted</Badge>;
      case "under_review":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Under Review</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Draft</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{String(status)}</Badge>;
    }
  };

  const filteredEventApprovals = eventApprovals.filter(
    approval =>
      (approval.event_name && approval.event_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ((approval.submitted_by_name || approval.submitted_by) && (approval.submitted_by_name || approval.submitted_by).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredWorkingHoursApprovals = workingHours.filter(
    approval =>
      (approval.student_name && approval.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (approval.activity_name && approval.activity_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic for working hours
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorkingHoursApprovals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWorkingHoursApprovals.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExportWorkingHoursToExcel = () => {
    try {
      // Get current filters
      const filters = {};
      if (searchQuery) filters.search = searchQuery;
      if (userDepartment) filters.department = userDepartment;
      if (userRole) filters.userRole = userRole;

      // Export filtered working hours
      const result = exportWorkingHoursToExcel(filteredWorkingHoursApprovals, filters);
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Working hours approvals exported to ${result.filename}`,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "Failed to export working hours approvals",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export working hours approvals: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleExportReportsToExcel = () => {
    try {
      // Get current filters
      const filters = {};
      if (searchQuery) filters.search = searchQuery;
      if (userDepartment) filters.department = userDepartment;
      if (userRole) filters.userRole = userRole;

      // Export filtered reports
      const result = exportReportsToExcel(filteredEventApprovals, filters);
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Event reports exported to ${result.filename}`,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "Failed to export event reports",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export event reports: " + error.message,
        variant: "destructive"
      });
    }
  };

  const eventIndexOfLast = eventCurrentPage * eventItemsPerPage;
  const eventIndexOfFirst = eventIndexOfLast - eventItemsPerPage;
  const eventCurrentItems = filteredEventApprovals.slice(eventIndexOfFirst, eventIndexOfLast);
  const eventTotalPages = Math.ceil(filteredEventApprovals.length / eventItemsPerPage);

  const whIndexOfLast = whCurrentPage * whItemsPerPage;
  const whIndexOfFirst = whIndexOfLast - whItemsPerPage;
  const whCurrentItems = currentItems.slice(whIndexOfFirst, whIndexOfLast);
  const whTotalPages = Math.ceil(currentItems.length / whItemsPerPage);

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
      
      // Allow PC, PO, and HSC roles (including full names and abbreviations)
      if (mappedRole !== "pc" && mappedRole !== "po" && mappedRole !== "hsc") {
        window.location.href = "/dashboard";
        return;
      }
      setUserRole(mappedRole);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserDepartment(user.department || "");
      fetchWorkingHours();
      if (mappedRole === "po" || mappedRole === "pc" || mappedRole === "hsc") {
        fetchReports();
      }
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  // Reset current page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg mt-4">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nss-primary">Approval Management</h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'po' ? 
                'Review and manage pending reports and working hours approvals for your department' :
                userRole === 'hsc' ?
                'Review and manage all event reports and working hours approvals across all departments' :
                'Review and manage all event reports and working hours approvals'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportWorkingHoursToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Working Hours
            </Button>
            <Button variant="outline" onClick={handleExportReportsToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search approvals..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {eventApprovals.filter(a => a.status && a.status.toLowerCase() === "pending").length +
                      workingHours.filter(a => a.status && a.status.toLowerCase() === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {workingHours.filter(a => a.status && a.status.toLowerCase() === "approved").length +
                      (userRole === 'pc' ? eventApprovals.filter(a => a.status && a.status.toLowerCase() === "approved").length : 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {workingHours.filter(a => a.status && a.status.toLowerCase() === "rejected").length +
                      (userRole === 'pc' ? eventApprovals.filter(a => a.status && a.status.toLowerCase() === "rejected").length : 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Reports</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {eventApprovals.filter(a => a.status && a.status.toLowerCase() === "approved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Event Report Approvals
            </CardTitle>
            <CardDescription>
              {userRole === 'po' ? 
                `Review event reports from your department - pending, approved, and rejected (${filteredEventApprovals.length})` :
                userRole === 'hsc' ?
                `Review all event reports across all departments - pending, approved, and rejected (${filteredEventApprovals.length})` :
                `Review all student event reports and proposals (${filteredEventApprovals.length})`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingReports ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Loading reports...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : eventCurrentItems.length > 0 ? (
                    eventCurrentItems.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{approval.event_name}</div>
                            <div className="text-sm text-gray-500">{approval.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {(approval.submitted_by_name || approval.submitted_by)?.split(" ").map(name => name[0]).join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-2">
                              <div className="text-sm font-medium">{approval.submitted_by_name || approval.submitted_by || "Unknown"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{approval.department_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            {approval.event_date ? new Date(approval.event_date).toLocaleDateString() : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(approval.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-2 justify-end">
                            {(approval.status && approval.status.toLowerCase() === "pending") && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveReport(approval)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectReport(approval)}
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadReport(approval.id)}
                              className="border-blue-500 text-blue-500 hover:bg-blue-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        {reports.length === 0 
                          ? "No reports found. Students need to submit reports first."
                          : "No reports found for the selected filters."
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-end mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEventCurrentPage(eventCurrentPage - 1)}
                  disabled={eventCurrentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">{eventCurrentPage} of {eventTotalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEventCurrentPage(eventCurrentPage + 1)}
                  disabled={eventCurrentPage === eventTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Working Hours Approvals
                </CardTitle>
                <CardDescription>
                  {userRole === 'po' ? 
                    `Review student working hours submissions from your department (${filteredWorkingHoursApprovals.length})` :
                    userRole === 'hsc' ?
                    `Review student working hours submissions across all departments (${filteredWorkingHoursApprovals.length})` :
                    `Review student working hours submissions (${filteredWorkingHoursApprovals.length})`
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Loading working hours...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : whCurrentItems.length > 0 ? (
                    whCurrentItems.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {approval.student_name?.split(" ").map(name => name[0]).join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-2">
                              <div className="text-sm font-medium">{approval.student_name || "Unknown"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{approval.department_name || "Unknown"}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{approval.activity_name}</div>
                            <div className="text-xs text-gray-500">{approval.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{approval.hours} hrs</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            {new Date(approval.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(approval.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-2 justify-end">
                            {(approval.status && approval.status.toLowerCase() === "pending") && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproval(approval.id, "approve")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproval(approval.id, "reject")}
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        {workingHours.length === 0 
                          ? "No working hours found. Students need to submit their working hours first."
                          : "No working hours found for the selected filters."
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-end mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWhCurrentPage(whCurrentPage - 1)}
                  disabled={whCurrentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">{whCurrentPage} of {whTotalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWhCurrentPage(whCurrentPage + 1)}
                  disabled={whCurrentPage === whTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Approval Dialog */}
        <Dialog open={isApproving} onOpenChange={setIsApproving}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedReport ? `Review Report: ${selectedReport.event_name}` : "Review Report"}
              </DialogTitle>
              <DialogDescription>
                Please review the report and provide comments if needed.
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add any comments or feedback..."
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsApproving(false);
                      setSelectedReport(null);
                      setApprovalComments("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => submitReportApproval("rejected")}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => submitReportApproval("approved")}
                    className="border-green-500 text-green-500 hover:bg-green-50"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Approvals;

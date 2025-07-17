import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  FileText,
  FileUp,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportEventsToExcel } from "@/lib/excelExport";

const Events = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userDepartment, setUserDepartment] = React.useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [selectedEventForReport, setSelectedEventForReport] = useState(null);
  const { toast } = useToast();

  const [newEvent, setNewEvent] = useState({
    event_name: "",
    event_date: "",
    event_mode: "",
    description: ""
  });

  const [reportForm, setReportForm] = useState({
    event_id: "",
    report_file: null,
    submitted_by: ""
  });

  const [submittedEventIds, setSubmittedEventIds] = useState([]);

  const [deptCurrentPage, setDeptCurrentPage] = useState(1);
  const [deptItemsPerPage] = useState(10);

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
      // Allow PO, PC, SC, and HSC users to access events page
      if (role !== "pc" && role !== "po" && role !== "sc" && role !== "hsc" && role !== "program coordinator" && role !== "program officer" && role !== "student coordinator" && role !== "head student coordinator") {
        window.location.href = "/dashboard";
        return;
      }
      setUserRole(role);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserDepartment(user.department || "");
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  // Fetch events when user data is loaded
  React.useEffect(() => {
    if (userRole) {
      fetchEvents();
    }
  }, [userRole, userDepartment]);

  const fetchEvents = async () => {
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
      // For SC users, fetch department-specific events
      // For PO/PC/HSC users, fetch all events (filtered by department for PO)
      const endpoint = (userRole === "sc" || userRole === "student coordinator") 
        ? `http://172.16.11.213:5000/api/events/department/${encodeURIComponent(userDepartment || '')}`
        : "http://172.16.11.213:5000/api/events/all";



      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        setEvents(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Failed to fetch events",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeForm = () => {
    setNewEvent({
      event_name: "",
      event_date: "",
      event_mode: "",
      description: ""
    });
  };

  const handleAddEvent = async () => {
    if (!newEvent.event_name || !newEvent.event_date || !newEvent.event_mode || !newEvent.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
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
      // Use different endpoint for PC events
      const endpoint = (userRole === 'pc' || userRole === 'program coordinator') 
        ? "http://172.16.11.213:5000/api/events/pc/add"
        : "http://172.16.11.213:5000/api/events/add";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
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
        const eventType = (userRole === 'pc' || userRole === 'program coordinator') ? 'PC Event' : 'Event';
        toast({
          title: `${eventType} Added`,
          description: `${eventType} has been added successfully.`,
        });
        setIsAddingEvent(false);
        initializeForm();
        fetchEvents(); // Refresh the list
      } else {
        const eventType = (userRole === 'pc' || userRole === 'program coordinator') ? 'PC Event' : 'Event';
        throw new Error(data.error || `Failed to add ${eventType.toLowerCase()}`);
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

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      event_name: event.event_name,
      event_date: event.event_date,
      event_mode: event.event_mode,
      description: event.description
    });
    setIsEditingEvent(true);
  };

  const handleUpdateEvent = async () => {
    if (!newEvent.event_name || !newEvent.event_date || !newEvent.event_mode || !newEvent.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
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
      const response = await fetch(`http://172.16.11.213:5000/api/events/update/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
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
          title: "Event Updated",
          description: "Event has been updated successfully.",
        });
        setIsEditingEvent(false);
        setEditingEvent(null);
        initializeForm();
        fetchEvents(); // Refresh the list
      } else {
        throw new Error(data.error || "Failed to update event");
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

  const handleSubmitReport = (event) => {
    setSelectedEventForReport(event);
    setReportForm({
      event_id: event.id,
      report_file: null,
      submitted_by: userName
    });
    setIsSubmittingReport(true);
  };

  const downloadReportTemplate = async () => {
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
      const response = await fetch("http://172.16.11.213:5000/api/events/reports/template/download", {
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
        a.download = 'NSS_Event_Report_Template.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Template Downloaded",
          description: "NSS Event Report Template has been downloaded successfully.",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to download template");
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

  const handleReportSubmission = async () => {
    // Patch: Ensure event_id and submitted_by are set before submit
    let patchedForm = { ...reportForm };
    if (!patchedForm.event_id && selectedEventForReport) patchedForm.event_id = selectedEventForReport.id;
    if (!patchedForm.submitted_by) patchedForm.submitted_by = userName;
    if (!patchedForm.report_file) {
      toast({
        title: "File Required",
        description: "Please upload a .docx report file before submitting.",
        variant: "destructive"
      });
      return;
    }
    if (!patchedForm.event_id || !patchedForm.submitted_by) {
      toast({
        title: "Missing Information",
        description: "Event ID and Submitted By are required. Please try again.",
        variant: "destructive"
      });
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
      const formData = new FormData();
      formData.append("event_id", patchedForm.event_id);
      formData.append("submitted_by", patchedForm.submitted_by);
      formData.append("report_file", patchedForm.report_file);
      const response = await fetch("http://172.16.11.213:5000/api/events/submit-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
          title: "Report Submitted",
          description: "Event report has been submitted successfully for approval.",
        });
        setIsSubmittingReport(false);
        setSelectedEventForReport(null);
        setReportForm({
          event_id: "",
          report_file: null,
          submitted_by: ""
        });
        setSubmittedEventIds(prev => [...prev, patchedForm.event_id]);
      } else {
        throw new Error(data.error || "Failed to submit report");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (eventId, eventName, eventType) => {
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
      // Use different endpoint for PC events
      const endpoint = eventType === 'pc_event' 
        ? `http://172.16.11.213:5000/api/events/pc/delete/${eventId}`
        : `http://172.16.11.213:5000/api/events/delete/${eventId}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
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
        const eventTypeText = eventType === 'pc_event' ? 'PC Event' : 'Event';
        toast({
          title: `${eventTypeText} Deleted`,
          description: `${eventName} has been deleted successfully.`,
        });
        fetchEvents(); // Refresh the list
      } else {
        const eventTypeText = eventType === 'pc_event' ? 'PC Event' : 'Event';
        throw new Error(data.error || `Failed to delete ${eventTypeText.toLowerCase()}`);
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

  // After fetching events and reports, cross-reference for SC, PC, and HSC
  React.useEffect(() => {
    if ((userRole === 'sc' || userRole === 'student coordinator' || userRole === 'pc' || userRole === 'program coordinator' || userRole === 'hsc' || userRole === 'head student coordinator') && events.length > 0) {
      // Fetch all reports for this user's role
      const fetchReports = async () => {
        const token = localStorage.getItem("nssUserToken");
        const res = await fetch("http://172.16.11.213:5000/api/events/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Map to event_ids for which a report exists
          setSubmittedEventIds([...new Set(data.map(r => r.event_id))]);
        }
      };
      fetchReports();
    }
  }, [userRole, events]);

  // Add filtering and pagination logic
  const filteredEvents = events.filter(event =>
    event.event_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.department_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  // Pagination logic
  const deptIndexOfLast = deptCurrentPage * deptItemsPerPage;
  const deptIndexOfFirst = deptIndexOfLast - deptItemsPerPage;
  const deptCurrentItems = filteredEvents.slice(deptIndexOfFirst, deptIndexOfLast);
  const deptTotalPages = Math.ceil(filteredEvents.length / deptItemsPerPage);

  

  // Reset page when search changes
  React.useEffect(() => {
    setDeptCurrentPage(1);
  }, [searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getModeBadge = (mode) => {
    switch (mode) {
      case "online":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Online</Badge>;
      case "offline":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Offline</Badge>;
      case "hybrid":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Hybrid</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const testEventsEndpoint = async () => {
    const token = localStorage.getItem("nssUserToken");
    try {
      const response = await fetch("http://172.16.11.213:5000/api/events/test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        toast({
          title: "Test Results",
          description: `Found ${data.total_events} events in database`,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));

        toast({
          title: "Test Error",
          description: errorData.error || "Failed to test events endpoint",
          variant: "destructive"
        });
      }
    } catch (error) {

      toast({
        title: "Test Error",
        description: "Failed to test events endpoint: " + error.message,
        variant: "destructive"
      });
    }
  };

  const updateEventStatuses = async () => {
    const token = localStorage.getItem("nssUserToken");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No token found. Please login again.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('http://172.16.11.213:5000/api/events/update-statuses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Status Updated",
          description: `${data.updatedCount} events have been marked as completed.`,
        });
        fetchEvents(); // Refresh the events list
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update event statuses",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event statuses: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      // Get current filters
      const filters = {};
      if (searchQuery) filters.search = searchQuery;
      if (userDepartment) filters.department = userDepartment;
      if (userRole) filters.userRole = userRole;

      // Export filtered events
      const result = exportEventsToExcel(filteredEvents, filters);
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Events exported to ${result.filename}`,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "Failed to export events",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export events: " + error.message,
        variant: "destructive"
      });
    }
  };

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg mt-4">Loading events...</p>
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
            <h1 className="text-2xl font-bold text-nss-primary">Events</h1>
          </div>
          <div className="flex gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Export to Excel button for all users */}
            <Button variant="outline" onClick={handleExportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            {/* Download Template button for SC and PO users */}
            {(userRole === 'sc' || userRole === 'student coordinator' || userRole === 'po' || userRole === 'program officer') && (
              <Button variant="outline" onClick={downloadReportTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            )}
            {/* Update Statuses button removed for PC users */}
            {/* Only show Add Event button for PO and PC users */}
            {(userRole === 'po' || userRole === 'pc' || userRole === 'program officer' || userRole === 'program coordinator') && (
              <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-nss-primary hover:bg-nss-dark"
                    onClick={initializeForm}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {userRole === 'pc' || userRole === 'program coordinator' ? 'Add PC Event' : 'Add Event'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    {userRole === 'po' || userRole === 'program officer'
                      ? 'Add a new event for your department.'
                      : 'Add a new event for any department.'
                    }
                  </DialogDescription>
              </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="event_name">Event Name</Label>
                    <Input
                      id="event_name"
                      value={newEvent.event_name}
                      onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
                      placeholder="Enter event name"
                    />
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Event Date</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={newEvent.event_date}
                      onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_mode">Event Mode</Label>
                    <Select value={newEvent.event_mode} onValueChange={(value) => setNewEvent({ ...newEvent, event_mode: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Enter event description..."
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddEvent} className="bg-nss-primary hover:bg-nss-dark">
                      Add Event
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            )}
                  </div>
                </div>

        {/* Edit Dialog */}
        <Dialog open={isEditingEvent} onOpenChange={setIsEditingEvent}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update event information.
              </DialogDescription>
            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event_name">Event Name</Label>
                <Input
                  id="edit-event_name"
                  value={newEvent.event_name}
                  onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
                  placeholder="Enter event name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event_date">Event Date</Label>
                <Input
                  id="edit-event_date"
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                />
              </div>
                  <div className="space-y-2">
                <Label htmlFor="edit-event_mode">Event Mode</Label>
                <Select value={newEvent.event_mode} onValueChange={(value) => setNewEvent({ ...newEvent, event_mode: value })}>
                      <SelectTrigger>
                    <SelectValue placeholder="Select event mode" />
                      </SelectTrigger>
                      <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description..."
                  rows={3}
                />
                  </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditingEvent(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateEvent} className="bg-nss-primary hover:bg-nss-dark">
                  Update Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>



        {/* Submit Report Dialog */}
        <Dialog open={isSubmittingReport} onOpenChange={setIsSubmittingReport}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Event Report</DialogTitle>
              <DialogDescription>
                Submit a report for {selectedEventForReport?.event_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">

              <div className="space-y-2">
                <Label>Event Information</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm"><strong>Event:</strong> {selectedEventForReport?.event_name}</p>
                  <p className="text-sm"><strong>Date:</strong> {selectedEventForReport?.event_date ? new Date(selectedEventForReport.event_date).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-sm"><strong>Mode:</strong> {selectedEventForReport?.event_mode}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Submitted By</Label>
                  <Input
                  value={reportForm.submitted_by}
                  readOnly
                  className="bg-gray-100"
                  />
                </div>
              {/* File upload for .docx */}
              <div className="space-y-2">
                <Label htmlFor="report_file">Upload Report (.docx)</Label>
                <Input
                  id="report_file"
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={e => setReportForm({ ...reportForm, report_file: e.target.files[0], event_id: selectedEventForReport?.id || reportForm.event_id, submitted_by: userName || reportForm.submitted_by })}
                  required
                />
                {reportForm.report_file && (
                  <div className="text-sm text-muted-foreground mt-1">Selected: {reportForm.report_file.name}</div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSubmittingReport(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleReportSubmission} 
                  className="bg-nss-primary hover:bg-nss-dark"
                  disabled={!reportForm.report_file}
                >
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Regular Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {userRole === 'po' || userRole === 'program officer'
                ? `${userDepartment} Department Events`
                : 'Department Events'
              }
            </CardTitle>
            <CardDescription>
              {(userRole === 'sc' || userRole === 'student coordinator')
                ? `View ${userDepartment} department events`
                : userRole === 'po' || userRole === 'program officer'
                ? `Manage ${userDepartment} department events`
                : 'Manage Department Events'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Loading events...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : deptCurrentItems.filter(event => event.event_type !== 'pc_event').length > 0 ? (
                    deptCurrentItems.filter(event => event.event_type !== 'pc_event').map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="font-medium">
                            {event.event_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{getModeBadge(event.event_mode)}</TableCell>
                        <TableCell className="text-sm">{event.department_name || userDepartment}</TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">

                            
                            {/* Edit/Delete buttons for PO and PC users */}
                            {(userRole === 'po' || userRole === 'pc' || userRole === 'program officer' || userRole === 'program coordinator') && (
                              <>
                                {event.status !== 'completed' && (
                                  <Button
                                    onClick={() => handleEditEvent(event)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500 text-red-500 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete <strong>{event.event_name}</strong>? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex flex-row justify-end gap-2">
                                      <AlertDialogCancel className="!mt-0">Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteEvent(event.id, event.event_name, event.event_type)}
                                        className="bg-red-600 hover:bg-red-700 border border-red-600 !mt-0"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            
                            {/* Submit Report button for SC and HSC users */}
                            {(userRole === 'sc' || userRole === 'student coordinator' || userRole === 'hsc' || userRole === 'head student coordinator') && (
                              <>
                                {submittedEventIds.includes(event.id) ? (
                                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 mr-2">Report Already Submitted</span>
                                ) : (
                                  <Button
                                    onClick={() => handleSubmitReport(event)}
                                    variant="outline"
                                    size="sm"
                                    className="border-green-500 text-green-500 hover:bg-green-50"
                                  >
                                    <FileUp className="h-4 w-4" />
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
                        {events.filter(event => event.event_type !== 'pc_event').length === 0 
                          ? "No regular events found. Start by adding your first event!"
                          : "No regular events found for the selected filters."
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
                  onClick={() => setDeptCurrentPage(deptCurrentPage - 1)}
                  disabled={deptCurrentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">{deptCurrentPage} of {deptTotalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeptCurrentPage(deptCurrentPage + 1)}
                  disabled={deptCurrentPage === deptTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PC Events Table - Only show for PC and HSC users */}
        {(userRole === 'pc' || userRole === 'program coordinator' || userRole === 'hsc' || userRole === 'head student coordinator') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                PC Events
              </CardTitle>
              <CardDescription>
                Program Coordinator events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                            Loading PC events...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : deptCurrentItems.filter(event => event.event_type === 'pc_event').length > 0 ? (
                      deptCurrentItems.filter(event => event.event_type === 'pc_event').map((event) => (
                        <TableRow key={event.id} className="bg-purple-50">
                          <TableCell>
                            <div className="font-medium text-purple-900">
                              {event.event_name}
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                PC Event
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="mr-1 h-4 w-4 text-purple-400" />
                              {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>{getModeBadge(event.event_mode)}</TableCell>
                          <TableCell className="text-sm text-purple-700">PC Event</TableCell>
                          <TableCell>{getStatusBadge(event.status)}</TableCell>
                          <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              {/* Edit/Delete buttons for PC users only */}
                              {(userRole === 'pc' || userRole === 'program coordinator') && (
                                <>
                                  {event.status !== 'completed' && (
                                    <Button
                                      onClick={() => handleEditEvent(event)}
                                      variant="outline"
                                      size="sm"
                                      className="border-purple-500 text-purple-500 hover:bg-purple-50"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete PC Event</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete <strong>{event.event_name}</strong>? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter className="flex flex-row justify-end gap-2">
                                        <AlertDialogCancel className="!mt-0">Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDeleteEvent(event.id, event.event_name, event.event_type)}
                                          className="bg-red-600 hover:bg-red-700 border border-red-600 !mt-0"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )}
                              
                              {/* Submit Report button for PC and HSC users */}
                              {(userRole === 'pc' || userRole === 'program coordinator' || userRole === 'hsc' || userRole === 'head student coordinator') && (
                                <>
                                  {submittedEventIds.includes(event.id) ? (
                                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 mr-2">Report Already Submitted</span>
                                  ) : (
                                    <Button
                                      onClick={() => handleSubmitReport(event)}
                                      variant="outline"
                                      size="sm"
                                      className="border-green-500 text-green-500 hover:bg-green-50"
                                    >
                                      <FileUp className="h-4 w-4" />
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
                          {events.filter(event => event.event_type === 'pc_event').length === 0 
                            ? "No PC events found. Start by adding your first PC event!"
                            : "No PC events found for the selected filters."
                          }
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Events;

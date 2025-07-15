import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  FileText, 
  PlusCircle, 
  User, 
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const StudentCoordinatorDashboard = ({ isHeadCoordinator = false }) => {
  const [workingHours, setWorkingHours] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [recentEvents, setRecentEvents] = useState([]);
  const [departmentEvents, setDepartmentEvents] = useState([]);
  const [submittedEventIds, setSubmittedEventIds] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userDepartment, setUserDepartment] = useState("");

  // Constants for NSS requirements
  const REQUIRED_HOURS = 120;

  // Add pagination state for all tables
  const [deptCurrentPage, setDeptCurrentPage] = useState(1);
  const [deptItemsPerPage] = useState(10);
  const [reportsCurrentPage, setReportsCurrentPage] = useState(1);
  const [reportsItemsPerPage] = useState(10);
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
      const response = await fetch("http://localhost:5000/api/working-hours/my-hours", {
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
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // const fetchRecentEvents = async () => {
  //   const token = localStorage.getItem("nssUserToken");
  //   try {
  //     const eventsRes = await fetch("http://localhost:5000/api/events/recent", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (eventsRes.ok) {
  //       const eventsData = await eventsRes.json();
  //       setRecentEvents(eventsData);
  //     } else {
  //       setRecentEvents([]);
  //     }
  //   } catch (e) {
  //     setRecentEvents([]);
  //   }
  // };

  const fetchRecentReports = async () => {
    const token = localStorage.getItem("nssUserToken");
    try {
      const reportsRes = await fetch("http://localhost:5000/api/events/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setRecentReports(reportsData.slice(0, 5));
      } else {
        setRecentReports([]);
      }
    } catch (e) {
      setRecentReports([]);
    }
  };

  const fetchDepartmentEvents = async () => {
    const token = localStorage.getItem("nssUserToken");
    if (!token || userRole !== 'sc' && userRole !== 'student coordinator' || !userDepartment) return;
    const endpoint = `http://localhost:5000/api/events/department/${encodeURIComponent(userDepartment)}`;
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setDepartmentEvents(data);
    }
  };

  const fetchSubmittedReports = async () => {
    const token = localStorage.getItem("nssUserToken");
    if (!token || userRole !== 'sc' && userRole !== 'student coordinator') return;
    const res = await fetch("http://localhost:5000/api/events/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSubmittedEventIds(data.map(r => r.event_id));
    }
  };

  useEffect(() => {
    // Get user info from localStorage
    const token = localStorage.getItem("nssUserToken");
    const userStr = localStorage.getItem("nssUser");
    if (!token || !userStr) {
      window.location.href = "/login";
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const role = user.role ? user.role.toLowerCase() : "";
      setUserRole(role);
      setUserDepartment(user.department || "");
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    fetchWorkingHours();
    // fetchRecentEvents();
    fetchRecentReports();
    if (userRole === 'sc' || userRole === 'student coordinator') {
      fetchDepartmentEvents();
      fetchSubmittedReports();
    }
  }, [userRole, userDepartment]);

  // Calculate dynamic stats from real data
  const calculateStats = () => {
    const approvedHours = workingHours
      .filter(entry => entry.status === "approved")
      .reduce((total, entry) => total + (parseFloat(entry.hours) || 0), 0);
    
    const percentageComplete = Math.round((approvedHours / REQUIRED_HOURS) * 100);
    
    return {
      workingHours: approvedHours,
      targetHours: REQUIRED_HOURS,
      events: workingHours.length, // Total entries as events participated
      percentageComplete
    };
  };

  // Get recent working hours (last 5 entries)
  const getRecentWorkingHours = () => {
    return workingHours
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(entry => ({
        id: entry.id,
        activity: entry.activity_name,
        hours: parseFloat(entry.hours) || 0,
        date: entry.date,
        status: entry.status === "approved" ? "Approved" : 
                entry.status === "pending" ? "Pending" : "Rejected"
      }));
  };

  const stats = calculateStats();
  const recentWorking = getRecentWorkingHours();
  
  // Department Events pagination
  const deptIndexOfLast = deptCurrentPage * deptItemsPerPage;
  const deptIndexOfFirst = deptIndexOfLast - deptItemsPerPage;
  const deptCurrentItems = departmentEvents.slice(deptIndexOfFirst, deptIndexOfLast);
  const deptTotalPages = Math.ceil(departmentEvents.length / deptItemsPerPage);
  // Recent Reports pagination
  const reportsIndexOfLast = reportsCurrentPage * reportsItemsPerPage;
  const reportsIndexOfFirst = reportsIndexOfLast - reportsItemsPerPage;
  const reportsCurrentItems = recentReports.slice(reportsIndexOfFirst, reportsIndexOfLast);
  const reportsTotalPages = Math.ceil(recentReports.length / reportsItemsPerPage);
  // Working Hours pagination
  const whIndexOfLast = whCurrentPage * whItemsPerPage;
  const whIndexOfFirst = whIndexOfLast - whItemsPerPage;
  const whCurrentItems = recentWorking.slice(whIndexOfFirst, whIndexOfLast);
  const whTotalPages = Math.ceil(recentWorking.length / whItemsPerPage);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900">
          {isHeadCoordinator ? "Head Student Coordinator Dashboard" : "Student Coordinator Dashboard"}
        </h1>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Working Hours Progress
            </h3>
            <span className="text-sm text-muted-foreground">
              {stats.workingHours.toFixed(1)} / {stats.targetHours} hrs
            </span>
          </div>
          <Progress value={stats.percentageComplete} className="h-2" />
          <p className="text-sm text-muted-foreground">
            You have completed <span className="font-semibold text-blue-600">{stats.percentageComplete}%</span> of your target hours.
          </p>
        </Card>
        
        {/* Reports Submitted Card */}
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reports Submitted</p>
            <h3 className="text-2xl font-bold text-blue-900">{recentReports.length}</h3>
          </div>
        </div>
      </div>
      
      {/* Working Hours History */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Recent Working Hours</h2>
          <Link to="/working-hours" className="text-blue-600 hover:underline text-sm">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted text-blue-900">
              <tr>
                <th className="p-2 text-left">Activity</th>
                <th className="p-2 text-center">Hours</th>
                <th className="p-2 text-center">Date</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    Loading working hours...
                  </td>
                </tr>
              ) : whCurrentItems.length > 0 ? (
                whCurrentItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">{item.activity}</td>
                    <td className="p-2 text-center">{item.hours.toFixed(1)}</td>
                  <td className="p-2 text-center">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-2 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "Approved" ? "bg-green-100 text-green-800" : 
                        item.status === "Pending" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                    }`}>
                      {item.status}
                    </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No working hours logged yet. Start by adding your first entry!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
      </Card>
      
      {/* Recent Reports */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Recent Reports</h2>
          <Link to="/reports" className="text-blue-600 hover:underline text-sm">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted text-blue-900">
              <tr>
                <th className="p-2 text-left">Event Name</th>
                <th className="p-2 text-left">Event Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {reportsCurrentItems.length > 0 ? (
                reportsCurrentItems.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{report.event_name}</td>
                    <td className="p-2">
                      {report.event_date ? new Date(report.event_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        report.status === "approved" ? "bg-green-100 text-green-800" : 
                        report.status === "pending" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No reports submitted yet. Submit reports from the Events page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReportsCurrentPage(reportsCurrentPage - 1)}
              disabled={reportsCurrentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">{reportsCurrentPage} of {reportsTotalPages}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReportsCurrentPage(reportsCurrentPage + 1)}
              disabled={reportsCurrentPage === reportsTotalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Department Events Table for SC */}
      {(userRole === 'sc' || userRole === 'student coordinator') && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Department Events</h2>
            <Link to="/events" className="text-blue-600 hover:underline text-sm">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted text-blue-900">
                <tr>
                  <th className="p-2 text-left">Event Name</th>
                  <th className="p-2 text-left">Event Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Report</th>
                </tr>
              </thead>
              <tbody>
                {deptCurrentItems.length > 0 ? (
                  deptCurrentItems.map(event => (
                    <tr key={event.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{event.event_name}</td>
                      <td className="p-2">{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-2">{event.status}</td>
                      <td className="p-2">
                        {submittedEventIds.includes(event.id) ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Report Already Submitted</span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Not Submitted</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                      No department events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
        </Card>
      )}
    </div>
  );
};

export default StudentCoordinatorDashboard;

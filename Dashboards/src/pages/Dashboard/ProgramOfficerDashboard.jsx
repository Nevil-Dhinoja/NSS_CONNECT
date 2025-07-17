import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Users,
  Loader2,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProgramOfficerDashboard = () => {
  const [stats, setStats] = useState({
    volunteers: 0,
    pendingApprovals: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });
  
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
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
      setLoading(true);
      
      // Fetch volunteers for the PO's department
      const volunteersResponse = await fetch("http://172.16.11.213:5000/api/volunteers/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Fetch working hours for approvals
      const workingHoursResponse = await fetch("http://172.16.11.213:5000/api/working-hours/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (volunteersResponse.ok && workingHoursResponse.ok) {
        const volunteersData = await volunteersResponse.json();
        const workingHoursData = await workingHoursResponse.json();

        // Get user's department
        const userStr = localStorage.getItem("nssUser");
        const user = userStr ? JSON.parse(userStr) : {};
        const userDepartment = user.department;

        // Filter volunteers by PO's department
        const departmentVolunteers = volunteersData.filter(volunteer => 
          volunteer.department === userDepartment
        );

        // Filter working hours by PO's department and pending status
        const pendingWorkingHours = workingHoursData.filter(wh => 
          wh.status === "pending" && wh.department_name === userDepartment
        );

        // Fetch reports to count pending reports
        const reportsResForStats = await fetch("http://172.16.11.213:5000/api/events/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        let pendingReports = 0;
        if (reportsResForStats.ok) {
          const reportsData = await reportsResForStats.json();
          // Filter reports by PO's department and pending status
          pendingReports = reportsData.filter(report => 
            report.department_name === userDepartment && 
            report.status === "pending"
          ).length;
        }

        // Fetch events for stats
        const eventsResponse = await fetch("http://172.16.11.213:5000/api/events/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          
          // Filter events by PO's department
          const departmentEvents = eventsData.filter(event => 
            event.department_name === userDepartment
          );

          // Count upcoming and completed events
          const upcomingEvents = departmentEvents.filter(event => 
            event.status === "upcoming"
          ).length;
          
          const completedEvents = departmentEvents.filter(event => 
            event.status === "completed"
          ).length;

          // Update stats
          setStats({
            volunteers: departmentVolunteers.length || 0,
            pendingApprovals: (pendingWorkingHours.length + pendingReports) || 0,
            upcomingEvents: upcomingEvents,
            completedEvents: completedEvents
          });
        } else {
          // Update stats without events data
          setStats({
            volunteers: departmentVolunteers.length || 0,
            pendingApprovals: (pendingWorkingHours.length + pendingReports) || 0,
            upcomingEvents: 0,
            completedEvents: 0
          });
        }

        // Format all working hours for display (show 4-5 rows) - both pending and processed
        const allWorkingHours = workingHoursData.filter(wh => 
          wh.department_name === userDepartment
        );
        
        const formattedApprovals = allWorkingHours.slice(0, 5).map(wh => ({
          id: wh.id,
          type: "Working Hours",
          name: wh.student_name || "Unknown",
          date: wh.date,  
          department: wh.department_name || userDepartment,
          hours: wh.hours,
          activity: wh.activity_name,
          status: wh.status
        }));

        setPendingApprovals(formattedApprovals);

        // Fetch recent reports
        const reportsRes = await fetch("http://172.16.11.213:5000/api/events/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          // Filter reports by PO's department and show 4-5 recent ones
          const departmentReports = reportsData.filter(report => 
            report.department_name === userDepartment
          );
          setRecentReports(departmentReports.slice(0, 5));
        } else {
          setRecentReports([]);
        }
      }
    } catch (error) {
      // Error fetching dashboard data
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case "approved":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case "rejected":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
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

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: `${action === "approve" ? "Approved" : "Rejected"}`,
          description: `Working hours have been ${action === "approve" ? "approved" : "rejected"} successfully.`,
          variant: action === "approve" ? "default" : "destructive",
        });
        fetchDashboardData(); // Refresh the data
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900">Program Officer Dashboard</h1>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Volunteers</p>
            <h3 className="text-2xl font-bold text-blue-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.volunteers}
            </h3>
          </div>
        </div>
        
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-blue-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.pendingApprovals}
            </h3>
          </div>
        </div>
        
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
            <h3 className="text-2xl font-bold text-blue-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.upcomingEvents}
            </h3>
          </div>
        </div>
        
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed Events</p>
            <h3 className="text-2xl font-bold text-blue-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.completedEvents}
            </h3>
          </div>
        </div>
      </div>
      
      {/* Working Hours Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Recent Working Hours</h2>
          <Link to="/approvals" className="text-blue-600 hover:underline text-sm">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading working hours...</span>
            </div>
          ) : pendingApprovals.length > 0 ? (
          <table className="w-full">
            <thead className="bg-muted text-blue-900">
              <tr>
                <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Activity</th>
                  <th className="p-2 text-left">Hours</th>
                <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.activity}</td>
                    <td className="p-2">{item.hours} hrs</td>
                  <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="p-2">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? "Loading working hours..." : "No working hours found."}
            </div>
          )}
        </div>
      </Card>
      
      {/* Recent Reports Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Recent Reports</h2>
          <Link to="/approvals" className="text-blue-600 hover:underline text-sm">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading reports...</span>
              </div>
          ) : recentReports.length > 0 ? (
            <table className="w-full">
              <thead className="bg-muted text-blue-900">
                <tr>
                  <th className="p-2 text-left">Event Name</th>
                  <th className="p-2 text-left">Submitted By</th>
                  <th className="p-2 text-left">Event Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{report.event_name}</td>
                    <td className="p-2">{report.submitted_by_name || report.submitted_by}</td>
                    <td className="p-2">
                      {report.event_date ? new Date(report.event_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2">{getStatusBadge(report.status)}</td>
                    <td className="p-2">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? "Loading reports..." : "No reports found."}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProgramOfficerDashboard;

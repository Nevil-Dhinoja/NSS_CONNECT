import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Users 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProgramCoordinatorDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    programOfficers: 0,
    studentCoordinators: 0,
    reportsSubmitted: 0,
    upcomingEvents: 0,
    totalVolunteers: 0
  });
  
  const [reportsSubmitted, setReportsSubmitted] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("nssUserToken");
    if (!token) return;

    try {
      // Fetch stats
      await fetchStats(token);
      
      // Fetch reports submitted
      await fetchReportsSubmitted(token);
      
      // Fetch recent events
      await fetchRecentEvents(token);
      
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

  const fetchStats = async (token) => {
    try {
      // Fetch program officers count
      const poResponse = await fetch("http://172.16.11.213:5000/api/auth/users/Program%20Officer", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const programOfficers = await poResponse.json();
      
      // Fetch student coordinators count
      const scResponse = await fetch("http://172.16.11.213:5000/api/auth/users/Student%20Coordinator", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const studentCoordinators = await scResponse.json();
      
      // Fetch volunteers count
      const volResponse = await fetch("http://172.16.11.213:5000/api/volunteers/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const volunteers = await volResponse.json();
      
      // Fetch reports count (approved by PO, excluding PC-submitted reports)
      const reportsResponse = await fetch("http://172.16.11.213:5000/api/events/reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reports = await reportsResponse.json();
      const approvedReports = reports.filter(report => report.status === 'approved');
      
      // Fetch events count (excluding PC-created events for regular count)
      const eventsResponse = await fetch("http://172.16.11.213:5000/api/events/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const events = await eventsResponse.json();
      
      // Filter out PC-created events for regular counts
      const nonPCEvents = events.filter(event => 
        event.created_by_name && 
        !event.created_by_name.toLowerCase().includes('program coordinator') &&
        !event.created_by_name.toLowerCase().includes('pc')
      );
      
      setStats({
        totalEvents: nonPCEvents.length,
        programOfficers: programOfficers.length,
        studentCoordinators: studentCoordinators.length,
        reportsSubmitted: approvedReports.length,
        upcomingEvents: nonPCEvents.filter(e => new Date(e.event_date) > new Date()).length,
        totalVolunteers: volunteers.length
      });
    } catch (error) {
      // Error fetching stats
      toast({
        title: "Error",
        description: "Failed to fetch statistics.",
        variant: "destructive",
      });
    }
  };

  const fetchReportsSubmitted = async (token) => {
    try {
      const response = await fetch("http://172.16.11.213:5000/api/events/reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reports = await response.json();
      
      // Filter only reports approved by PO and exclude PC-submitted reports, take the first 5
      const approvedReports = reports
        .filter(report => 
          report.status === 'approved' && 
          report.submitted_by_name && 
          !report.submitted_by_name.toLowerCase().includes('program coordinator') &&
          !report.submitted_by_name.toLowerCase().includes('pc')
        )
        .slice(0, 5);
      setReportsSubmitted(approvedReports);
    } catch (error) {
      // Error fetching reports
      toast({
        title: "Error",
        description: "Failed to fetch reports.",
        variant: "destructive",
      });
    }
  };

  const fetchRecentEvents = async (token) => {
    try {
      const response = await fetch("http://172.16.11.213:5000/api/events/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const events = await response.json();
      
      // Filter out PC-created events and sort by date, take the most recent 6 events
      const nonPCEvents = events.filter(event => 
        event.created_by_name && 
        !event.created_by_name.toLowerCase().includes('program coordinator') &&
        !event.created_by_name.toLowerCase().includes('pc')
      );
      
      const sortedEvents = nonPCEvents
        .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
        .slice(0, 6);
      
      setRecentEvents(sortedEvents);
    } catch (error) {
      // Error fetching events
      toast({
        title: "Error",
        description: "Failed to fetch events.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-900">Program Coordinator Dashboard</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900">Program Coordinator Dashboard</h1>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <h3 className="text-2xl font-bold text-blue-900">{stats.totalEvents}</h3>
          </div>
        </div>
        
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Program Officers</p>
            <h3 className="text-2xl font-bold text-blue-900">{stats.programOfficers}</h3>
          </div>
        </div>
        
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Student Coordinators</p>
            <h3 className="text-2xl font-bold text-blue-900">{stats.studentCoordinators}</h3>
          </div>
        </div>
        
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reports Submitted</p>
            <h3 className="text-2xl font-bold text-blue-900">{stats.reportsSubmitted}</h3>
          </div>
        </div>
        
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
            <h3 className="text-2xl font-bold text-blue-900">{stats.upcomingEvents}</h3>
          </div>
        </div>
        
        <div className="nss-dashboard-card flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Volunteers</p>
            <h3 className="text-2xl font-bold text-blue-900">{stats.totalVolunteers}</h3>
          </div>
        </div>
      </div>
      
      {/* Reports Submitted Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Reports Approved by PO</h2>
          <Link to="/approvals" className="text-blue-600 hover:underline text-sm">View All Reports</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted text-blue-900">
              <tr>
                <th className="p-2 text-left">Event Name</th>
                <th className="p-2 text-left">Department</th>
                <th className="p-2 text-left">Submitted By</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportsSubmitted.length > 0 ? (
                reportsSubmitted.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{report.event_name}</td>
                    <td className="p-2">{report.department_name}</td>
                    <td className="p-2">{report.submitted_by_name || report.submitted_by}</td>
                    <td className="p-2">{new Date(report.created_at).toLocaleDateString()}</td>
                    <td className="p-2 flex justify-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'approved' ? 'bg-green-100 text-green-800' :
                        report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No reports submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Recent Events Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Recent Events</h2>
          <Link to="/events" className="text-blue-600 hover:underline text-sm">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted text-blue-900">
              <tr>
                <th className="p-2 text-left">Event Name</th>
                <th className="p-2 text-left">Department</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Mode</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{event.event_name}</td>
                    <td className="p-2">{event.department_name}</td>
                    <td className="p-2">{new Date(event.event_date).toLocaleDateString()}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.event_mode === 'online' ? 'bg-blue-100 text-blue-800' :
                        event.event_mode === 'offline' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {event.event_mode ? event.event_mode.charAt(0).toUpperCase() + event.event_mode.slice(1) : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProgramCoordinatorDashboard;

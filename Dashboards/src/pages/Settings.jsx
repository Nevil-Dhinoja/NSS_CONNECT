import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout.jsx";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Calendar,
  Settings as SettingsIcon,
  Trash2,
  User
} from "lucide-react";

const Settings = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setUserRole(role);
      setUserName(user.name);
      setUserEmail(user.email);
      fetchNotifications();
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("nssUserToken");
    if (!token) return;

    try {
      // Get user info to create user-specific notification key
      const userStr = localStorage.getItem("nssUser");
      const user = userStr ? JSON.parse(userStr) : {};
      const userKey = `nssNotifications_${user.id || user.email || 'default'}`;
      
      // Get existing notifications from localStorage for this specific user
      const existingNotifications = JSON.parse(localStorage.getItem(userKey) || '[]');
      
      // Only show essential notifications (no working hours status updates)
      const essentialNotifications = existingNotifications.filter(notification => 
        notification.type === 'profile' || 
        notification.type === 'security' ||
        (notification.type === 'working_hours' && notification.title.includes('Submitted'))
      );
      
      // Ensure all notifications have proper Date objects
      const processedNotifications = essentialNotifications.map(notification => ({
        ...notification,
        date: notification.date ? new Date(notification.date) : new Date(),
        timestamp: notification.timestamp ? new Date(notification.timestamp) : new Date()
      }));
      
      setNotifications(processedNotifications);
    } catch (error) {
      // Error fetching notifications
      toast({
        title: "Error",
        description: "Failed to fetch notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date(),
      date: notification.date ? new Date(notification.date) : new Date()
    };
    
    // Add to state
    setNotifications(prev => [newNotification, ...prev]);
    
    // Get user info to create user-specific notification key
    const userStr = localStorage.getItem("nssUser");
    const user = userStr ? JSON.parse(userStr) : {};
    const userKey = `nssNotifications_${user.id || user.email || 'default'}`;
    
    // Save to localStorage for this specific user
    const existingNotifications = JSON.parse(localStorage.getItem(userKey) || '[]');
    const updatedNotifications = [newNotification, ...existingNotifications].slice(0, 50); // Keep last 50
    localStorage.setItem(userKey, JSON.stringify(updatedNotifications));
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match.",
        variant: "destructive"
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast({
        title: "Invalid New Password",
        description: "New password must be different from current password.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const token = localStorage.getItem("nssUserToken");
      const response = await fetch("http://172.16.11.213:5000/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
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
        // Add notification
        addNotification({
          type: 'security',
          title: 'Password Updated Successfully',
          message: 'Your password has been changed successfully. Please remember your new password.',
          status: 'success',
          date: new Date(),
          priority: 'high'
        });

        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully.",
        });
        
        // Clear the form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(data.error || "Failed to update password");
      }
    } catch (error) {
      // Password update error
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getNotificationIcon = (type, status) => {
    if (type === 'working_hours') {
      switch (status) {
        case 'approved':
          return <CheckCircle className="h-5 w-5 text-green-600" />;
        case 'rejected':
          return <AlertCircle className="h-5 w-5 text-red-600" />;
        case 'pending':
          return <Clock className="h-5 w-5 text-yellow-600" />;
        default:
          return <FileText className="h-5 w-5 text-blue-600" />;
      }
    } else if (type === 'profile') {
      return <User className="h-5 w-5 text-blue-600" />;
    } else if (type === 'security') {
      return <SettingsIcon className="h-5 w-5 text-purple-600" />;
    }
    return <Bell className="h-5 w-5 text-blue-600" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Unknown time';
      }
      
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      // Error formatting timestamp
      return "Invalid date";
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    // Get user info to create user-specific notification key
    const userStr = localStorage.getItem("nssUser");
    const user = userStr ? JSON.parse(userStr) : {};
    const userKey = `nssNotifications_${user.id || user.email || 'default'}`;
    localStorage.removeItem(userKey);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared.",
    });
  };

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-nss-primary">Settings</h1>

        <Tabs defaultValue="notifications">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Notifications</h2>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {notifications.length} notifications
                  </Badge>
                  {notifications.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllNotifications}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading notifications...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.status)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(notification.status)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-500">
                      You're all caught up! New notifications will appear here.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              <div className="space-y-4 max-w-lg">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password (min 6 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                  />
                </div>

                <Button
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                  className="mt-4 bg-nss-primary hover:bg-nss-dark"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

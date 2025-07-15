import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X, User, Mail, Calendar, IdCard, Shield, Building, Loader2, Phone } from "lucide-react";

const Profile = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    login_id: "",
    email: "",
    role_id: "",
    role_name: "",
    department_id: "",
    department_name: "",
    institute: ""
  });
  const { toast } = useToast();

  const API_BASE_URL = "http://localhost:5000/api";

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
      
      // Map role to abbreviated form for consistency
      let mappedRole = role;
      if (role === "program coordinator") mappedRole = "pc";
      else if (role === "program officer") mappedRole = "po";
      else if (role === "student coordinator") mappedRole = "sc";
      else if (role === "head student coordinator") mappedRole = "hsc";
      
      setUserRole(mappedRole);
      setUserName(user.name);
      setUserEmail(user.email);
      fetchProfileData();
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nssUserToken");
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("nssUserToken");
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          login_id: profileData.login_id,
          ...(userRole === "sc" || userRole === "student coordinator" || userRole === "po" || userRole === "program officer" ? { contact: profileData.contact } : {})
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      
      // Update localStorage
      const userStr = localStorage.getItem("nssUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = profileData.name;
        user.email = profileData.email;
        localStorage.setItem("nssUser", JSON.stringify(user));
      }

      setUserName(profileData.name);
    setUserEmail(profileData.email);
    setIsEditing(false);

      // Add notification for profile update
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

      addNotification({
        type: 'profile',
        title: 'Profile Updated',
        message: 'Your profile information has been updated successfully',
        status: 'success',
        date: new Date(),
        priority: 'low'
      });

    toast({
      title: "Profile Updated",
        description: result.message || "Your profile has been updated successfully.",
    });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfileData(); // Reload original data
    setIsEditing(false);
  };

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = () => {
    return profileData.role_name || "User";
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "pc": return "from-purple-500 to-purple-700";
      case "po": return "from-blue-500 to-blue-700";
      case "sc": return "from-green-500 to-green-700";
      case "hsc": return "from-orange-500 to-orange-700";
      default: return "from-slate-500 to-slate-700";
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole={userRole} userName={userName} userEmail={userEmail}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-lg mt-4">Loading profile data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nss-primary">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-nss-primary hover:bg-nss-dark"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={saving}
                variant="outline"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className={`bg-gradient-to-br ${getRoleColor()} text-white text-2xl font-bold`}>
                      {profileData.name?.split(" ").map(name => name[0]).join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{profileData.name}</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getRoleColor()} text-white text-sm font-medium`}>
                    <Shield className="mr-1 h-4 w-4" />
                    {getRoleDisplayName()}
                  </div>
                  <p className="text-gray-600 flex items-center justify-center">
                    <Building className="mr-1 h-4 w-4" />
                    {(userRole === "pc" || userRole === "hsc") ? "CHARUSAT" : (profileData.department_name || "Department")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  {isEditing ? "Update your personal details below" : "Your personal information and contact details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name || ""}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="mr-1 h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email || ""}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login_id" className="flex items-center">
                      <IdCard className="mr-1 h-4 w-4" />
                      Login ID
                    </Label>
                    <Input
                      id="login_id"
                      value={profileData.login_id || ""}
                      onChange={(e) => setProfileData({ ...profileData, login_id: e.target.value })}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>
                  {/* Contact field for SC and PO users */}
                  {(userRole === "sc" || userRole === "student coordinator" || userRole === "po" || userRole === "program officer") && (
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="flex items-center">
                        <Phone className="mr-1 h-4 w-4" />
                        Contact Number
                      </Label>
                      <Input
                        id="contact"
                        value={profileData.contact || ""}
                        onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                        placeholder="Enter contact number"
                      />
                    </div>
                  )}
                  {(userRole !== "pc" && userRole !== "hsc") && (
                    <div className="space-y-2">
                      <Label htmlFor="department" className="flex items-center">
                        <Building className="mr-1 h-4 w-4" />
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={profileData.department_name || ""}
                        disabled={true}
                        className="bg-gray-50"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center">
                      <Shield className="mr-1 h-4 w-4" />
                      Role
                    </Label>
                    <Input
                      id="role"
                      value={profileData.role_name || ""}
                      disabled={true}
                      className="bg-gray-50"
                    />
                  </div>
                  {(userRole !== "pc" && userRole !== "hsc") && (
                    <div className="space-y-2">
                      <Label htmlFor="institute" className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        Institute
                      </Label>
                      <Input
                        id="institute"
                        value={profileData.institute || ""}
                        disabled={true}
                        className="bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Mail,
  Calendar,
  User,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Phone,
  Download
} from "lucide-react";
import { exportStudentLeadersToExcel } from "@/lib/excelExport";

const StudentLeaders = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userDepartment, setUserDepartment] = React.useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditingLeader, setIsEditingLeader] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [isAddingSC, setIsAddingSC] = useState(false);
  const [newSC, setNewSC] = useState({
    name: "",
    email: "",
    department: "",
    contact: ""
  });
  const [isSubmittingSC, setIsSubmittingSC] = useState(false);
  const [studentLeaders, setStudentLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filter states for PC role
  const [selectedInstitute, setSelectedInstitute] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [institutes, setInstitutes] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [newLeader, setNewLeader] = useState({
    name: "",
    loginId: "",
    email: "",
    institute: "",
    department: "",
    password: "",
    contact: "",
    position: "Student Coordinator" // Pre-fill position
  });

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

    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  // Fetch student leaders when user data is loaded
  React.useEffect(() => {
    if (userRole && (userRole === "pc" || userRole === "po" || userRole === "hsc" || userDepartment)) {
      fetchStudentLeaders();
      if (userRole === "pc" || userRole === "hsc") {
        fetchInstitutes();
      }
    }
  }, [userRole, userDepartment]);

  const fetchStudentLeaders = async () => {
    const token = localStorage.getItem("nssUserToken");
    try {
      // Fetch all student coordinators
      const roleName = encodeURIComponent("Student Coordinator");
      const response = await fetch(`http://172.16.11.213:5000/api/auth/users/${roleName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Filter based on user role and department
        let filteredLeaders;
        if (userRole === "pc" || userRole === "hsc") {
          // PC and HSC can see all departments (no filtering)
          filteredLeaders = data;
        } else if (userRole === "po") {
          // PO can only see their department
          filteredLeaders = data.filter(user => 
            user.department_name === userDepartment || 
            user.department_name === userDepartment + " Engineering"
          );
        } else {
          // Default to CE for other roles
          filteredLeaders = data.filter(user => 
            user.department_name === "CE" || user.department_name === "Computer Engineering"
          );
        }
        
        setStudentLeaders(filteredLeaders);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch student leaders",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student leaders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch institutes for PC role
  const fetchInstitutes = async () => {
    const token = localStorage.getItem("nssUserToken");
    try {
      const response = await fetch("http://172.16.11.213:5000/api/auth/institutes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInstitutes(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch institutes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch institutes.",
        variant: "destructive",
      });
    }
  };

  // Fetch departments for selected institute
  const fetchDepartments = async (instituteId) => {
    if (!instituteId || instituteId === "all") {
      setDepartments([]);
      return;
    }

    const token = localStorage.getItem("nssUserToken");
    try {
      const response = await fetch(`http://172.16.11.213:5000/api/auth/departments/${instituteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch departments.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch departments.",
        variant: "destructive",
      });
    }
  };

  // Handle institute selection change
  const handleInstituteChange = (instituteId) => {
    setSelectedInstitute(instituteId);
    if (instituteId === "all") {
      setSelectedDepartment("all");
      setDepartments([]);
    } else {
      setSelectedDepartment("all"); // Reset department when institute changes
      fetchDepartments(instituteId);
    }
  };

  // Initialize form with user's department and position when adding
  const initializeForm = () => {
    const userStr = localStorage.getItem("nssUser");
    const user = userStr ? JSON.parse(userStr) : {};
    
    setNewLeader({
      name: "",
      loginId: "",
      email: "",
      institute: "",
      department: "",
      password: "",
      position: "Student Coordinator" // Always set to Student Coordinator
    });
  };



  const handleEditLeader = (leader) => {
    setEditingLeader(leader);
    setNewLeader({
      name: leader.name,
      email: leader.email,
      contact: leader.contact || ""
    });
    setIsEditingLeader(true);
  };

  const handleUpdateLeader = async () => {
    if (!newLeader.name || !newLeader.email || !newLeader.contact) {
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
      const response = await fetch(`http://172.16.11.213:5000/api/auth/student-coordinator/${editingLeader.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newLeader.name,
          email: newLeader.email,
          contact: newLeader.contact,
          password: newLeader.password || undefined
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
          title: "Student Leader Updated",
          description: "Student leader information has been updated successfully.",
        });
        setIsEditingLeader(false);
        setEditingLeader(null);
        initializeForm();
        fetchStudentLeaders(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to update student leader");
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

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddSC = async () => {
    // Different validation for PC vs PO
    if (userRole === "pc") {
      if (!newSC.name || !newSC.email || !newSC.institute || !newSC.department || !newSC.contact) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!newSC.name || !newSC.email || !newSC.contact) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate email format
    if (!validateEmail(newSC.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingSC(true);
    const token = localStorage.getItem("nssUserToken");

    try {
      let scData;
      if (userRole === "pc") {
        // For PC, use the selected institute and department
        const selectedInstituteName = institutes.find(inst => inst.id.toString() === newSC.institute)?.name;
        const selectedDepartmentName = departments.find(dep => dep.id.toString() === newSC.department)?.name;
        scData = {
          name: newSC.name,
          email: newSC.email,
          department: selectedDepartmentName || newSC.department,
          contact: newSC.contact
        };
      } else {
        // For PO, use their department and don't include institute/department selection
        scData = {
          name: newSC.name,
          email: newSC.email,
          department: userDepartment,
          contact: newSC.contact
        };
      }

      const response = await fetch("http://172.16.11.213:5000/api/auth/add-student-coordinator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Student Coordinator ${newSC.name} has been added successfully. Welcome email has been sent.`,
        });

        // Reset form
        setNewSC({
          name: "",
          email: "",
          department: "",
          institute: "",
          contact: ""
        });
        setIsAddingSC(false);

        // Refresh the list
        fetchStudentLeaders();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add Student Coordinator",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add Student Coordinator",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingSC(false);
    }
  };

  const handleDeleteLeader = async (leaderId, leaderName) => {
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
      const response = await fetch(`http://172.16.11.213:5000/api/auth/student-coordinator/${leaderId}`, {
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
        toast({
          title: "Student Leader Removed",
          description: `${leaderName} has been removed from student leaders.`,
        });
        fetchStudentLeaders(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to delete student leader");
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

  // Filter student leaders based on search query and selected filters
  const filteredLeaders = studentLeaders.filter(leader => {
    const matchesSearch = leader.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leader.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leader.department_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leader.login_id?.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply institute filter for PC and HSC roles
    let matchesInstitute = true;
    if ((userRole === "pc" || userRole === "hsc") && selectedInstitute !== "all") {
      // For now, we'll filter by department since institute info might not be directly available
      // This can be enhanced when institute data is properly linked
      matchesInstitute = true; // Placeholder - can be enhanced when institute data is available
    }

    // Apply department filter for PC and HSC roles
    let matchesDepartment = true;
    if ((userRole === "pc" || userRole === "hsc") && selectedDepartment !== "all") {
      const selectedDept = departments.find(dep => dep.id?.toString() === selectedDepartment);
      if (selectedDept) {
        matchesDepartment = leader.department_name === selectedDept.name;
      }
    }

    return matchesSearch && matchesInstitute && matchesDepartment;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeaders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeaders.length / itemsPerPage);

  const getPositionBadge = (position) => {
    return position === "Head Student Coordinator"
      ? <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Head Coordinator</Badge>
      : <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Coordinator</Badge>;
  };

  const handleExportToExcel = () => {
    try {
      // Get current filters
      const filters = {};
      if (searchQuery) filters.search = searchQuery;
      if (selectedInstitute !== "all") filters.institute = selectedInstitute;
      if (selectedDepartment !== "all") filters.department = selectedDepartment;
      if (userDepartment) filters.userDepartment = userDepartment;
      if (userRole) filters.userRole = userRole;

      // Export filtered student leaders
      const result = exportStudentLeadersToExcel(filteredLeaders, filters);
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Student leaders exported to ${result.filename}`,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "Failed to export student leaders",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export student leaders: " + error.message,
        variant: "destructive"
      });
    }
  };

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg mt-4">Loading student leaders...</p>
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
            <h1 className="text-2xl font-bold text-nss-primary">Student Leaders</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleExportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search student leaders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {(userRole === "pc" || userRole === "po") && userRole !== "hsc" && (
              <>
                {(userRole === "pc" || userRole === "po") && (
                  <Dialog open={isAddingSC} onOpenChange={setIsAddingSC}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        onClick={() => setNewSC({
                          name: "",
                          email: "",
                          department: "",
                          institute: "",
                          contact: ""
                        })}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Add Student Coordinator
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Student Coordinator</DialogTitle>
                        <DialogDescription>
                          Add a new Student Coordinator for any department. They will receive a welcome email with login credentials.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="sc-name">Full Name *</Label>
                          <Input
                            id="sc-name"
                            value={newSC.name}
                            onChange={(e) => setNewSC({ ...newSC, name: e.target.value })}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sc-email">Email *</Label>
                          <Input
                            id="sc-email"
                            type="email"
                            value={newSC.email}
                            onChange={(e) => setNewSC({ ...newSC, email: e.target.value })}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sc-contact">Contact Number *</Label>
                          <Input
                            id="sc-contact"
                            type="tel"
                            value={newSC.contact}
                            onChange={(e) => setNewSC({ ...newSC, contact: e.target.value })}
                            placeholder="Enter contact number"
                            required
                          />
                        </div>
                        {userRole === "pc" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="sc-institute">Institute *</Label>
                              <Select value={newSC.institute} onValueChange={(value) => {
                                setNewSC({ ...newSC, institute: value, department: "" });
                                if (value) fetchDepartments(value);
                              }}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Institute" />
                                </SelectTrigger>
                                <SelectContent>
                                  {institutes && institutes.length > 0 && institutes.map(inst => (
                                    <SelectItem key={inst.id} value={inst.id.toString()}>{inst.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sc-department">Department *</Label>
                              <Select value={newSC.department} onValueChange={(value) => setNewSC({ ...newSC, department: value })}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments && departments.length > 0 && departments.map(dep => (
                                    <SelectItem key={dep.id} value={dep.id.toString()}>{dep.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        {userRole === "po" && (
                          <div className="space-y-2">
                            <Label htmlFor="sc-department-display">Department</Label>
                            <Input
                              id="sc-department-display"
                              value={userDepartment}
                              readOnly
                              disabled
                              className="bg-gray-100"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="sc-role">Role *</Label>
                          <Input
                            id="sc-role"
                            value="Student Coordinator"
                            readOnly
                            disabled
                            className="bg-gray-100"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleAddSC} disabled={isSubmittingSC} className="bg-green-600 hover:bg-green-700">
                            {isSubmittingSC ? "Adding..." : "Add Student Coordinator"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                                )}
              </>
            )}
          </div>
        </div>

        {/* Filters for PC and HSC roles */}
        {(userRole === "pc" || userRole === "program coordinator" || userRole === "hsc") && (
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <Label>Institute</Label>
              <Select value={selectedInstitute} onValueChange={handleInstituteChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Institute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutes</SelectItem>
                  {institutes && institutes.length > 0 && institutes.map(inst => (
                    <SelectItem key={inst.id} value={inst.id.toString()}>{inst.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2">
              <Label>Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments && departments.length > 0 && departments.map(dep => (
                    <SelectItem key={dep.id} value={dep.id.toString()}>{dep.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}



        {/* Edit Dialog */}
        <Dialog open={isEditingLeader} onOpenChange={setIsEditingLeader}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Student Coordinator</DialogTitle>
              <DialogDescription>
                Update student coordinator information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={newLeader.name}
                  onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newLeader.email}
                  readOnly
                  disabled
                  className="bg-gray-100"
                  placeholder="Email cannot be changed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Number *</Label>
                <Input
                  id="edit-contact"
                  type="tel"
                  value={newLeader.contact}
                  onChange={(e) => setNewLeader({ ...newLeader, contact: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={(() => {
                    if (userRole === "pc") {
                      // Try to find department name from departments list
                      return departments.find(dep => dep.id?.toString() === (editingLeader?.department_id?.toString() || editingLeader?.department?.toString()))?.name || editingLeader?.department_name || editingLeader?.department || "";
                    } else {
                      return userDepartment;
                    }
                  })()}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value="Student Coordinator"
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={newLeader.password || ""}
                  onChange={(e) => setNewLeader({ ...newLeader, password: e.target.value })}
                  placeholder="Enter new password (optional)"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditingLeader(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateLeader} className="bg-nss-primary hover:bg-nss-dark">
                  Update Coordinator
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Student Leaders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
                {(userRole === "pc" || userRole === "program coordinator" || userRole === "hsc")
                  ? "All Department Student Leaders"
                  : `${userDepartment} Department Student Leaders`
                }
            </CardTitle>
            <CardDescription>
                {(userRole === "pc" || userRole === "program coordinator" || userRole === "hsc")
                  ? "View all department NSS student coordinators"
                  : `Manage ${userDepartment} department NSS student coordinators`
                }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    {userRole !== "hsc" && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={userRole === "hsc" ? 4 : 5} className="text-center py-4">
                        Loading student leaders...
                      </TableCell>
                    </TableRow>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((leader) => (
                    <TableRow key={leader.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {leader.name.split(" ").map(name => name[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <div className="font-medium">{leader.name}</div>
                                <div className="text-sm text-gray-500">
                                  {leader.login_id || leader.loginId || "N/A"}
                                </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{leader.email}</span>
                        </div>
                        {leader.contact && (
                          <div className="flex items-center text-sm mt-1">
                            <Phone className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{leader.contact}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{leader.department_name || leader.department || "CE"}</span>
                        </div>
                      </TableCell>
                        <TableCell>{getPositionBadge("Student Coordinator")}</TableCell>
                      {userRole !== "hsc" && (
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {(userRole === "pc" || userRole === "program coordinator" || userRole === "po" || userRole === "program officer") && userRole !== "hsc" && (
                              <Button
                                onClick={() => handleEditLeader(leader)}
                                variant="outline"
                                size="sm"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {(userRole === "pc" || userRole === "program coordinator" || userRole === "po" || userRole === "program officer") && userRole !== "hsc" && (
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
                                    <AlertDialogTitle>Delete Student Coordinator</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete <strong>{leader.name}</strong>? This action cannot be undone and will remove their access to the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex flex-row justify-end gap-2">
                                  <AlertDialogCancel className="!mt-0">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteLeader(leader.id, leader.name)}
                                    className="bg-red-600 hover:bg-red-700 border border-red-600 !mt-0"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                      )}
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={userRole === "hsc" ? 4 : 5} className="text-center py-4">
                        No department student leaders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end space-x-2 py-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentLeaders;
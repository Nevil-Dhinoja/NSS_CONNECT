import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Upload, Download, Filter, Users, UserPlus, Mail, Phone, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { exportVolunteersToExcel } from "@/lib/excelExport";

const testPDF = () => {
  const doc = new jsPDF();
  doc.text("Test PDF", 10, 10);
  doc.autoTable({
    head: [["Name", "Age"]],
    body: [["Alice", 25], ["Bob", 30]],
  });
  doc.save("test.pdf");
};

const downloadVolunteerTemplate = () => {
  try {
    // Create a sample worksheet with new columns
    const ws = XLSX.utils.aoa_to_sheet([
      ["name", "adhar_no", "gender", "dob", "department", "year", "email", "contact"],
      ["John Doe", "123456789012", "M", "2000-01-01", "CE", "2024", "john@example.com", "9876543210"]
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VolunteersTemplate");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "volunteers_template.xlsx");
    toast({
      title: "Template Downloaded",
      description: "Volunteer template has been downloaded successfully.",
    });
  } catch (error) {
    toast({
      title: "Download Failed",
      description: "Failed to download template. Please try again.",
      variant: "destructive"
    });
  }
};

const Volunteers = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const { toast } = useToast();
  const [userDepartment, setUserDepartment] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [newVolunteer, setNewVolunteer] = useState({
    name: "",
    adhar_no: "",
    gender: "",
    dob: "",
    department: "",
    year: "",
    email: "",
    contact: ""
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editVolunteer, setEditVolunteer] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
      
      setUserRole(mappedRole);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserDepartment(user.department);

      // For Student Coordinators, always set department to CE
      const departmentForVolunteer = user.role?.toLowerCase() === "sc" ? "CE" : user.department;
      setNewVolunteer((prev) => ({ ...prev, department: departmentForVolunteer }));
    } catch (err) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);

  const fetchVolunteers = async () => {
    setLoadingVolunteers(true);
    const token = localStorage.getItem("nssUserToken");
    

    
    // Add department check for PO
    if (userRole === "po" && (!userDepartment || userDepartment === "undefined")) {
      toast({
        title: "Error",
        description: "Your department is not set. Please contact admin.",
        variant: "destructive"
      });
      setLoadingVolunteers(false);
      return;
    }

    try {
      // For Student Coordinators (sc), fetch only CE department volunteers
      // For Program Officers (po), fetch volunteers from their department
      // For Program Coordinators (pc), fetch all volunteers
      let endpoint;
      if (userRole === "sc") {
        endpoint = "http://172.16.11.213:5000/api/volunteers/department/CE";
      } else if (userRole === "po") {
        // For Program Officers, try their department first, fallback to CE if needed
        endpoint = `http://172.16.11.213:5000/api/volunteers/department/${userDepartment}`;
      } else if (userRole === "pc") {
        endpoint = "http://172.16.11.213:5000/api/volunteers/all";
      } else {
        // Default to all for unknown roles
        endpoint = "http://172.16.11.213:5000/api/volunteers/all";
      }



      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      

      
      if (response.ok) {
        // For Student Coordinators, double-check that we only have CE department volunteers
        let filteredData = data;
        if (userRole === "sc") {
          filteredData = data.filter(volunteer => volunteer.department === "CE");
        }
        // For PO users, the backend should already filter by department, so no additional filtering needed
        setVolunteers(filteredData);
      } else {
        // For Program Officers, if department-specific API fails, try to get all and filter
        if (userRole === "po" && response.status === 404) {
          try {
            const fallbackResponse = await fetch("http://172.16.11.213:5000/api/volunteers/all", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const fallbackData = await fallbackResponse.json();
            if (fallbackResponse.ok) {
              const filteredData = fallbackData.filter(volunteer => volunteer.department === userDepartment);
              setVolunteers(filteredData);
              return;
            }
          } catch (fallbackError) {
            // Fallback failed silently
          }
        }
        
        toast({
          title: "Error",
          description: data.error || "Failed to fetch volunteers",
          variant: "destructive"
        });
        setVolunteers([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch volunteers",
        variant: "destructive"
      });
      setVolunteers([]);
    } finally {
      setLoadingVolunteers(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchVolunteers();
      // Also fetch available departments for debugging
      if (userRole === "po") {
        fetchAvailableDepartments();
      }
    }
  }, [userRole, userDepartment]);

  // Reset current page when search query or year filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear]);

  // Pagination logic
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         volunteer.adhar_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = !selectedYear || volunteer.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVolunteers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchAvailableDepartments = async () => {
    const token = localStorage.getItem("nssUserToken");
    try {
      const response = await fetch("http://172.16.11.213:5000/api/volunteers/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Departments fetched successfully
      }
    } catch (error) {
      // Error fetching departments
    }
  };

  const handleUploadVolunteers = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file before uploading.",
        variant: "destructive",
      });
      return;
    }

    // Trigger the file upload
    const event = { target: { files: [selectedFile] } };
    handleFileUpload(event);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("nssUserToken");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://172.16.11.213:5000/api/volunteers/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      toast({
        title: "Upload Successful",
        description: data.message,
      });
      
      // Clear the selected file after successful upload
      setSelectedFile(null);
      
      // Refresh the volunteers list after successful upload
      await fetchVolunteers();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddVolunteer = async () => {
    if (!newVolunteer.name || !newVolunteer.adhar_no || !newVolunteer.gender || !newVolunteer.dob || !newVolunteer.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("nssUserToken");

      const response = await fetch("http://172.16.11.213:5000/api/volunteers/addVolunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVolunteer),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to add volunteer");
      }

      toast({
        title: "Volunteer Added",
        description: `${newVolunteer.name} has been successfully added.`,
      });

      setNewVolunteer({
        name: "",
        adhar_no: "",
        gender: "",
        dob: "",
        department: "",
        year: "",
        email: "",
        contact: "",
      });

      // Refresh volunteer list from backend and await the result
      await fetchVolunteers();
    } catch (error) {
      toast({
        title: "Add Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = () => {
    try {
      // Get current filters
      const filters = {};
      if (searchQuery) filters.search = searchQuery;
      if (selectedYear) filters.year = selectedYear;
      if (userDepartment) filters.department = userDepartment;
      if (userRole) filters.userRole = userRole;

      // Export filtered volunteers
      const result = exportVolunteersToExcel(filteredVolunteers, filters);
      
      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Volunteers exported to ${result.filename}`,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "Failed to export volunteers",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export volunteers: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditVolunteer = (volunteer) => {
    setEditVolunteer(volunteer);
    setEditDialogOpen(true);
  };

  const handleUpdateVolunteer = async () => {
    const token = localStorage.getItem("nssUserToken");
    const response = await fetch(`http://172.16.11.213:5000/api/volunteers/edit/${editVolunteer.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editVolunteer),
    });
    const data = await response.json();
    if (response.ok) {
      toast({ title: "Volunteer updated", description: data.message });
      setEditDialogOpen(false);
      fetchVolunteers();
    } else {
      toast({ title: "Update failed", description: data.error, variant: "destructive" });
    }
  };

  const handleDeleteVolunteer = async (volunteerId, volunteerName) => {
    const token = localStorage.getItem("nssUserToken");
    try {
      const response = await fetch(`http://172.16.11.213:5000/api/volunteers/delete/${volunteerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Volunteer Deleted",
          description: `${volunteerName} has been successfully deleted.`,
        });
        fetchVolunteers(); // Refresh the list
      } else {
        throw new Error(data.error || "Failed to delete volunteer");
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading volunteers...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nss-primary">Volunteers Management</h1>
          </div>

          <div className="flex space-x-2">
            {/* Only show add/upload buttons for PO and SC roles, not PC */}
            {(userRole === "po" || userRole === "sc" || userRole === "program officer" || userRole === "student coordinator") && (
              <>
                <Button variant="outline" onClick={downloadVolunteerTemplate}>
                  Download Template
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-nss-primary hover:bg-nss-dark">
                      <Upload className="mr-2 h-4 w-4" /> Upload Volunteer List
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Volunteers List</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="file">Excel/CSV File</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                          <Input 
                            id="file" 
                            type="file" 
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setSelectedFile(file);
                            }} 
                            className="hidden" 
                          />
                          <Label
                            htmlFor="file"
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {selectedFile ? `Selected: ${selectedFile.name}` : "Click to upload volunteers list (Excel or CSV format)"}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              Upload file with columns: name, adhar_no, gender, dob, department, year, email, contact
                            </span>
                          </Label>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleUploadVolunteers} className="bg-nss-primary hover:bg-nss-dark">
                          Upload Volunteers List
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" /> Add Single Volunteer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Volunteer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="academic-year">Academic Year</Label>
                        <Input
                          id="academic-year"
                          placeholder="Enter academic year"
                          value={newVolunteer.year}
                          onChange={(e) => setNewVolunteer({ ...newVolunteer, year: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="volunteer-name">Full Name</Label>
                          <Input
                            id="volunteer-name"
                            placeholder="Enter full name"
                            value={newVolunteer.name}
                            onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adhar_no">Adhar No</Label>
                          <Input
                            id="adhar_no"
                            value={newVolunteer.adhar_no}
                            onChange={e => setNewVolunteer({ ...newVolunteer, adhar_no: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            id="gender"
                            value={newVolunteer.gender}
                            onValueChange={value => setNewVolunteer({ ...newVolunteer, gender: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">Male</SelectItem>
                              <SelectItem value="F">Female</SelectItem>
                              <SelectItem value="O">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={newVolunteer.dob}
                            onChange={e => setNewVolunteer({ ...newVolunteer, dob: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={userRole === "sc" ? "CE" : userDepartment}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={newVolunteer.email}
                            onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="Enter phone number"
                            value={newVolunteer.contact}
                            onChange={(e) => setNewVolunteer({ ...newVolunteer, contact: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddVolunteer} className="bg-nss-primary hover:bg-nss-dark">
                          Add Volunteer
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-nss-primary" />
                <CardTitle>Volunteers List</CardTitle>
              </div>
            </div>
            <CardDescription>
              Manage and track NSS volunteers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-4">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <div>
                  <Input
                    id="year-filter"
                    type="text"
                    placeholder="Enter year"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="w-[140px]"
                  />
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search volunteers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportExcel}>Export to Excel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Adhar No</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingVolunteers ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        Loading volunteers...
                      </TableCell>
                    </TableRow>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell className="font-medium">{volunteer.name}</TableCell>
                        <TableCell>{volunteer.adhar_no}</TableCell>
                        <TableCell>{volunteer.gender}</TableCell>
                        <TableCell>{volunteer.dob ? new Date(volunteer.dob).toISOString().slice(0, 10) : ""}</TableCell>
                        <TableCell>{volunteer.department}</TableCell>
                        <TableCell>{volunteer.year}</TableCell>
                        <TableCell>{volunteer.email}</TableCell>
                        <TableCell>{volunteer.contact}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditVolunteer(volunteer)}>
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Volunteer</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete <strong>{volunteer.name}</strong>? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="!flex !flex-row !justify-end !gap-2 !space-x-2">
                                  <AlertDialogCancel className="!mt-0">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteVolunteer(volunteer.id, volunteer.name)}
                                    className="bg-red-600 hover:bg-red-700 border border-red-600 !mt-0"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        No volunteers found matching your criteria.
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
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">{currentPage} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Volunteer</DialogTitle>
            </DialogHeader>
            {editVolunteer && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editVolunteer.name}
                    onChange={e => setEditVolunteer({ ...editVolunteer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-adhar_no">Adhar No</Label>
                  <Input
                    id="edit-adhar_no"
                    value={editVolunteer.adhar_no}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select
                    id="edit-gender"
                    value={editVolunteer.gender}
                    onValueChange={value => setEditVolunteer({ ...editVolunteer, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="O">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dob">Date of Birth</Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={editVolunteer.dob}
                    onChange={e => setEditVolunteer({ ...editVolunteer, dob: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={editVolunteer.department}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Year</Label>
                  <Input
                    id="edit-year"
                    value={editVolunteer.year}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editVolunteer.email}
                    readOnly
                    disabled
                    className="bg-gray-100"
                    placeholder="Email cannot be changed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editVolunteer.contact}
                    onChange={e => setEditVolunteer({ ...editVolunteer, contact: e.target.value })}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleUpdateVolunteer} className="bg-nss-primary hover:bg-nss-dark">
                    Update Volunteer
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

export default Volunteers;

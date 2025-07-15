
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Departments = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const { toast } = useToast();

  // Mock departments data
  const departments = [
    { id: 1, name: "Computer Science & Engineering", programOfficer: "Prof. Patel", studentCoordinators: 2, volunteers: 45 },
    { id: 2, name: "Mechanical Engineering", programOfficer: "Dr. Sharma", studentCoordinators: 2, volunteers: 38 },
    { id: 3, name: "Electrical Engineering", programOfficer: "Prof. Verma", studentCoordinators: 2, volunteers: 32 },
    { id: 4, name: "Civil Engineering", programOfficer: "Dr. Gupta", studentCoordinators: 2, volunteers: 40 },
    { id: 5, name: "Information Technology", programOfficer: "Prof. Joshi", studentCoordinators: 1, volunteers: 35 },
  ];

  React.useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("nssUserToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    
    // Get user role from localStorage
    const role = localStorage.getItem("nssUserRole");
    const name = localStorage.getItem("nssUserName") || "";
    const email = localStorage.getItem("nssUserEmail") || "";
    
    // Only Program Coordinator should access this page
    if (role !== "pc") {
      window.location.href = "/dashboard";
      return;
    }
    
    setUserRole(role);
    setUserName(name);
    setUserEmail(email);
  }, []);

  const handleAddDepartment = () => {
    toast({
      title: "Department Added",
      description: "New department has been successfully added.",
    });
  };

  if (!userRole || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-nss-primary">Department Management</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-nss-primary hover:bg-nss-dark">
                <Plus className="mr-2 h-4 w-4" /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dept-name">Department Name</Label>
                  <Input id="dept-name" placeholder="e.g. Computer Science & Engineering" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept-code">Department Code</Label>
                  <Input id="dept-code" placeholder="e.g. CSE" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddDepartment} className="bg-nss-primary hover:bg-nss-dark">
                    Add Department
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-nss-accent p-2 rounded-lg">
                      <Briefcase className="h-5 w-5 text-nss-primary" />
                    </div>
                    <h3 className="font-semibold">{dept.name}</h3>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Program Officer: {dept.programOfficer}</p>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {dept.volunteers} Volunteers
                    </p>
                    <p>Student Coordinators: {dept.studentCoordinators}</p>
                  </div>
                </div>
                
                <Button variant="ghost" className="text-nss-primary" size="sm">
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Departments;

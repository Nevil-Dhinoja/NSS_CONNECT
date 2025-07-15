import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User, Clock } from "lucide-react";

const DashboardLayout = ({ children, userRole, userName, userEmail }) => {
  const navigate = useNavigate();
  const [sessionTimeLeft, setSessionTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    // Get login time from localStorage or set current time
    const loginTime = localStorage.getItem("nssLoginTime");
    if (!loginTime) {
      localStorage.setItem("nssLoginTime", Date.now().toString());
    }

    const timer = setInterval(() => {
      const loginTimeStamp = parseInt(localStorage.getItem("nssLoginTime") || Date.now().toString());
      const elapsed = Math.floor((Date.now() - loginTimeStamp) / 1000);
      const remaining = Math.max(0, 30 * 60 - elapsed); // 30 minutes - elapsed time
      
      setSessionTimeLeft(remaining);
      
      if (remaining <= 0) {
        // Session expired
        localStorage.clear();
        navigate("/login");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Initialize session time on component mount
  useEffect(() => {
    const loginTime = localStorage.getItem("nssLoginTime");
    if (loginTime) {
      const loginTimeStamp = parseInt(loginTime);
      const elapsed = Math.floor((Date.now() - loginTimeStamp) / 1000);
      const remaining = Math.max(0, 30 * 60 - elapsed);
      setSessionTimeLeft(remaining);
    }
  }, []);

  // Check token expiry on component mount
  useEffect(() => {
    const token = localStorage.getItem("nssUserToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("nssUserToken");
    localStorage.removeItem("nssLoginTime");
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar userRole={userRole} userName={userName} userEmail={userEmail} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-xl font-medium text-nss-primary ml-4">NSS Connect Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Session Timer */}
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800" style={{ color: "#1e40af" }}>
                <Clock className="h-3 w-3 mr-1" style={{ color: "#1e40af" }} />
                Session: {formatTime(sessionTimeLeft)}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-nss-primary text-white">
                        {userName.split(" ").map(name => name[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium hidden sm:inline-block">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2" style={{ 
                        color: "#1e40af",
                        backgroundColor: "#dbeafe"
                      }}>
                        {userRole === "pc" || userRole === "program coordinator"
                          ? "Program Coordinator"
                          : userRole === "po" || userRole === "program officer"
                            ? "Program Officer"
                            : userRole === "sc" || userRole === "student coordinator"
                              ? "Student Coordinator"
                              : userRole === "hsc" || userRole === "head student coordinator"
                                ? "Head Student Coordinator"
                                : "User"}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

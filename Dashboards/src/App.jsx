import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound.jsx";
import ProgramOfficers from "./pages/ProgramOfficers.jsx";
import StudentLeaders from "./pages/StudentLeaders.jsx";
import Volunteers from "./pages/Volunteers.jsx";
import Events from "./pages/Events.jsx";
import Reports from "./pages/Reports.jsx";
import WorkingHours from "./pages/WorkingHours.jsx";
import Approvals from "./pages/Approvals.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import LoginPCHSC from "./pages/LoginPCHSC.jsx";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/program-officers" element={<ProgramOfficers />} />
          <Route path="/student-leaders" element={<StudentLeaders />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/events" element={<Events />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/working-hours" element={<WorkingHours />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login-pc-hsc" element={<LoginPCHSC />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NSSLogo from "../assets/NSS.png";
import CharusatLogo from "../assets/5.png";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [institute, setInstitute] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth(); // ← context login method

  const departments = [
    { id: 1, name: "CE", instituteId: 1 },
    { id: 2, name: "IT", instituteId: 1 },
    { id: 3, name: "CSE", instituteId: 1 },
    { id: 4, name: "ME", instituteId: 2 },
    { id: 5, name: "AIML", instituteId: 2 },
    { id: 6, name: "CL", instituteId: 2 },
    { id: 7, name: "EE", instituteId: 2 },
    { id: 8, name: "CSE", instituteId: 2 },
    { id: 9, name: "IT", instituteId: 2 },
    { id: 10, name: "CE", instituteId: 2 },
    { id: 11, name: "EC", instituteId: 2 },
  ];

  const isDepRequired = ["1", "2"].includes(institute);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginId || !password || !userType || !institute) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isDepRequired && !department) {
      toast({
        title: "Department Required",
        description: "Please select your Department for DEPSTAR or CSPIT.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const loginPayload = {
        login_id: loginId,
        password,
        institute,
        role: userType,
        ...(department && { department }),
      };

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const data = await res.json();


      if (res.ok && data.success) {
        const { token, user } = data;

        login(
          {
            id: user.id,
            name: user.name,
            email: user.email || "",
            role: user.role, // Use the actual role from server response
            department: user.department || department || null, // Use server department first, then selected department
            institute,
          },
          token
        );

        toast({
          title: "Success",
          description: `Welcome ${user.name}`,
        });

        navigate("/dashboard", { replace: true });
      } else {
  
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials.",
          variant: "destructive",
        });
        // Clear any existing auth data to ensure clean state
        localStorage.removeItem("nssUserToken");
        localStorage.removeItem("nssUser");
        localStorage.removeItem("nssLoginTime");
      }
    } catch (err) {
      // Login error occurred
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', padding: 0, maxWidth: 900, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden' }}>
        <div style={{ flex: 1, background: '#1e3c72', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <img src={NSSLogo} alt="NSS Logo" style={{ width: 220, marginBottom: 24 }} />
          <h1 className="Slogan" style={{ color: '#fff', fontSize: 28, fontWeight: 600, textAlign: 'center', marginTop: 16 }}>
            "Not Me, But <span style={{ color: '#ff3b3b' }}>You"</span>
          </h1>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <img src={CharusatLogo} alt="Charusat Logo" style={{ width: 160, marginBottom: 24 }} />
          <form onSubmit={handleSubmit} className="form" style={{ width: '100%' }}>
            <div style={{ marginBottom: 20 }}>
              <Label className="text-gray-700 font-semibold text-base">Institute</Label>
              <Select value={institute} onValueChange={(v) => setInstitute(v)}>
                <SelectTrigger className="h-14 rounded-xl bg-gray-50 text-base">
                  <SelectValue placeholder="Select Institute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">DEPSTAR</SelectItem>
                  <SelectItem value="2">CSPIT</SelectItem>
                  <SelectItem value="3">PDPIAS</SelectItem>
                  <SelectItem value="4">RPCP</SelectItem>
                  <SelectItem value="5">IIIM</SelectItem>
                  <SelectItem value="6">ARIP</SelectItem>
                  <SelectItem value="7">CMPICA</SelectItem>
                  <SelectItem value="8">BDIPS</SelectItem>
                  <SelectItem value="9">MTIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isDepRequired && (
              <div style={{ marginBottom: 20 }}>
                <Label className="text-gray-700 font-semibold text-base">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="h-14 rounded-xl bg-gray-50 text-base">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter((dept) => dept.instituteId.toString() === institute)
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <Label className="text-gray-700 font-semibold text-base">Login As</Label>
              <Select value={userType} onValueChange={(value) => setUserType(value)}>
                <SelectTrigger className="h-14 rounded-xl bg-gray-50 text-base">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PO">Program Officer</SelectItem>
                  <SelectItem value="SC">Student Coordinator</SelectItem>
                  <SelectItem value="PC">Program Coordinator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label className="text-gray-700 font-semibold text-base">Login ID</Label>
              <Input
                placeholder="Enter your username"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                className="h-14 rounded-xl bg-gray-50 text-base px-4"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label className="text-gray-700 font-semibold text-base">Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 rounded-xl bg-gray-50 text-base px-4"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-14 text-white rounded-xl font-semibold text-lg mt-4"
              style={{ background: '#1e3c72' }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 flex flex-col items-center" style={{ width: '100%' }}>
            <Button
              variant="outline"
              className="w-full h-14 rounded-xl text-lg font-semibold mt-2"
              onClick={() => navigate("/login-pc-hsc")}
              type="button"
            >
              Login as PC/HSC
            </Button>
            <Button
              type="button"
              className="w-full h-14 text-white rounded-xl font-semibold text-lg mt-2"
              style={{ background: '#1e3c72' }}
              onClick={() => window.location.href = "http://localhost:5173/"}
            >
              GO TO NSS CHARUSAT
            </Button>
            <Button
              type="button"
              className="w-full h-14 text-white rounded-xl font-semibold text-lg mt-2"
              style={{ background: '#1e3c72' }}
              onClick={() => window.location.href = "/meet-developers"}
            >
              Meet Developers
            </Button>
          </div>
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} NSS Connect. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
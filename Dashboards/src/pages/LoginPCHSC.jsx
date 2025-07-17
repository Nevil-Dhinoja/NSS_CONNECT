import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NSSLogo from "../assets/NSS.png";
import CharusatLogo from "../assets/5.png";

const LoginPCHSC = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginId || !password || !userType) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const loginPayload = {
        login_id: loginId,
        password,
        role: userType,
      };
      const res = await fetch("http://172.16.11.213:5000/api/auth/login", {
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
            department: user.department || null,
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
              <Label className="text-gray-700 font-semibold text-base">Login ID</Label>
              <Input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter Login ID"
                className="h-14 rounded-xl bg-gray-50 text-base"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label className="text-gray-700 font-semibold text-base">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="h-14 rounded-xl bg-gray-50 text-base"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label className="text-gray-700 font-semibold text-base">Login As</Label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="h-14 rounded-xl bg-gray-50 text-base w-full px-4"
              >
                <option value="">Select Role</option>
                <option value="pc">Program Coordinator</option>
                <option value="hsc">Head Student Coordinator</option>
              </select>
            </div>
            <Button
              type="submit"
              className="w-full h-14 text-white rounded-xl font-semibold text-lg mt-4"
              style={{ background: '#1e3c72' }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              className="w-full h-14 text-white rounded-xl font-semibold text-lg mt-2"
              style={{ background: '#1e3c72' }}
              onClick={() => window.location.href = "http://172.16.11.213:5173/"}
            >
              GO TO NSS CHARUSAT
            </Button>
            <Button
              type="button"
              className="w-full h-14 text-white rounded-xl font-semibold text-lg mt-2"
              style={{ background: '#1e3c72' }}
              onClick={() => navigate("/login")}
            >
              Back to Previous SC Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPCHSC; 
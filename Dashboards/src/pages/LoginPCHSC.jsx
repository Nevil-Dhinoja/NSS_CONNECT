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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-8 px-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              PC/HSC Login
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Sign in as Program Coordinator or Head Student Coordinator
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold text-base">Login ID</Label>
                <Input
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Enter Login ID"
                  className="h-14 rounded-xl bg-gray-50 text-base"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold text-base">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="h-14 rounded-xl bg-gray-50 text-base"
                />
              </div>
              <div className="space-y-3">
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
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-lg mt-8"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPCHSC; 

import React from "react";
import { Card } from "@/components/ui/card";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nss-light to-nss-accent p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-nss-primary">NSS Connect</h1>
          <p className="text-muted-foreground">National Service Scheme Portal</p>
        </div>
        
        <Card className="p-6 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-nss-primary">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {children}
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NSS Connect. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

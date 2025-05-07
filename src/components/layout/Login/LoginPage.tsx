"use client";

import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../../Login";
import { LogIn } from "lucide-react";
import InfoSection from "./InfoSection";
import LoginForm from "./LoginForm";

interface LoginPageUIProps {
  form: UseFormReturn<FormValues>;
  userType: "donor" | "recipient" | "admin";
  setUserType: (type: "donor" | "recipient" | "admin") => void;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  formStatus: {
    type: "success" | "error" | null;
    message: string;
  };
  onSubmit: (values: FormValues) => Promise<void>;
}

export default function LoginPageUI({
  form,
  userType,
  setUserType,
  loading,
  showPassword,
  setShowPassword,
  formStatus,
  onSubmit,
}: LoginPageUIProps) {
  return (
    <div className="min-h-screen auth-background floating-shapes flex items-center justify-center p-4 md:p-8">
      {/* Main content */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-70 animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-70 animate-pulse-slow delay-700"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/10 rounded-full blur-xl opacity-50 animate-float-slow"></div>

        {/* Left side - Info */}
        <InfoSection userType={userType} />

        {/* Right side - Form */}
        <div className="relative z-10 order-1 md:order-2">
          <div className="glass-card w-full shadow-lg rounded-lg overflow-hidden">
            {/* Card header */}
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center gap-2 justify-center mb-2">
                <LogIn className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-center">Sign In</h2>
              </div>
              <p className="text-center text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            {/* User type selector */}
            <div className="p-6 pb-0">
              <div className="flex rounded-md overflow-hidden border border-border">
                <button
                  type="button"
                  onClick={() => setUserType("donor")}
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    userType === "donor"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("recipient")}
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    userType === "recipient"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  Recipient
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    userType === "admin"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Form */}
            <LoginForm
              form={form}
              onSubmit={onSubmit}
              formStatus={formStatus}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
            />
          </div>

          {/* Floating elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-primary/20 animate-float-slow"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-secondary/20 animate-float-slow delay-700"></div>
        </div>
      </div>
    </div>
  );
}

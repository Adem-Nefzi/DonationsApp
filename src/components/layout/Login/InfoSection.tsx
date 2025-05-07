import { Heart, Users, LogIn, Shield } from "lucide-react";

interface InfoSectionProps {
  userType: "donor" | "recipient" | "admin";
}

export default function InfoSection({ userType }: InfoSectionProps) {
  return (
    <div className="relative z-10 text-center md:text-left space-y-6 order-2 md:order-1">
      <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary">
        {userType === "donor" ? (
          <Heart size={24} />
        ) : userType === "recipient" ? (
          <Users size={24} />
        ) : (
          <Shield size={24} />
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome Back
        </h1>
        <p className="text-muted-foreground max-w-md">
          {userType === "donor"
            ? "Sign in to continue your journey of making a difference through your generous donations."
            : userType === "recipient"
            ? "Sign in to manage your campaigns and connect with donors who believe in your mission."
            : "Sign in to manage the platform and oversee all donation activities."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-sm">
              {userType === "donor"
                ? "Support causes you care about"
                : userType === "recipient"
                ? "Receive support for your mission"
                : "Manage all platform users"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-sm">
              {userType === "donor"
                ? "Track your donation impact"
                : userType === "recipient"
                ? "Connect with generous donors"
                : "Monitor donation activities"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-sm">
              {userType === "donor"
                ? "Get tax-deductible receipts"
                : userType === "recipient"
                ? "Manage and report on donations"
                : "Generate platform analytics"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 hidden md:block">
        <div className="relative w-full h-64 bg-dot-pattern rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2 p-6 glass-card rounded-lg max-w-xs mx-auto transform hover:scale-105 transition-all duration-300">
              <LogIn size={48} className="mx-auto text-primary" />
              <p className="text-lg font-medium text-foreground">
                Secure Authentication
              </p>
              <p className="text-sm text-muted-foreground">
                Your data is protected with industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

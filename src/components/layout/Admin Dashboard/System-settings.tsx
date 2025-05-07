"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Donation Management System",
    siteDescription:
      "A platform connecting donors, recipients, and associations for effective donation management.",
    contactEmail: "admin@donationsystem.com",
    supportPhone: "+1 (555) 123-4567",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    defaultUserRole: "recipient",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@donationsystem.com",
    smtpPassword: "••••••••••••",
    senderName: "Donation System",
    senderEmail: "no-reply@donationsystem.com",
    enableEmailNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "60",
    maxLoginAttempts: "5",
    passwordMinLength: "8",
    requireStrongPasswords: true,
    enableTwoFactorAuth: false,
    allowSocialLogin: true,
  });

  const handleGeneralSettingsChange = (
    key: string,
    value: string | boolean
  ) => {
    setGeneralSettings({ ...generalSettings, [key]: value });
  };

  const handleEmailSettingsChange = (key: string, value: string | boolean) => {
    setEmailSettings({ ...emailSettings, [key]: value });
  };

  const handleSecuritySettingsChange = (
    key: string,
    value: string | boolean
  ) => {
    setSecuritySettings({ ...securitySettings, [key]: value });
  };

  const handleSaveSettings = () => {
    // In a real app, you would save the settings to the backend
    console.log("Saving settings:", {
      general: generalSettings,
      email: emailSettings,
      security: securitySettings,
    });
  };

  const handleTestEmailConnection = () => {
    // In a real app, you would test the email connection
    console.log("Testing email connection with settings:", emailSettings);
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={generalSettings.siteName}
                  onChange={(e) =>
                    handleGeneralSettingsChange("siteName", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={generalSettings.siteDescription}
                  onChange={(e) =>
                    handleGeneralSettingsChange(
                      "siteDescription",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) =>
                    handleGeneralSettingsChange("contactEmail", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input
                  id="support-phone"
                  value={generalSettings.supportPhone}
                  onChange={(e) =>
                    handleGeneralSettingsChange("supportPhone", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="default-user-role">Default User Role</Label>
                <Select
                  value={generalSettings.defaultUserRole}
                  onValueChange={(value) =>
                    handleGeneralSettingsChange("defaultUserRole", value)
                  }
                >
                  <SelectTrigger id="default-user-role">
                    <SelectValue placeholder="Select default role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donor">Donor</SelectItem>
                    <SelectItem value="recipient">Recipient</SelectItem>
                    <SelectItem value="association_admin">
                      Association Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the site will be inaccessible to regular users
                  </p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    handleGeneralSettingsChange("maintenanceMode", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-registration">Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register on the platform
                  </p>
                </div>
                <Switch
                  id="allow-registration"
                  checked={generalSettings.allowRegistration}
                  onCheckedChange={(checked) =>
                    handleGeneralSettingsChange("allowRegistration", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-email-verification">
                    Require Email Verification
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require users to verify their email before accessing the
                    platform
                  </p>
                </div>
                <Switch
                  id="require-email-verification"
                  checked={generalSettings.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    handleGeneralSettingsChange(
                      "requireEmailVerification",
                      checked
                    )
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto gap-2" onClick={handleSaveSettings}>
                <Save className="h-4 w-4" /> Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email server and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="smtp-server">SMTP Server</Label>
                <Input
                  id="smtp-server"
                  value={emailSettings.smtpServer}
                  onChange={(e) =>
                    handleEmailSettingsChange("smtpServer", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  value={emailSettings.smtpPort}
                  onChange={(e) =>
                    handleEmailSettingsChange("smtpPort", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-username">SMTP Username</Label>
                <Input
                  id="smtp-username"
                  value={emailSettings.smtpUsername}
                  onChange={(e) =>
                    handleEmailSettingsChange("smtpUsername", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) =>
                    handleEmailSettingsChange("smtpPassword", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sender-name">Sender Name</Label>
                <Input
                  id="sender-name"
                  value={emailSettings.senderName}
                  onChange={(e) =>
                    handleEmailSettingsChange("senderName", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sender-email">Sender Email</Label>
                <Input
                  id="sender-email"
                  type="email"
                  value={emailSettings.senderEmail}
                  onChange={(e) =>
                    handleEmailSettingsChange("senderEmail", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-email-notifications">
                    Enable Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for system events
                  </p>
                </div>
                <Switch
                  id="enable-email-notifications"
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) =>
                    handleEmailSettingsChange(
                      "enableEmailNotifications",
                      checked
                    )
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleTestEmailConnection}
              >
                <RefreshCw className="h-4 w-4" /> Test Connection
              </Button>
              <Button className="gap-2" onClick={handleSaveSettings}>
                <Save className="h-4 w-4" /> Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="session-timeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    handleSecuritySettingsChange(
                      "sessionTimeout",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) =>
                    handleSecuritySettingsChange(
                      "maxLoginAttempts",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-min-length">
                  Password Minimum Length
                </Label>
                <Input
                  id="password-min-length"
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) =>
                    handleSecuritySettingsChange(
                      "passwordMinLength",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-strong-passwords">
                    Require Strong Passwords
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require passwords to include uppercase, lowercase, numbers,
                    and special characters
                  </p>
                </div>
                <Switch
                  id="require-strong-passwords"
                  checked={securitySettings.requireStrongPasswords}
                  onCheckedChange={(checked) =>
                    handleSecuritySettingsChange(
                      "requireStrongPasswords",
                      checked
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-two-factor-auth">
                    Enable Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to enable two-factor authentication
                  </p>
                </div>
                <Switch
                  id="enable-two-factor-auth"
                  checked={securitySettings.enableTwoFactorAuth}
                  onCheckedChange={(checked) =>
                    handleSecuritySettingsChange("enableTwoFactorAuth", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-social-login">Allow Social Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to login with social media accounts
                  </p>
                </div>
                <Switch
                  id="allow-social-login"
                  checked={securitySettings.allowSocialLogin}
                  onCheckedChange={(checked) =>
                    handleSecuritySettingsChange("allowSocialLogin", checked)
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto gap-2" onClick={handleSaveSettings}>
                <Save className="h-4 w-4" /> Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Database Connection</span>
              </div>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500"
              >
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Email Server</span>
              </div>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500"
              >
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span>Storage Usage</span>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                42% (4.2/10GB)
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Pending Updates</span>
              </div>
              <Badge
                variant="outline"
                className="bg-yellow-500/10 text-yellow-500"
              >
                3 Updates
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Security Status</span>
              </div>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500"
              >
                Secure
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

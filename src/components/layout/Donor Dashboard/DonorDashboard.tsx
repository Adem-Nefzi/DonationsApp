"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageSquare,
  Moon,
  Sun,
  TrendingUp,
  Users,
  LogOut,
  User,
  Edit,
  Save,
  Eye,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "../../../hooks/use-toast";
import AssociationsList from "./AssociationList";
import DonationHistory from "./DonationHistory";
import ChatSection from "./ChatSection";
import { logout } from "@/api/auth";
import { deleteUserAccount, updateUserProfile } from "@/api/crud";
import { getUserProfile } from "@/api/crud";
export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("discover");
  const [theme, setTheme] = useState("light");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [DeleteDialog, setDeleteDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewProfileDialog, setShowViewProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [currentProfile, setCurrentProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    userType: "donor",
  });
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        setCurrentProfile({
          firstName: response.user.first_name || "",
          lastName: response.user.last_name || "",
          email: response.user.email || "",
          phone: response.user.phone || "",
          address: response.user.address || "",
          userType: response.user.user_type || "donor",
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (showViewProfileDialog) {
      fetchProfileData();
    }
  }, [showViewProfileDialog]);

  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setTheme(prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  //LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await logout(); // API call to log out on the server
      localStorage.removeItem("sanctum_token"); // Clear token from storage

      toast({
        title: "🎉 See you soon!",
        description: "You’ve been successfully logged out.",
        className:
          "border border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });

      // Delay the redirect slightly to allow toast to show
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // Update Profile Function
  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        ...(profileData.password && {
          password: profileData.password,
          confirmPassword: profileData.confirmPassword,
        }),
      });

      toast({
        title: "Updated successfully",
        description: "You have updated your profile successfully.",
        className:
          "border border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
      setShowProfileDialog(false);
    } catch (error) {
      console.error("Update error", error);
      toast({
        title: "Updating Profile Failed",
        description: "An error occurred while updating Profile.",
        className:
          "border border-red-300 dark:border-red-600/40 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // 1. Make the deletion request
      await deleteUserAccount();

      // 2. Clear ALL auth-related data
      localStorage.removeItem("access_token"); // or whatever your token key is
      localStorage.removeItem("user");
      sessionStorage.clear();

      toast({
        title: "Account deleted successfully",
        description: "Your account has been deleted.",
        className:
          "border border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });

      // 5. Force redirect with page reload to clear any state
      window.location.href = "/login"; // Full page reload
    } catch (error) {
      console.error("Delete error", error);
      toast({
        title: "Deleting account failed",
        description: "An error occurred while deleting your account.",
        className:
          "border border-red-300 dark:border-red-600/40 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
    }
  };
  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 to-slate-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-400">
              Donor Dashboard
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Support causes that matter to you
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-opacity-20 hover:bg-indigo-500 transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="border-2 border-primary hover:scale-105 transition-transform cursor-pointer">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`w-56 mt-2 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white"
                }`}
                align="end"
              >
                {/* New View Profile Option */}
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-500"
                  onClick={() => setShowViewProfileDialog(true)} // Or your profile route
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>

                {/* Existing Edit Profile Option */}
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-500"
                  onClick={() => setShowProfileDialog(true)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator
                  className={theme === "dark" ? "bg-slate-700" : "bg-slate-100"}
                />

                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-500/10 focus:text-red-500"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-500/10 focus:text-red-500"
                  onClick={() => setDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Account</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent
            className={`sm:max-w-[425px] rounded-lg ${
              theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
            }`}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-red-500" />
                Confirm Logout
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to log out of your donor account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={DeleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent
            className={`sm:max-w-[425px] rounded-lg ${
              theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
            }`}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-red-500" />
                Confirm Deleting Account
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to Delete your account ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-[425px] p-0 rounded-lg overflow-hidden border-0 shadow-lg">
            {/* Decorative background elements (subtler version) */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-xl opacity-10 ${
                theme === "dark" ? "bg-purple-500" : "bg-indigo-200"
              }`}
            />

            {/* Header with compact gradient */}
            <div
              className={`relative px-4 py-3 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900"
                  : "bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex items-center gap-2 z-10 relative">
                <div
                  className={`p-1.5 rounded-md ${
                    theme === "dark"
                      ? "bg-indigo-900/30 text-indigo-300"
                      : "bg-white text-indigo-600 shadow-sm"
                  }`}
                >
                  <Edit className="h-3.5 w-3.5" />
                </div>
                <DialogTitle
                  className={`text-sm font-semibold ${
                    theme === "dark" ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  Edit Profile
                </DialogTitle>
              </div>
            </div>

            <div className="relative px-4 py-3 space-y-3">
              {/* Personal Info - Compact with accent */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-0.5 h-4 rounded-full ${
                      theme === "dark"
                        ? "bg-gradient-to-b from-indigo-400 to-purple-400"
                        : "bg-indigo-400"
                    }`}
                  />
                  <h4
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-indigo-200" : "text-indigo-600"
                    }`}
                  >
                    Personal
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="First name"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    className={`h-8 text-xs ${
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 hover:border-indigo-400/50"
                        : "bg-white border-slate-200 hover:border-indigo-300"
                    }`}
                  />
                  <Input
                    placeholder="Last name"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    className={`h-8 text-xs ${
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 hover:border-indigo-400/50"
                        : "bg-white border-slate-200 hover:border-indigo-300"
                    }`}
                  />
                </div>
              </div>

              {/* Contact Info - Compact with accent */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-0.5 h-4 rounded-full ${
                      theme === "dark"
                        ? "bg-gradient-to-b from-amber-400 to-orange-400"
                        : "bg-amber-400"
                    }`}
                  />
                  <h4
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-amber-200" : "text-amber-600"
                    }`}
                  >
                    Contact
                  </h4>
                </div>
                <Input
                  placeholder="Address"
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData({ ...profileData, address: e.target.value })
                  }
                  className={`h-8 text-xs ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 hover:border-amber-400/50"
                      : "bg-white border-slate-200 hover:border-amber-300"
                  }`}
                />
                <Input
                  placeholder="Phone"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className={`h-8 text-xs ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 hover:border-amber-400/50"
                      : "bg-white border-slate-200 hover:border-amber-300"
                  }`}
                />
              </div>

              {/* Password - Compact with accent */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-0.5 h-4 rounded-full ${
                      theme === "dark"
                        ? "bg-gradient-to-b from-purple-400 to-pink-400"
                        : "bg-purple-400"
                    }`}
                  />
                  <h4
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-purple-200" : "text-purple-600"
                    }`}
                  >
                    Security
                  </h4>
                </div>
                <Input
                  type="password"
                  placeholder="New password"
                  value={profileData.password}
                  onChange={(e) =>
                    setProfileData({ ...profileData, password: e.target.value })
                  }
                  className={`h-8 text-xs ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 hover:border-purple-400/50"
                      : "bg-white border-slate-200 hover:border-purple-300"
                  }`}
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={profileData.confirmPassword}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={`h-8 text-xs ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 hover:border-purple-400/50"
                      : "bg-white border-slate-200 hover:border-purple-300"
                  }`}
                />
              </div>
            </div>

            {/* Footer with subtle gradient */}
            <div
              className={`px-4 py-2 border-t ${
                theme === "dark"
                  ? "border-slate-800 bg-gradient-to-r from-slate-800/80 to-slate-900/80"
                  : "border-slate-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
              } flex justify-end gap-2`}
            >
              <Button
                variant="ghost"
                onClick={() => setShowProfileDialog(false)}
                className={`h-7 px-3 text-xs ${
                  theme === "dark"
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProfileUpdate}
                className="h-7 px-3 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showViewProfileDialog}
          onOpenChange={setShowViewProfileDialog}
        >
          <DialogContent className="sm:max-w-[425px] p-0 rounded-lg overflow-hidden border-0 shadow-lg">
            {/* Decorative background */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-xl opacity-10 ${
                theme === "dark" ? "bg-purple-500" : "bg-indigo-200"
              }`}
            />

            {/* Header */}
            <div
              className={`relative px-4 py-3 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900"
                  : "bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex items-center gap-2 z-10 relative">
                <div
                  className={`p-1.5 rounded-md ${
                    theme === "dark"
                      ? "bg-indigo-900/30 text-indigo-300"
                      : "bg-white text-indigo-600 shadow-sm"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                </div>
                <DialogTitle
                  className={`text-sm font-semibold ${
                    theme === "dark" ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  My Profile
                </DialogTitle>
              </div>
            </div>

            {/* Profile Content */}
            <div className="relative px-4 py-3 space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                <>
                  {/* Avatar and Basic Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {currentProfile.firstName} {currentProfile.lastName}
                      </h3>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {currentProfile.userType === "donor"
                          ? "Donor"
                          : "Recipient"}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    <div
                      className={`p-3 rounded-lg ${
                        theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"
                      }`}
                    >
                      <h4
                        className={`text-xs font-medium mb-2 ${
                          theme === "dark"
                            ? "text-indigo-300"
                            : "text-indigo-600"
                        }`}
                      >
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            Email
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {currentProfile.email}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            Phone
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {currentProfile.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"
                      }`}
                    >
                      <h4
                        className={`text-xs font-medium mb-2 ${
                          theme === "dark" ? "text-amber-300" : "text-amber-600"
                        }`}
                      >
                        Address
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {currentProfile.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div
              className={`px-4 py-3 border-t ${
                theme === "dark"
                  ? "border-slate-800 bg-gradient-to-r from-slate-800/80 to-slate-900/80"
                  : "border-slate-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
              } flex justify-end`}
            >
              <Button
                variant="ghost"
                onClick={() => setShowViewProfileDialog(false)}
                className={`h-8 px-3 text-xs ${
                  theme === "dark"
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowViewProfileDialog(false);
                  setShowProfileDialog(true);
                }}
                className="h-8 px-3 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm ml-2"
                disabled={loading || !!error}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Welcome Banner */}
        <div
          className={`mb-8 rounded-xl shadow-lg ${
            theme === "dark"
              ? "bg-gradient-to-r from-slate-700 to-slate-800"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          } p-6 text-white relative overflow-hidden`}
        >
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back,{" "}
              <span className="text-blue-300">
                {currentProfile.firstName || "User"}
              </span>
            </h1>
            <p className="opacity-90 max-w-xl">
              Your generosity has helped 5 associations so far. Discover new
              causes that need your support today.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList
            className={`grid grid-cols-3 w-full max-w-md mx-auto md:mx-0 shadow-sm ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-white border"
            }`}
          >
            <TabsTrigger
              value="discover"
              className="transition-all data-[state=active]:shadow-sm"
            >
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="donations"
              className="transition-all data-[state=active]:shadow-sm"
            >
              My Donations
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="transition-all data-[state=active]:shadow-sm"
            >
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card
                className={`group hover:-translate-y-1 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white"
                } rounded-xl overflow-hidden shadow-md hover:shadow-lg`}
              >
                <div
                  className={`h-1 w-full group-hover:h-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-indigo-600"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500"
                  }`}
                ></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Donations
                  </CardTitle>
                  <div
                    className={`rounded-full p-2 transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30"
                        : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <p className="text-xs text-green-500">+2 from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`group hover:-translate-y-1 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white"
                } rounded-xl overflow-hidden shadow-md hover:shadow-lg`}
              >
                <div
                  className={`h-1 w-full group-hover:h-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-purple-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                ></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Associations Helped
                  </CardTitle>
                  <div
                    className={`rounded-full p-2 transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30"
                        : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    Across 3 categories
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`group hover:-translate-y-1 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white"
                } rounded-xl overflow-hidden shadow-md hover:shadow-lg`}
              >
                <div
                  className={`h-1 w-full group-hover:h-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-blue-600"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  }`}
                ></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unread Messages
                  </CardTitle>
                  <div
                    className={`rounded-full p-2 transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30"
                        : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    2 new conversations
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Discover Associations */}
            <Card
              className={`group hover:shadow-lg transition-all duration-300 ${
                theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
              } rounded-xl`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Discover Associations
                </CardTitle>
                <CardDescription>
                  Find causes that align with your values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AssociationsList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <Card
              className={`group hover:shadow-lg transition-all duration-300 ${
                theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
              } rounded-xl`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-indigo-500" />
                  Your Donation History
                </CardTitle>
                <CardDescription>Track your contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationHistory />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card
              className={`group hover:shadow-lg transition-all duration-300 ${
                theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
              } rounded-xl`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Messages
                </CardTitle>
                <CardDescription>Chat with associations</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

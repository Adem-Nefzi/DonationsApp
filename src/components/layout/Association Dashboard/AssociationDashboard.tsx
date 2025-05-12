"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  MessageSquare,
  Moon,
  Package,
  Sun,
  Users,
  LogOut,
  Eye,
  Trash2,
  Edit,
  Save,
  Loader2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Info,
  Image,
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
import { useToast } from "../../../hooks/use-toast";
import DonationsList from "./DonationsList";
import ApplicantsList from "./ApplicantsList";
import ChatSection from "./ChatSection";
import NotificationsPanel from "../Donor Dashboard/NotificationsPanel";
import NeedsList from "./NeedsList";
import { logout } from "@/api/auth";
import {
  deleteAssociationAccount,
  getAssociationProfile,
  updateAssociationProfile,
} from "@/api/crud";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AssociationDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showViewProfileDialog, setShowViewProfileDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Current profile data (for viewing)
  const [currentProfile, setCurrentProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    category: "",
    logo_url: null as string | File | null,
  });

  // Profile data for editing
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    category: "" as
      | "Food"
      | "Clothes"
      | "Healthcare"
      | "Education"
      | "Home supplies"
      | undefined,
    logo_url: null as string | File | null,
    password: "",
    confirmPassword: "",
  });

  // Theme handling
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

  // Fetch profile data on initial load and when view dialog opens
  useEffect(() => {
    const fetchAssociationProfile = async () => {
      try {
        setLoading(true);
        const response = await getAssociationProfile();

        // Extract association data from response
        // Handle different response structures
        let associationData;
        if (response.data && response.data.association) {
          associationData = response.data.association;
        } else if (response.association) {
          associationData = response.association;
        } else if (response.user) {
          associationData = response.user;
        } else {
          associationData = response;
        }

        if (!associationData) {
          throw new Error("No association data received");
        }

        // Update both current profile and profile data
        const profileUpdate = {
          name: associationData.name || "",
          email: associationData.email || "",
          phone: associationData.phone || "",
          address: associationData.address || "",
          description: associationData.description || "",
          category: associationData.category || "",
          logo_url: associationData.logo_url || null,
        };

        setCurrentProfile(profileUpdate);
        setProfileData({
          ...profileUpdate,
          password: "",
          confirmPassword: "",
          category: associationData.category as
            | "Food"
            | "Clothes"
            | "Healthcare"
            | "Education"
            | "Home supplies"
            | undefined,
        });

        setError(null);
      } catch (err) {
        console.error("Failed to fetch association profile:", err);
        setError("Failed to load association data");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    // Fetch on initial load or when view dialog opens
    if (initialLoad || showViewProfileDialog) {
      fetchAssociationProfile();
    }
  }, [initialLoad, showViewProfileDialog]);

  // Update Association Profile
  const handleAssociationUpdate = async () => {
    try {
      setLoading(true);

      // Prepare the update data
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        description: profileData.description,
        category: profileData.category,
        ...(profileData.password && {
          password: profileData.password,
          confirmPassword: profileData.confirmPassword,
        }),
        ...(profileData.logo_url !== null && {
          logo_url: profileData.logo_url,
        }),
      };

      // Call the API
      const response = await updateAssociationProfile(updateData);

      // Update the state with the response data
      setCurrentProfile((prev) => ({
        ...prev,
        name: response.association?.name || prev.name,
        email: response.association?.email || prev.email,
        phone: response.association?.phone || prev.phone,
        address: response.association?.address || prev.address,
        description: response.association?.description || prev.description,
        category: response.association?.category || prev.category,
        logo_url: response.association?.logo_url || prev.logo_url,
      }));

      // Show success message
      toast({
        title: "Profile Updated",
        description: "Your association profile has been updated successfully.",
        className:
          "border border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });

      // Close the dialog
      setShowProfileDialog(false);
    } catch (error: Error | unknown) {
      console.error("Association update error", error);

      // Show error message
      toast({
        title: "Update Failed",
        description:
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          "Couldn't update association profile. Please try again.",
        className:
          "border border-red-300 dark:border-red-600/40 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Association Account
  const handleAssociationDelete = async () => {
    try {
      setLoading(true);
      await deleteAssociationAccount();

      // Clear auth data
      localStorage.removeItem("sanctum_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user");

      toast({
        title: "Association Deleted",
        description: "Your association account has been permanently deleted.",
        className:
          "border border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Association deletion error", error);
      toast({
        title: "Deletion Failed",
        description: "Couldn't delete association account. Please try again.",
        className:
          "border border-red-300 dark:border-red-600/40 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
    } finally {
      setLoading(false);
    }
  };

  // Association Logout
  const handleAssociationLogout = async () => {
    try {
      setLoading(true);
      await logout();

      // Clear auth data
      localStorage.removeItem("sanctum_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user");

      toast({
        title: "Logged Out",
        description: "You've been logged out from your association account.",
        className:
          "border border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error("Association logout failed:", error);
      toast({
        title: "Logout Failed",
        description: "Couldn't log out properly. Please try again.",
        className:
          "border border-red-300 dark:border-red-600/40 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Association Dashboard
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage donations and help those in need
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
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-opacity-20 hover:bg-indigo-500 transition-all"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 animate-pulse">
                5
              </Badge>
            </Button>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="border-2 border-primary hover:scale-105 transition-transform cursor-pointer">
                  {currentProfile.logo_url &&
                  typeof currentProfile.logo_url === "string" ? (
                    <AvatarImage
                      src={currentProfile.logo_url || "/placeholder.svg"}
                      alt={currentProfile.name}
                    />
                  ) : (
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt="Association"
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                    <Building2 className="h-5 w-5" />
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
                {/* View Profile Option */}
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-500"
                  onClick={() => setShowViewProfileDialog(true)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>

                {/* Edit Profile Option */}
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-indigo-500/10 focus:text-indigo-500"
                  onClick={() => setShowProfileDialog(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
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
                Are you sure you want to log out of your association account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleAssociationLogout}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent
            className={`sm:max-w-[425px] rounded-lg ${
              theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
            }`}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Confirm Account Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your association account? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleAssociationDelete}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog - More Compact Version */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 rounded-xl border-0 shadow-xl">
            <ScrollArea className="h-[90vh] w-full rounded-xl">
              {/* Header with subtle gradient */}
              <div
                className={`sticky top-0 z-10 px-6 py-4 border-b ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700"
                    : "bg-gradient-to-r from-indigo-50 to-purple-50 border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-indigo-900/20 text-indigo-300"
                        : "bg-white text-indigo-600 shadow"
                    }`}
                  >
                    <Edit className="h-4 w-4" />
                  </div>
                  <div>
                    <DialogTitle
                      className={`text-lg font-medium ${
                        theme === "dark" ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      Edit Association Profile
                    </DialogTitle>
                    <DialogDescription
                      className={`text-xs ${
                        theme === "dark" ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Update your association details
                    </DialogDescription>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-6 py-4 space-y-5">
                {/* Logo Upload Section */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {profileData.logo_url ? (
                      <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-900/50">
                        <img
                          src={
                            typeof profileData.logo_url === "string"
                              ? profileData.logo_url
                              : URL.createObjectURL(profileData.logo_url)
                          }
                          alt="Association logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center border-2 border-dashed border-indigo-200 dark:border-indigo-800">
                        <Image className="h-5 w-5 text-indigo-400 dark:text-indigo-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                      Association Logo
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        setProfileData({
                          ...profileData,
                          logo_url: e.target.files[0],
                        })
                      }
                      className="text-xs h-9"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Recommended size: 256×256px
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div
                  className={`h-px ${
                    theme === "dark" ? "bg-slate-800" : "bg-slate-100"
                  }`}
                />

                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  >
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Name
                      </Label>
                      <Input
                        placeholder="Association name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Category
                      </Label>
                      <Select
                        value={profileData.category}
                        onValueChange={(value) =>
                          setProfileData({
                            ...profileData,
                            category: value as
                              | "Food"
                              | "Clothes"
                              | "Healthcare"
                              | "Education"
                              | "Home supplies"
                              | undefined,
                          })
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Clothes">Clothes</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Home supplies">
                            Home supplies
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Description
                    </Label>
                    <textarea
                      placeholder="Tell us about your association"
                      value={profileData.description}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          description: e.target.value,
                        })
                      }
                      className={`w-full h-24 p-2 rounded-md border text-sm ${
                        theme === "dark"
                          ? "bg-slate-900 border-slate-700"
                          : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className={`h-px ${
                    theme === "dark" ? "bg-slate-800" : "bg-slate-100"
                  }`}
                />

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-amber-300" : "text-amber-600"
                    }`}
                  >
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Email
                      </Label>
                      <Input
                        type="email"
                        placeholder="contact@example.com"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Phone
                      </Label>
                      <Input
                        placeholder="+123456789"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Address
                    </Label>
                    <Input
                      placeholder="123 Main St, City"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className={`h-px ${
                    theme === "dark" ? "bg-slate-800" : "bg-slate-100"
                  }`}
                />

                {/* Password Section */}
                <div className="space-y-4">
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-purple-300" : "text-purple-600"
                    }`}
                  >
                    Change Password
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={profileData.password}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            password: e.target.value,
                          })
                        }
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Confirm Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={profileData.confirmPassword}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className={`sticky bottom-0 px-6 py-4 border-t ${
                  theme === "dark"
                    ? "bg-slate-900/80 border-slate-800 backdrop-blur-sm"
                    : "bg-white/80 border-slate-100 backdrop-blur-sm"
                } flex justify-end gap-3`}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowProfileDialog(false)}
                  className="h-9 px-4 text-sm"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssociationUpdate}
                  className="h-9 px-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* View Profile Dialog - Improved */}
        <Dialog
          open={showViewProfileDialog}
          onOpenChange={setShowViewProfileDialog}
        >
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-0 rounded-lg border-0 shadow-lg">
            {/* Header */}
            <div
              className={`sticky top-0 z-10 px-4 py-2 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900"
                  : "bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-md ${
                    theme === "dark"
                      ? "bg-indigo-900/30 text-indigo-300"
                      : "bg-white text-indigo-600 shadow-sm"
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <DialogTitle
                  className={`text-sm font-semibold ${
                    theme === "dark" ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  Association Profile
                </DialogTitle>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-4 py-3">
              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-500">{error}</div>
              ) : (
                <>
                  {/* Logo and Basic Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      {currentProfile.logo_url ? (
                        <img
                          src={
                            typeof currentProfile.logo_url === "string"
                              ? currentProfile.logo_url
                              : URL.createObjectURL(currentProfile.logo_url)
                          }
                          alt="Association logo"
                          className="h-full w-full rounded-full object-cover border-2 border-primary"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-2 border-primary">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3
                        className={`font-medium text-lg ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {currentProfile.name || "Unnamed Association"}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            theme === "dark"
                              ? "bg-slate-700 text-indigo-300"
                              : "bg-indigo-100 text-indigo-600"
                          }`}
                        >
                          {currentProfile.category || "Association"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div
                    className={`p-3 rounded-lg mb-3 ${
                      theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"
                    }`}
                  >
                    <h4
                      className={`text-xs font-medium mb-2 flex items-center gap-1 ${
                        theme === "dark" ? "text-indigo-300" : "text-indigo-600"
                      }`}
                    >
                      <Mail className="h-3 w-3" /> Contact Information
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Mail
                          className={`h-4 w-4 mt-0.5 ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        />
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
                            {currentProfile.email || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone
                          className={`h-4 w-4 mt-0.5 ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        />
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

                      <div className="flex items-start gap-2">
                        <MapPin
                          className={`h-4 w-4 mt-0.5 ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            Address
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {currentProfile.address || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description - Only show if it exists */}
                  {currentProfile.description && (
                    <div
                      className={`p-3 rounded-lg ${
                        theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"
                      }`}
                    >
                      <h4
                        className={`text-xs font-medium mb-2 flex items-center gap-1 ${
                          theme === "dark"
                            ? "text-purple-300"
                            : "text-purple-600"
                        }`}
                      >
                        <Info className="h-3 w-3" /> About Us
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {currentProfile.description}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div
              className={`sticky bottom-0 px-4 py-2 border-t ${
                theme === "dark"
                  ? "border-slate-800 bg-gradient-to-r from-slate-800/80 to-slate-900/80"
                  : "border-slate-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
              } flex justify-end`}
            >
              <Button
                variant="ghost"
                onClick={() => setShowViewProfileDialog(false)}
                className={`h-7 px-3 text-xs ${
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
                className="h-7 px-3 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm ml-2"
                disabled={loading || !!error}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications Panel */}
        {showNotifications && (
          <Card
            className={`mb-8 border shadow-lg animate-fade-in ${
              theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Your recent activity</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <NotificationsPanel />
            </CardContent>
          </Card>
        )}

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
              <span className="text-primary">
                {currentProfile.name || "Association"}
              </span>
            </h1>
            <p className="opacity-90 max-w-xl">
              Your organization has helped many people in need. Continue your
              mission by managing donations and applicants.
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
            className={`grid grid-cols-4 w-full max-w-md mx-auto md:mx-0 shadow-sm ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-white border"
            }`}
          >
            <TabsTrigger
              value="overview"
              className="transition-all data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="donations"
              className="transition-all data-[state=active]:shadow-sm"
            >
              Donations
            </TabsTrigger>
            <TabsTrigger
              value="applicants"
              className="transition-all data-[state=active]:shadow-sm"
            >
              Applicants
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="transition-all data-[state=active]:shadow-sm"
            >
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <Package className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +8 from last month
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
                      ? "bg-purple-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                ></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Applicants
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
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">
                    +5 new this week
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
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">
                    3 new conversations
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Donations (Full Width) */}
            <Card
              className={`group hover:shadow-lg transition-all duration-300 ${
                theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
              } rounded-xl`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-500" />
                  Recent Donations
                </CardTitle>
                <CardDescription>Latest donations received</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationsList limit={5} />
              </CardContent>
            </Card>

            {/* Recent Applicants */}
            <Card
              className={`group hover:shadow-lg transition-all duration-300 ${
                theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
              } rounded-xl`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Recent Applicants
                </CardTitle>
                <CardDescription>People who need your help</CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicantsList limit={3} />
              </CardContent>
            </Card>

            {/* Needs List */}
            <Card
              className={`group hover:shadow-lg transition-all duration-300 ${
                theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
              } rounded-xl`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span
                    className={`p-1 rounded-md ${
                      theme === "dark"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </span>
                  Current Needs
                </CardTitle>
                <CardDescription>
                  Items your association currently needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NeedsList />
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
                  <Package className="h-5 w-5 text-indigo-500" />
                  Donations
                </CardTitle>
                <CardDescription>
                  All donations received by your association
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DonationsList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applicants Tab */}
          <TabsContent value="applicants" className="space-y-6">
            <Card
              className={`group hover:shadow-lg transition-all duration-300 ${
                theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"
              } rounded-xl`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Applicants
                </CardTitle>
                <CardDescription>People who need your help</CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicantsList />
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
                <CardDescription>
                  Chat with applicants and donors
                </CardDescription>
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

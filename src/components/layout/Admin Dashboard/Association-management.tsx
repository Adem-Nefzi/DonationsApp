"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Search,
  Edit,
  Trash,
  Eye,
  Building2,
  Phone,
  MapPin,
  RefreshCw,
  AlertCircle,
  Loader2,
  Filter,
  Plus,
  Home,
  BookOpen,
  HeartPulse,
  Shirt,
  Utensils,
  List,
  Lock,
  Mail,
  User2,
  Pencil,
  Image,
  AlignLeft,
  Save,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAllAssociations,
  getDeletedAssociations,
  createAssociation,
  adminUpdateAssociation,
  adminDeleteAssociation,
  restoreAssociation,
  type Association as ApiAssociation,
} from "@/api/admin";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Association extends ApiAssociation {
  category?: string;
  logo_url?: string | File;
}

export default function AssociationManagement() {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [deletedAssociations, setDeletedAssociations] = useState<Association[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedAssociation, setSelectedAssociation] =
    useState<Association | null>(null);
  const [currentAssociation, setCurrentAssociation] =
    useState<Association | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const [deletedCategoryFilter, setDeletedCategoryFilter] = useState("all");
  const [deletedSearchQuery, setDeletedSearchQuery] = useState("");
  const [showDeletedFilters, setShowDeletedFilters] = useState(false);
  const [newAssociation, setNewAssociation] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    description: "",
    category: "Food" as
      | "Food"
      | "Clothes"
      | "Healthcare"
      | "Education"
      | "Home supplies",
    logo_url: null as File | null,
  });
  const isMobile = useMobile();

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        setLoading(true);
        const data = await getAllAssociations();
        // Handle different response structures
        const associationsData = Array.isArray(data)
          ? data
          : data?.data || data?.associations || [];
        setAssociations(associationsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch associations. Please try again later.");
        console.error("Error fetching associations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociations();
  }, []);

  const fetchDeletedAssociations = async () => {
    try {
      setLoading(true);
      const data = await getDeletedAssociations();
      // Handle different response structures
      const deletedData = Array.isArray(data)
        ? data
        : data?.data || data?.associations || [];
      setDeletedAssociations(deletedData);
    } catch (err) {
      console.error("Error fetching deleted associations:", err);
      setDeletedAssociations([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedAssociations();
  }, []);

  const activeAssociations = associations.filter(
    (association) => !association.deleted_at
  );
  const filteredAssociations = activeAssociations.filter((association) => {
    const matchesSearch =
      association.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (association.email &&
        association.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (association.description &&
        association.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" || association.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !association.deleted_at) ||
      (statusFilter === "inactive" && association.deleted_at);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredDeletedAssociations = deletedAssociations.filter(
    (association) => {
      const matchesSearch =
        association.name
          .toLowerCase()
          .includes(deletedSearchQuery.toLowerCase()) ||
        (association.email &&
          association.email
            .toLowerCase()
            .includes(deletedSearchQuery.toLowerCase())) ||
        (association.description &&
          association.description
            .toLowerCase()
            .includes(deletedSearchQuery.toLowerCase()));
      const matchesCategory =
        deletedCategoryFilter === "all" ||
        association.category === deletedCategoryFilter;

      return matchesSearch && matchesCategory;
    }
  );

  const handleCreateAssociation = async () => {
    try {
      setLoading(true);
      const createdAssociation = await createAssociation({
        ...newAssociation,
        logo_url: newAssociation.logo_url || undefined,
      });

      // Handle different response structures
      const newAssociationData =
        createdAssociation.data ||
        createdAssociation.association ||
        createdAssociation;

      setAssociations([...associations, newAssociationData]);
      setNewAssociation({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        description: "",
        category: "Food",
        logo_url: null,
      });
      toast({
        title: "Association created successfully",
        description: `New Association has been added.`,
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Error creating association:", err);
      toast({
        title: "Failed to create association",
        description: "Please try again or check the details.",
        variant: "destructive",
      });
      setError("Failed to create association. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAssociation = async () => {
    if (!currentAssociation) return;
    try {
      setLoading(true);
      const updatedAssociation = await adminUpdateAssociation(
        currentAssociation.id,
        {
          name: currentAssociation.name,
          email: currentAssociation.email,
          phone: currentAssociation.phone,
          address: currentAssociation.address,
          description: currentAssociation.description,
          category: currentAssociation.category,
          logo_url:
            currentAssociation.logo_url instanceof File
              ? currentAssociation.logo_url
              : undefined,
        }
      );

      // Handle different response structures
      const updatedAssociationData =
        updatedAssociation.data ||
        updatedAssociation.association ||
        updatedAssociation;

      setAssociations(
        associations.map((association) =>
          association.id === currentAssociation.id
            ? updatedAssociationData
            : association
        )
      );
      toast({
        title: "Association updated successfully",
        description: `Selected Association details have been updated.`,
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating association:", err);
      toast({
        title: "Failed to update association",
        description: "Please try again or check the details.",
        variant: "destructive",
      });
      setError("Failed to update association. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssociation = async () => {
    if (!currentAssociation) return;
    try {
      setLoading(true);
      await adminDeleteAssociation(currentAssociation.id);

      // Update local state to mark as deleted
      setAssociations(
        associations.map((association) =>
          association.id === currentAssociation.id
            ? { ...association, deleted_at: new Date().toISOString() }
            : association
        )
      );

      toast({
        title: "Association deleted successfully",
        description: `Selected Association has been removed.`,
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
      setIsDeleteDialogOpen(false);

      // Refresh the deleted associations list
      fetchDeletedAssociations();
    } catch (err) {
      console.error("Error deleting association:", err);
      toast({
        title: "Failed to delete association",
        description: "Please try again or check permissions.",
        variant: "destructive",
      });
      setError("Failed to delete association. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreAssociation = async () => {
    if (!currentAssociation) return;
    try {
      setLoading(true);
      await restoreAssociation(currentAssociation.id);

      toast({
        title: "Association restored successfully",
        description: `Selected Association has been restored.`,
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });

      // Refresh both lists
      const allAssociationsData = await getAllAssociations();
      const associationsData = Array.isArray(allAssociationsData)
        ? allAssociationsData
        : allAssociationsData?.data || allAssociationsData?.associations || [];
      setAssociations(associationsData);

      fetchDeletedAssociations();
      setIsRestoreDialogOpen(false);
    } catch (err) {
      console.error("Error restoring association:", err);
      toast({
        title: "Failed to restore association",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category?: string) => {
    if (!category) return <Badge>Unknown</Badge>;

    switch (category) {
      case "Food":
        return <Badge className="bg-green-500">Food</Badge>;
      case "Clothes":
        return <Badge className="bg-blue-500">Clothes</Badge>;
      case "Healthcare":
        return <Badge className="bg-red-500">Healthcare</Badge>;
      case "Education":
        return <Badge className="bg-purple-500">Education</Badge>;
      case "Home supplies":
        return <Badge className="bg-amber-500">Home supplies</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    if (status) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  if (loading && !associations.length && !deletedAssociations.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !associations.length && !deletedAssociations.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-1">Error loading associations</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <TabsList className="h-10 p-1 bg-muted/30 rounded-xl">
            <TabsTrigger
              value="active"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              <span>Active Associations</span>
              {activeAssociations.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {activeAssociations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="deleted"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              <span>Deleted Associations</span>
              {deletedAssociations.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                >
                  {deletedAssociations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="group relative overflow-hidden gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  Add Association
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl border-0 overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
              <ScrollArea className="max-h-[90vh]">
                {/* Animated header */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                  <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 shadow-sm">
                        <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                          Create New Association
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                          Register a new charitable organization
                        </DialogDescription>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form content */}
                <div className="px-6 py-4 space-y-5">
                  {/* Logo upload with preview */}
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                        {newAssociation.logo_url ? (
                          <img
                            src={
                              typeof newAssociation.logo_url === "string"
                                ? newAssociation.logo_url
                                : URL.createObjectURL(newAssociation.logo_url)
                            }
                            alt="Logo preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <Image className="h-6 w-6 text-slate-400 mx-auto" />
                            <span className="text-xs text-slate-400 mt-1 block">
                              Logo
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-xl">
                        <Pencil className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Upload Logo
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          setNewAssociation({
                            ...newAssociation,
                            logo_url: e.target.files[0],
                          })
                        }
                        className="cursor-pointer file:cursor-pointer file:text-sm file:font-medium file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 dark:hover:file:bg-blue-900/50"
                      />
                    </div>
                  </div>

                  {/* Grid layout for form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <User2 className="h-3.5 w-3.5 text-blue-500" />
                        Name
                      </Label>
                      <Input
                        value={newAssociation.name}
                        onChange={(e) =>
                          setNewAssociation({
                            ...newAssociation,
                            name: e.target.value,
                          })
                        }
                        placeholder="Organization name"
                        className="focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-blue-500" />
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={newAssociation.email}
                        onChange={(e) =>
                          setNewAssociation({
                            ...newAssociation,
                            email: e.target.value,
                          })
                        }
                        placeholder="contact@example.com"
                        className="focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5 text-blue-500" />
                        Password
                      </Label>
                      <Input
                        type="password"
                        value={newAssociation.password}
                        onChange={(e) =>
                          setNewAssociation({
                            ...newAssociation,
                            password: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5 text-blue-500" />
                        Confirm Password
                      </Label>
                      <Input
                        type="password"
                        value={newAssociation.confirmPassword}
                        onChange={(e) =>
                          setNewAssociation({
                            ...newAssociation,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-blue-500" />
                        Phone
                      </Label>
                      <Input
                        value={newAssociation.phone}
                        onChange={(e) =>
                          setNewAssociation({
                            ...newAssociation,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+1234567890"
                        className="focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <List className="h-3.5 w-3.5 text-blue-500" />
                        Category
                      </Label>
                      <Select
                        value={newAssociation.category}
                        onValueChange={(
                          value:
                            | "Food"
                            | "Clothes"
                            | "Healthcare"
                            | "Education"
                            | "Home supplies"
                        ) =>
                          setNewAssociation({
                            ...newAssociation,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500/50">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">
                            <span className="flex items-center gap-2">
                              <Utensils className="h-4 w-4" /> Food
                            </span>
                          </SelectItem>
                          <SelectItem value="Clothes">
                            <span className="flex items-center gap-2">
                              <Shirt className="h-4 w-4" /> Clothes
                            </span>
                          </SelectItem>
                          <SelectItem value="Healthcare">
                            <span className="flex items-center gap-2">
                              <HeartPulse className="h-4 w-4" /> Healthcare
                            </span>
                          </SelectItem>
                          <SelectItem value="Education">
                            <span className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" /> Education
                            </span>
                          </SelectItem>
                          <SelectItem value="Home supplies">
                            <span className="flex items-center gap-2">
                              <Home className="h-4 w-4" /> Home supplies
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      Address
                    </Label>
                    <Input
                      value={newAssociation.address}
                      onChange={(e) =>
                        setNewAssociation({
                          ...newAssociation,
                          address: e.target.value,
                        })
                      }
                      placeholder="123 Main St, City, Country"
                      className="focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <AlignLeft className="h-3.5 w-3.5 text-blue-500" />
                      Description
                    </Label>
                    <Textarea
                      value={newAssociation.description}
                      onChange={(e) =>
                        setNewAssociation({
                          ...newAssociation,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of your organization"
                      className="min-h-[100px] focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Sticky footer with glass effect */}
                <div className="sticky bottom-0 px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 backdrop-blur-sm flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAssociation}
                    disabled={
                      !newAssociation.name ||
                      !newAssociation.email ||
                      !newAssociation.password ||
                      !newAssociation.confirmPassword ||
                      newAssociation.password !== newAssociation.confirmPassword
                    }
                    className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Create Association
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="active" className="mt-0">
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search associations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Clothes">Clothes</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Home supplies">Home supplies</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border shadow-sm bg-white dark:bg-slate-900">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Association</TableHead>
                  {!isMobile && <TableHead>Email</TableHead>}
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  {!isMobile && <TableHead>Created</TableHead>}
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssociations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isMobile ? 4 : 6}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
                        <p>No associations found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssociations.map((association) => (
                    <TableRow key={association.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage
                              src={
                                typeof association.logo_url === "string"
                                  ? association.logo_url
                                  : "/placeholder.svg"
                              }
                              alt={association.name}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700">
                              <Building2 className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{association.name}</div>
                        </div>
                      </TableCell>
                      {!isMobile && <TableCell>{association.email}</TableCell>}
                      <TableCell>
                        {getCategoryBadge(association.category)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(association.deleted_at)}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          {new Date(
                            association.created_at
                          ).toLocaleDateString()}
                        </TableCell>
                      )}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAssociation(association);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentAssociation(association);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit association
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setCurrentAssociation(association);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete
                              association
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="deleted" className="mt-0">
          <Card className="border-none shadow-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Trash className="h-5 w-5 text-red-500" />
                Deleted Association Accounts
              </CardTitle>
              <CardDescription>
                View and restore previously deleted association accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                  <h3 className="text-lg font-medium mb-1">
                    Error loading deleted associations
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button variant="outline" onClick={fetchDeletedAssociations}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-2">
                      <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search deleted associations..."
                            className="pl-8"
                            value={deletedSearchQuery}
                            onChange={(e) =>
                              setDeletedSearchQuery(e.target.value)
                            }
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setShowDeletedFilters(!showDeletedFilters)
                          }
                          className="h-10 w-10"
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {showDeletedFilters && (
                      <div className="flex flex-col sm:flex-row gap-3 mt-2 p-3 bg-muted/20 rounded-lg border border-dashed animate-in fade-in-50 slide-in-from-top-5 duration-300">
                        <div className="flex-1">
                          <Label
                            htmlFor="deleted-category-filter"
                            className="text-xs mb-1 block"
                          >
                            Filter by category
                          </Label>
                          <Select
                            value={deletedCategoryFilter}
                            onValueChange={setDeletedCategoryFilter}
                          >
                            <SelectTrigger
                              id="deleted-category-filter"
                              className="w-full"
                            >
                              <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Categories
                              </SelectItem>
                              <SelectItem value="Food">Food</SelectItem>
                              <SelectItem value="Clothes">Clothes</SelectItem>
                              <SelectItem value="Healthcare">
                                Healthcare
                              </SelectItem>
                              <SelectItem value="Education">
                                Education
                              </SelectItem>
                              <SelectItem value="Home supplies">
                                Home supplies
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {filteredDeletedAssociations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <div className="bg-muted/20 p-4 rounded-full mb-4">
                        <Trash className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">
                        {deletedSearchQuery || deletedCategoryFilter !== "all"
                          ? "No matching deleted associations found"
                          : "No deleted associations found"}
                      </h3>
                      <p className="text-sm max-w-md">
                        {deletedSearchQuery || deletedCategoryFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "All active association accounts are currently in good standing"}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead>Association</TableHead>
                            {!isMobile && <TableHead>Email</TableHead>}
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            {!isMobile && <TableHead>Deleted</TableHead>}
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDeletedAssociations.map((association) => (
                            <TableRow key={association.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 border">
                                    <AvatarImage
                                      src={
                                        typeof association.logo_url === "string"
                                          ? association.logo_url
                                          : "/placeholder.svg"
                                      }
                                      alt={association.name}
                                    />
                                    <AvatarFallback className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700">
                                      <Building2 className="h-4 w-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">
                                    {association.name}
                                  </div>
                                </div>
                              </TableCell>
                              {!isMobile && (
                                <TableCell>{association.email}</TableCell>
                              )}
                              <TableCell>
                                {getCategoryBadge(association.category)}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(association.deleted_at)}
                              </TableCell>
                              {!isMobile && (
                                <TableCell>
                                  {association.deleted_at
                                    ? new Date(
                                        association.deleted_at
                                      ).toLocaleDateString()
                                    : "-"}
                                </TableCell>
                              )}
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedAssociation(association);
                                        setIsViewDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="mr-2 h-4 w-4" /> View
                                      details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurrentAssociation(association);
                                        setIsRestoreDialogOpen(true);
                                      }}
                                    >
                                      <RefreshCw className="mr-2 h-4 w-4" />{" "}
                                      Restore association
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Association Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl border-0 overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
          <ScrollArea className="max-h-[90vh]">
            {/* Animated header with gradient */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
              <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 shadow-sm">
                    <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Edit Association
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                      Update organization information
                    </DialogDescription>
                  </div>
                </div>
              </div>
            </div>

            {/* Form content */}
            <div className="px-6 py-4 space-y-5">
              {currentAssociation && (
                <>
                  {/* Logo upload with preview */}
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                        {currentAssociation.logo_url ? (
                          <img
                            src={
                              typeof currentAssociation.logo_url === "string"
                                ? currentAssociation.logo_url
                                : URL.createObjectURL(
                                    currentAssociation.logo_url
                                  )
                            }
                            alt="Logo preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <Image className="h-6 w-6 text-slate-400 mx-auto" />
                            <span className="text-xs text-slate-400 mt-1 block">
                              Logo
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-xl">
                        <Pencil className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Update Logo
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          setCurrentAssociation({
                            ...currentAssociation,
                            logo_url: e.target.files[0],
                          })
                        }
                        className="cursor-pointer file:cursor-pointer file:text-sm file:font-medium file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 dark:hover:file:bg-blue-900/50"
                      />
                    </div>
                  </div>

                  {/* Grid layout for form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <User2 className="h-3.5 w-3.5 text-blue-500" />
                        Name
                      </Label>
                      <Input
                        value={currentAssociation.name}
                        onChange={(e) =>
                          setCurrentAssociation({
                            ...currentAssociation,
                            name: e.target.value,
                          })
                        }
                        className="focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-blue-500" />
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={currentAssociation.email}
                        onChange={(e) =>
                          setCurrentAssociation({
                            ...currentAssociation,
                            email: e.target.value,
                          })
                        }
                        className="focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-blue-500" />
                        Phone
                      </Label>
                      <Input
                        value={currentAssociation.phone || ""}
                        onChange={(e) =>
                          setCurrentAssociation({
                            ...currentAssociation,
                            phone: e.target.value,
                          })
                        }
                        className="focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <List className="h-3.5 w-3.5 text-blue-500" />
                        Category
                      </Label>
                      <Select
                        value={currentAssociation.category || "Food"}
                        onValueChange={(value) =>
                          setCurrentAssociation({
                            ...currentAssociation,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500/50">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food" className="focus:bg-blue-50">
                            <span className="flex items-center gap-2">
                              <Utensils className="h-4 w-4" /> Food
                            </span>
                          </SelectItem>
                          <SelectItem
                            value="Clothes"
                            className="focus:bg-blue-50"
                          >
                            <span className="flex items-center gap-2">
                              <Shirt className="h-4 w-4" /> Clothes
                            </span>
                          </SelectItem>
                          <SelectItem
                            value="Healthcare"
                            className="focus:bg-blue-50"
                          >
                            <span className="flex items-center gap-2">
                              <HeartPulse className="h-4 w-4" /> Healthcare
                            </span>
                          </SelectItem>
                          <SelectItem
                            value="Education"
                            className="focus:bg-blue-50"
                          >
                            <span className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" /> Education
                            </span>
                          </SelectItem>
                          <SelectItem
                            value="Home supplies"
                            className="focus:bg-blue-50"
                          >
                            <span className="flex items-center gap-2">
                              <Home className="h-4 w-4" /> Home supplies
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      Address
                    </Label>
                    <Input
                      value={currentAssociation.address || ""}
                      onChange={(e) =>
                        setCurrentAssociation({
                          ...currentAssociation,
                          address: e.target.value,
                        })
                      }
                      className="focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <AlignLeft className="h-3.5 w-3.5 text-blue-500" />
                      Description
                    </Label>
                    <Textarea
                      value={currentAssociation.description || ""}
                      onChange={(e) =>
                        setCurrentAssociation({
                          ...currentAssociation,
                          description: e.target.value,
                        })
                      }
                      className="min-h-[100px] focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Sticky footer with glass effect */}
            <div className="sticky bottom-0 px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 backdrop-blur-sm flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditAssociation}
                disabled={loading}
                className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Association Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash className="h-5 w-5 text-red-500" />
              Delete Association
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this association? This action can
              be undone later.
            </DialogDescription>
          </DialogHeader>
          {currentAssociation && (
            <div className="flex items-center gap-4 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    typeof currentAssociation.logo_url === "string"
                      ? currentAssociation.logo_url
                      : "/placeholder.svg"
                  }
                  alt={currentAssociation.name}
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700">
                  <Building2 className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentAssociation.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentAssociation.email}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAssociation}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete Association
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Association Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-500" />
              Restore Association Account
            </DialogTitle>
            <DialogDescription>
              This will reactivate the association account and restore access to
              the system.
            </DialogDescription>
          </DialogHeader>
          {currentAssociation && (
            <div className="flex items-center gap-4 py-4 px-1">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
                <Avatar className="h-12 w-12 border-2 border-green-200">
                  <AvatarImage
                    src={
                      typeof currentAssociation.logo_url === "string"
                        ? currentAssociation.logo_url
                        : "/placeholder.svg"
                    }
                    alt={currentAssociation.name}
                  />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    <Building2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-lg">{currentAssociation.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentAssociation.email}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    Category: {currentAssociation.category || "Not specified"}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                  <span>
                    Deleted:{" "}
                    {currentAssociation.deleted_at &&
                      new Date(
                        currentAssociation.deleted_at
                      ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRestoreDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRestoreAssociation}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              <RefreshCw className="mr-2 h-4 w-4" /> Restore Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Association Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] rounded-xl">
          <DialogHeader className="px-1">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Association Profile
            </DialogTitle>
          </DialogHeader>

          {selectedAssociation && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      typeof selectedAssociation.logo_url === "string"
                        ? selectedAssociation.logo_url
                        : "/placeholder.svg"
                    }
                  />
                  <AvatarFallback className="text-xl bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                    <Building2 className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold line-clamp-1">
                    {selectedAssociation.name}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {selectedAssociation.email}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedAssociation.deleted_at
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-2 text-center">
                  <h3 className="text-xs text-muted-foreground">Category</h3>
                  <div className="mt-0.5 text-sm">
                    {getCategoryBadge(selectedAssociation.category)}
                  </div>
                </div>

                <div className="border rounded-lg p-2 text-center">
                  <h3 className="text-xs text-muted-foreground">Status</h3>
                  <div className="mt-0.5 text-sm">
                    {getStatusBadge(selectedAssociation.deleted_at)}
                  </div>
                </div>

                <div className="border rounded-lg p-2 text-center">
                  <h3 className="text-xs text-muted-foreground">Created</h3>
                  <p className="mt-0.5 text-xs">
                    {new Date(
                      selectedAssociation.created_at
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
                  <Phone className="h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5" />
                  <div className="overflow-hidden">
                    <h3 className="text-xs text-muted-foreground">Phone</h3>
                    <p className="text-sm truncate">
                      {selectedAssociation.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                  <div className="overflow-hidden">
                    <h3 className="text-xs text-muted-foreground">Address</h3>
                    <p className="text-xs line-clamp-2">
                      {selectedAssociation.address || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-muted/20">
                  <h3 className="text-xs text-muted-foreground mb-1">
                    Description
                  </h3>
                  <p className="text-xs line-clamp-4">
                    {selectedAssociation.description ||
                      "No description provided"}
                  </p>
                </div>

                {selectedAssociation.deleted_at && (
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                    <Trash className="h-4 w-4 flex-shrink-0 text-red-500 mt-0.5" />
                    <div className="overflow-hidden">
                      <h3 className="text-xs text-red-600 dark:text-red-400">
                        Account Deleted
                      </h3>
                      <p className="text-xs">
                        {new Date(
                          selectedAssociation.deleted_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-[0.5px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-background text-[10px] text-muted-foreground">
                    ID: {selectedAssociation.id}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-1 pt-2">
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="h-8 px-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

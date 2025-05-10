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
  UserPlus,
  Phone,
  MapPin,
  RefreshCw,
  Users,
  UserX,
  Filter,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMobile } from "@/hooks/use-mobile";
import {
  adminGetAllUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminRestoreUser,
  type User as ApiUser,
  adminGetDeletedUsers,
} from "@/api/admin";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UserManagement() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const [deletedRoleFilter, setDeletedRoleFilter] = useState("all");
  const [deletedSearchQuery, setDeletedSearchQuery] = useState("");
  const [showDeletedFilters, setShowDeletedFilters] = useState(false);
  const [deletedUsers, setDeletedUsers] = useState<ApiUser[]>([]);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: "donor" as "donor" | "recipient" | "admin",
  });
  const isMobile = useMobile();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminGetAllUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchDeletedUsers = async () => {
    try {
      setLoading(true);
      const data = await adminGetDeletedUsers();
      setDeletedUsers(data);
    } catch (err) {
      console.error("Error fetching deleted users:", err);
      setDeletedUsers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const activeUsers = users.filter((user) => !user.deleted_at);
  const filteredUsers = activeUsers.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.user_type === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.deleted_at) ||
      (statusFilter === "inactive" && user.deleted_at);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredDeletedUsers = deletedUsers.filter((user) => {
    const fullName = `${user.first_name || ""} ${
      user.last_name || ""
    }`.toLowerCase();
    const matchesSearch =
      fullName.includes(deletedSearchQuery.toLowerCase()) ||
      (user.email || "")
        .toLowerCase()
        .includes(deletedSearchQuery.toLowerCase());
    const matchesRole =
      deletedRoleFilter === "all" || user.user_type === deletedRoleFilter;

    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      const createdUser = await adminCreateUser(newUser);
      setUsers([...users, createdUser]);
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        user_type: "donor",
      });
      toast({
        title: "User created successfully",
        description: `New User has been added.`,
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
      setTimeout(() => {}, 3000);
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Error creating user:", err);
      toast({
        title: "Failed to create user",
        description: "Please try again or check the details.",
        variant: "destructive",
      });
      setError("Failed to create user. Please try again.");
    }
  };

  const handleEditUser = async () => {
    if (!currentUser) return;
    try {
      const updatedUser = await adminUpdateUser(currentUser.id, {
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email,
        user_type: currentUser.user_type,
      });
      setUsers(
        users.map((user) => (user.id === currentUser.id ? updatedUser : user))
      );
      toast({
        title: "User updated successfully",
        description: `Selected User details have been updated.`,
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
      setTimeout(() => {}, 3000);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating user:", err);
      toast({
        title: "Failed to update user",
        description: "Please try again or check the details.",
        variant: "destructive",
      });
      setError("Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    try {
      await adminDeleteUser(currentUser.id);
      setUsers(
        users.map((user) =>
          user.id === currentUser.id
            ? { ...user, deleted_at: new Date().toISOString() }
            : user
        )
      );
      toast({
        title: "User deleted successfully",
        description: `Selected User has been removed.`,
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
      setTimeout(() => {}, 3000);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error deleting user:", err);
      toast({
        title: "Failed to delete user",
        description: "Please try again or check permissions.",
        variant: "destructive",
      });
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleRestoreUser = async () => {
    if (!currentUser) return;
    try {
      await adminRestoreUser(currentUser.id);
      toast({
        title: "User restored successfully",
        description: `Selected User has been restored.`,
        variant: "default",
      });
      fetchDeletedUsers();
      setIsRestoreDialogOpen(false);
    } catch {
      toast({
        title: "Failed to restore user",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>;
      case "donor":
        return <Badge className="bg-blue-500">Donor</Badge>;
      case "recipient":
        return <Badge className="bg-green-500">Recipient</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    if (status) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
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
              <Users className="h-4 w-4" />
              <span>Active Users</span>
              {activeUsers.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {activeUsers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="deleted"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm flex items-center gap-2"
            >
              <UserX className="h-4 w-4" />
              <span>Deleted Users</span>
              {deletedUsers.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                >
                  {deletedUsers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
                <UserPlus className="h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-md rounded-xl">
              <div className="relative">
                <div className="absolute -top-4 -right-4 h-16 w-16 bg-purple-200/20 rounded-full blur-md" />
                <div className="absolute -bottom-4 -left-4 h-12 w-12 bg-blue-200/20 rounded-full blur-md" />

                <DialogHeader>
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-purple-600" />
                    Create New User
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Add a new member to your organization
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="first_name" className="text-sm">
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      value={newUser.first_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, first_name: e.target.value })
                      }
                      className="focus-visible:ring-2 focus-visible:ring-purple-500/50"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="last_name" className="text-sm">
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      value={newUser.last_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, last_name: e.target.value })
                      }
                      className="focus-visible:ring-2 focus-visible:ring-blue-500/50"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="focus-visible:ring-2 focus-visible:ring-purple-500/50"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="password" className="text-sm">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      className="focus-visible:ring-2 focus-visible:ring-blue-500/50"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="role" className="text-sm">
                      Role
                    </Label>
                    <Select
                      value={newUser.user_type}
                      onValueChange={(value) =>
                        setNewUser({
                          ...newUser,
                          user_type: value as "donor" | "recipient" | "admin",
                        })
                      }
                    >
                      <SelectTrigger
                        id="role"
                        className="focus-visible:ring-2 focus-visible:ring-purple-500/50"
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="donor">Donor</SelectItem>
                        <SelectItem value="recipient">Recipient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateUser}
                    disabled={
                      !newUser.first_name ||
                      !newUser.last_name ||
                      !newUser.email ||
                      !newUser.password
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    Create User
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="active" className="mt-0">
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="donor">Donor</SelectItem>
                  <SelectItem value="recipient">Recipient</SelectItem>
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
                  <TableHead>User</TableHead>
                  {!isMobile && <TableHead>Email</TableHead>}
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  {!isMobile && <TableHead>Created</TableHead>}
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isMobile ? 4 : 6}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
                        <p>No users found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage
                              src="/placeholder.svg"
                              alt={`${user.first_name} ${user.last_name}`}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700">
                              {user.first_name?.charAt(0) || ""}
                              {user.last_name?.charAt(0) || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </TableCell>
                      {!isMobile && <TableCell>{user.email}</TableCell>}
                      <TableCell>{getRoleBadge(user.user_type)}</TableCell>
                      <TableCell>{getStatusBadge(user.deleted_at)}</TableCell>
                      {!isMobile && (
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
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
                                setSelectedUser(user);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentUser(user);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit user
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setCurrentUser(user);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete user
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
                <UserX className="h-5 w-5 text-red-500" />
                Deleted User Accounts
              </CardTitle>
              <CardDescription>
                View and restore previously deleted user accounts
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
                    Error loading deleted users
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button variant="outline" onClick={fetchDeletedUsers}>
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
                            placeholder="Search deleted users..."
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
                            htmlFor="deleted-role-filter"
                            className="text-xs mb-1 block"
                          >
                            Filter by role
                          </Label>
                          <Select
                            value={deletedRoleFilter}
                            onValueChange={setDeletedRoleFilter}
                          >
                            <SelectTrigger
                              id="deleted-role-filter"
                              className="w-full"
                            >
                              <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Roles</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="donor">Donor</SelectItem>
                              <SelectItem value="recipient">
                                Recipient
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {filteredDeletedUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <div className="bg-muted/20 p-4 rounded-full mb-4">
                        <UserX className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">
                        {deletedSearchQuery || deletedRoleFilter !== "all"
                          ? "No matching deleted users found"
                          : "No deleted users found"}
                      </h3>
                      <p className="text-sm max-w-md">
                        {deletedSearchQuery || deletedRoleFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "All active user accounts are currently in good standing"}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead>User</TableHead>
                            {!isMobile && <TableHead>Email</TableHead>}
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            {!isMobile && <TableHead>Deleted</TableHead>}
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDeletedUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 border">
                                    <AvatarImage
                                      src="/placeholder.svg"
                                      alt={`${user.first_name} ${user.last_name}`}
                                    />
                                    <AvatarFallback className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700">
                                      {user.first_name?.charAt(0) || ""}
                                      {user.last_name?.charAt(0) || ""}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="font-medium">
                                    {user.first_name} {user.last_name}
                                  </div>
                                </div>
                              </TableCell>
                              {!isMobile && <TableCell>{user.email}</TableCell>}
                              <TableCell>
                                {getRoleBadge(user.user_type)}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(user.deleted_at)}
                              </TableCell>
                              {!isMobile && (
                                <TableCell>
                                  {user.deleted_at
                                    ? new Date(
                                        user.deleted_at
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
                                        setSelectedUser(user);
                                        setIsViewDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="mr-2 h-4 w-4" /> View
                                      details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurrentUser(user);
                                        setIsRestoreDialogOpen(true);
                                      }}
                                    >
                                      <RefreshCw className="mr-2 h-4 w-4" />{" "}
                                      Restore user
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information.</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-first_name">First Name</Label>
                <Input
                  id="edit-first_name"
                  value={currentUser.first_name}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      first_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-last_name">Last Name</Label>
                <Input
                  id="edit-last_name"
                  value={currentUser.last_name}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={currentUser.user_type}
                  onValueChange={(value) =>
                    setCurrentUser({
                      ...currentUser,
                      user_type: value as "donor" | "recipient" | "admin",
                    })
                  }
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="donor">Donor</SelectItem>
                    <SelectItem value="recipient">Recipient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action can be
              undone later.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="flex items-center gap-4 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="/placeholder.svg"
                  alt={`${currentUser.first_name} ${currentUser.last_name}`}
                />
                <AvatarFallback>
                  {currentUser.first_name.charAt(0)}
                  {currentUser.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {currentUser.first_name} {currentUser.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
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
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-500" />
              Restore User Account
            </DialogTitle>
            <DialogDescription>
              This will reactivate the user account and restore access to the
              system.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="flex items-center gap-4 py-4 px-1">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
                <Avatar className="h-12 w-12 border-2 border-green-200">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={`${currentUser.first_name} ${currentUser.last_name}`}
                  />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {currentUser.first_name.charAt(0)}
                    {currentUser.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-lg">
                  {currentUser.first_name} {currentUser.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Role: {currentUser.user_type}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                  <span>
                    Deleted:{" "}
                    {currentUser.deleted_at &&
                      new Date(currentUser.deleted_at).toLocaleDateString()}
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
              onClick={handleRestoreUser}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Restore Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] rounded-xl">
          <DialogHeader className="px-1">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Profile
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xl bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                    {selectedUser.first_name?.charAt(0)}
                    {selectedUser.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold line-clamp-1">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {selectedUser.email}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedUser.deleted_at ? "bg-red-500" : "bg-green-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-2 text-center">
                  <h3 className="text-xs text-muted-foreground">Role</h3>
                  <div className="mt-0.5 text-sm">
                    {getRoleBadge(selectedUser.user_type)}
                  </div>
                </div>

                <div className="border rounded-lg p-2 text-center">
                  <h3 className="text-xs text-muted-foreground">Status</h3>
                  <div className="mt-0.5 text-sm">
                    {getStatusBadge(selectedUser.deleted_at)}
                  </div>
                </div>

                <div className="border rounded-lg p-2 text-center">
                  <h3 className="text-xs text-muted-foreground">Joined</h3>
                  <p className="mt-0.5 text-xs">
                    {new Date(selectedUser.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {selectedUser.phone && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/20">
                    <Phone className="h-4 w-4 flex-shrink-0 text-blue-500" />
                    <div className="overflow-hidden">
                      <h3 className="text-xs text-muted-foreground">Phone</h3>
                      <p className="text-sm truncate">{selectedUser.phone}</p>
                    </div>
                  </div>
                )}

                {selectedUser.address && (
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                    <div className="overflow-hidden">
                      <h3 className="text-xs text-muted-foreground">Address</h3>
                      <p className="text-xs line-clamp-2">
                        {selectedUser.address}
                      </p>
                    </div>
                  </div>
                )}

                {selectedUser.deleted_at && (
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                    <UserX className="h-4 w-4 flex-shrink-0 text-red-500 mt-0.5" />
                    <div className="overflow-hidden">
                      <h3 className="text-xs text-red-600 dark:text-red-400">
                        Account Deleted
                      </h3>
                      <p className="text-xs">
                        {new Date(selectedUser.deleted_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
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
                    ID: {selectedUser.id}
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

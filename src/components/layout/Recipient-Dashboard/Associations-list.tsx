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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building,
  Filter,
  Search,
  AlertCircle,
  MapPin,
  RefreshCw,
  Eye,
  Heart,
  Globe,
  Phone,
  Mail,
  Info,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import type { ExtendedAssociation } from "@/api/admin";
import { fetchAllAssociations } from "@/api/crud";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { createRecipientRequest } from "@/api/donation";

const categories = [
  "All",
  "Food",
  "Clothes",
  "Healthcare",
  "Education",
  "Home supplies",
];

interface Association {
  id: string;
  name: string;
  avatar: string;
  description: string;
  category: string;
  location: string;
  email?: string;
  phone?: string;
  website?: string;
}

const formatAssociation = (association: ExtendedAssociation): Association => {
  return {
    id: association.id,
    name: association.name,
    avatar: association.logo_url || "/placeholder.svg?height=40&width=40",
    description: association.description || "",
    category: association.category || "Uncategorized",
    location: association.address || "",
    email: association.email || "",
    phone: association.phone || "",
    website: "",
  };
};

export default function AssociationsTable() {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [filteredAssociations, setFilteredAssociations] = useState<
    Association[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [requestHelpDialogOpen, setRequestHelpDialogOpen] = useState(false);
  const [selectedAssociation, setSelectedAssociation] =
    useState<Association | null>(null);
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
  });

  // Fetch all associations on component mount
  useEffect(() => {
    const getAssociations = async () => {
      setLoading(true);
      try {
        const data = await fetchAllAssociations();
        const associationsData = Array.isArray(data)
          ? data
          : data?.data || data?.associations || [];
        const formattedAssociations = associationsData.map(formatAssociation);
        setAssociations(formattedAssociations);
        setFilteredAssociations(formattedAssociations);
      } catch (err) {
        console.error("Error fetching associations:", err);
        setError("Failed to load associations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getAssociations();
  }, []);

  // Apply filters whenever searchQuery or selectedCategory changes
  useEffect(() => {
    if (associations.length === 0) return;

    const filtered = associations.filter((association) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        association.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        association.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || association.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    setFilteredAssociations(filtered);
  }, [searchQuery, selectedCategory, associations]);

  const handleRefresh = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const openViewDialog = (association: Association) => {
    setSelectedAssociation(association);
    setViewDialogOpen(true);
  };

  const openRequestHelpDialog = (association: Association) => {
    setSelectedAssociation(association);
    setRequestHelpDialogOpen(true);
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAssociation?.id) {
      toast({
        title: "No association selected",
        description: "Please select an association to donate to.",
        variant: "destructive",
      });
      return;
    }

    // 🔐 Get donor ID from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id;

    if (!userId) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in as a donor to donate.",
        variant: "destructive",
      });
      return;
    }
    try {
      await createRecipientRequest({
        association_id: Number(selectedAssociation.id),
        user_id: userId,
        title: requestForm.title,
        description: requestForm.description,
      });

      toast({
        title: "Donation submitted!",
        description: "Thank you for your generosity.",
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });

      setRequestHelpDialogOpen(false);
      setRequestForm({ title: "", description: "" });
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Donation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with title */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="inline-flex items-center justify-center p-2 mb-3 bg-primary/10 rounded-full">
          <Building className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Associations Directory</h2>
        <p className="text-muted-foreground max-w-md mx-auto mt-1">
          Browse and request help from organizations in your community
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 bg-muted/50 p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search associations..."
            className="pl-9 bg-background border-muted-foreground/20 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-background border-muted-foreground/20"
            >
              <Filter className="h-4 w-4" /> {selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-primary/10 text-primary font-medium"
                    : ""
                }
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Associations table */}
      {!loading && filteredAssociations.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssociations.map((association) => (
                <TableRow key={association.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={association.avatar}
                            alt={association.name}
                          />
                          <AvatarFallback>
                            <Building className="h-5 w-5 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium">{association.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {association.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{association.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="line-clamp-1">
                        {association.location || "No address"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => openRequestHelpDialog(association)}
                      >
                        <Heart className="h-4 w-4" />
                        Request Help
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => openViewDialog(association)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty states */}
      {!loading &&
        filteredAssociations.length === 0 &&
        associations.length > 0 && (
          <div className="text-center py-12 px-4">
            <div className="bg-muted/30 inline-flex items-center justify-center p-4 rounded-full mb-4">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              No matching associations found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any associations matching your search criteria.
            </p>
            <Button onClick={handleRefresh}>Clear Filters</Button>
          </div>
        )}

      {!loading && associations.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="bg-muted/30 inline-flex items-center justify-center p-4 rounded-full mb-4">
            <Building className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">
            No associations available
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            There are currently no associations to display.
          </p>
          <Button onClick={handleRefresh}>Refresh</Button>
        </div>
      )}

      {/* View Association Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg border bg-background p-6 shadow-xl">
          {/* Header with avatar integration */}
          <DialogHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                <AvatarImage
                  src={selectedAssociation?.avatar}
                  alt={selectedAssociation?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10">
                  <Building className="h-6 w-6 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {selectedAssociation?.name || "Association Details"}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <Badge
                    variant="secondary"
                    className="px-2 py-0.5 text-xs font-medium"
                  >
                    {selectedAssociation?.category || "No category"}
                  </Badge>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Content area with animated sections */}
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <div className="animate-fade-in">
                <h4 className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground mb-1">
                  <Info className="h-4 w-4" /> Description
                </h4>
                <Card className="p-3 bg-muted/50">
                  <p className="text-sm">
                    {selectedAssociation?.description ||
                      "No description available"}
                  </p>
                </Card>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in [animation-delay:100ms]">
                <div>
                  <h4 className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" /> Location
                  </h4>
                  <p className="text-sm pl-6">
                    {selectedAssociation?.location || "No address provided"}
                  </p>
                </div>

                {selectedAssociation?.email && (
                  <div>
                    <h4 className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground mb-1">
                      <Mail className="h-4 w-4" /> Email
                    </h4>
                    <p className="text-sm pl-6">{selectedAssociation.email}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in [animation-delay:200ms]">
                {selectedAssociation?.phone && (
                  <div>
                    <h4 className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground mb-1">
                      <Phone className="h-4 w-4" /> Phone
                    </h4>
                    <p className="text-sm pl-6">{selectedAssociation.phone}</p>
                  </div>
                )}

                {selectedAssociation?.website && (
                  <div>
                    <h4 className="text-sm font-medium leading-none flex items-center gap-2 text-muted-foreground mb-1">
                      <Globe className="h-4 w-4" /> Website
                    </h4>
                    <p className="text-sm pl-6 text-primary hover:underline">
                      <a
                        href={selectedAssociation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedAssociation.website}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer with animated buttons */}
          <DialogFooter className="animate-fade-in [animation-delay:300ms]">
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
              className="hover:bg-secondary/80"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setViewDialogOpen(false);
                openRequestHelpDialog(selectedAssociation!);
              }}
              className="bg-primary hover:bg-primary/90 shadow-sm transition-all hover:scale-[1.02]"
            >
              Request Help
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Help Dialog */}
      <Dialog
        open={requestHelpDialogOpen}
        onOpenChange={setRequestHelpDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Request Help from {selectedAssociation?.name || "Association"}
            </DialogTitle>
            <DialogDescription>
              Please provide details about your help request
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDonationSubmit} className="space-y-4">
            <div>
              <Label htmlFor="request-title">Request Title</Label>
              <Input
                id="request-title"
                placeholder="What help do you need?"
                value={requestForm.title}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="request-description">Description</Label>
              <Textarea
                id="request-description"
                placeholder="Describe your needs (specific requirements, urgency, etc.)"
                value={requestForm.description}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setRequestHelpDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

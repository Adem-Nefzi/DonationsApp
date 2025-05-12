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
  Heart,
  MessageSquare,
  Search,
  AlertCircle,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExtendedAssociation } from "@/api/admin";
import { fetchAllAssociations } from "@/api/crud";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const categories = [
  "All",
  "Food",
  "Clothes",
  "Healthcare",
  "Education",
  "Home supplies",
];

export default function AssociationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [associations, setAssociations] = useState<ExtendedAssociation[]>([]);
  const [filteredAssociations, setFilteredAssociations] = useState<
    ExtendedAssociation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [selectedAssociation, setSelectedAssociation] =
    useState<ExtendedAssociation | null>(null);
  const [donationForm, setDonationForm] = useState({
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

        setAssociations(associationsData);
        setFilteredAssociations(associationsData);
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
        (association.description &&
          association.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

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

  const openDonationDialog = (association: ExtendedAssociation) => {
    setSelectedAssociation(association);
    setDonationDialogOpen(true);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the donation data to your API
    console.log("Donation submitted for:", selectedAssociation?.name);
    console.log("Donation details:", donationForm);
    // Reset the form after submission
    setDonationForm({ title: "", description: "" });
    setDonationDialogOpen(false);
    // Show success message or redirect
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
          Browse and support organizations in your community
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
                        {association.logo_url ? (
                          <img
                            src={association.logo_url}
                            alt={association.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <Building className="h-5 w-5 text-muted-foreground" />
                        )}
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
                    <Badge variant="outline">
                      {association.category || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="line-clamp-1">
                        {association.address || "No address"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => openDonationDialog(association)}
                      >
                        <Heart className="h-4 w-4" />
                        Donate
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
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

      {/* Donation Dialog */}
      <Dialog open={donationDialogOpen} onOpenChange={setDonationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Donate to {selectedAssociation?.name || "Association"}
            </DialogTitle>
            <DialogDescription>
              Please provide details about your donation
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDonationSubmit} className="space-y-4">
            <div>
              <Label htmlFor="donation-title">Donation Title</Label>
              <Input
                id="donation-title"
                placeholder="What are you donating?"
                value={donationForm.title}
                onChange={(e) =>
                  setDonationForm({
                    ...donationForm,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="donation-description">Description</Label>
              <Textarea
                id="donation-description"
                placeholder="Describe your donation (quantity, condition, etc.)"
                value={donationForm.description}
                onChange={(e) =>
                  setDonationForm({
                    ...donationForm,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDonationDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Donation</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
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
  Plus,
  Search,
  Edit,
  Trash,
  Eye,
  Building,
  MapPin,
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

// Mock data for associations
const initialAssociations = [
  {
    id: "1",
    name: "Helping Hands Foundation",
    avatar: "/placeholder.svg?height=40&width=40",
    description:
      "Supporting homeless individuals with essential supplies and shelter",
    category: "Homelessness",
    location: "New York, NY",
    status: "active",
    createdAt: "2023-01-10",
  },
  {
    id: "2",
    name: "Children's Hope Alliance",
    avatar: "/placeholder.svg?height=40&width=40",
    description:
      "Providing educational resources and support for underprivileged children",
    category: "Education",
    location: "Chicago, IL",
    status: "active",
    createdAt: "2023-02-15",
  },
  {
    id: "3",
    name: "Food for All",
    avatar: "/placeholder.svg?height=40&width=40",
    description: "Fighting hunger by distributing food to families in need",
    category: "Food Security",
    location: "Los Angeles, CA",
    status: "active",
    createdAt: "2023-03-20",
  },
  {
    id: "4",
    name: "Medical Relief Initiative",
    avatar: "/placeholder.svg?height=40&width=40",
    description:
      "Providing access to basic healthcare and medications for those in need",
    category: "Healthcare",
    location: "Boston, MA",
    status: "pending",
    createdAt: "2023-04-25",
  },
  {
    id: "5",
    name: "Green Earth Project",
    avatar: "/placeholder.svg?height=40&width=40",
    description: "Environmental conservation and sustainability education",
    category: "Environment",
    location: "Seattle, WA",
    status: "inactive",
    createdAt: "2023-05-30",
  },
];

// Categories for filtering
const categories = [
  "All",
  "Homelessness",
  "Education",
  "Food Security",
  "Healthcare",
  "Environment",
  "Clothing",
  "Employment",
];

interface Association {
  id: string;
  name: string;
  avatar: string;
  description: string;
  category: string;
  location: string;
  status: string;
  createdAt: string;
}

export default function AssociationManagement() {
  const [associations, setAssociations] = useState(initialAssociations);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAssociation, setCurrentAssociation] = useState<Association | null>(null);
  const [newAssociation, setNewAssociation] = useState({
    name: "",
    description: "",
    category: "Homelessness",
    location: "",
    status: "active",
  });
  const isMobile = useMobile();

  const filteredAssociations = associations.filter((association) => {
    const matchesSearch =
      association.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      association.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || association.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || association.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateAssociation = () => {
    const id = (associations.length + 1).toString();
    const newAssociationWithId = {
      ...newAssociation,
      id,
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAssociations([...associations, newAssociationWithId]);
    setNewAssociation({
      name: "",
      description: "",
      category: "Homelessness",
      location: "",
      status: "active",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditAssociation = () => {
    if (!currentAssociation) return;
    setAssociations(
      associations.map((assoc) =>
        assoc.id === currentAssociation.id ? currentAssociation : assoc
      )
    );
    setIsEditDialogOpen(false);
  };

  const handleDeleteAssociation = () => {
    if (!currentAssociation) return;
    setAssociations(
      associations.filter((assoc) => assoc.id !== currentAssociation.id)
    );
    setIsDeleteDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
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
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
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
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Association
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Association</DialogTitle>
              <DialogDescription>
                Add a new association to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAssociation.name}
                  onChange={(e) =>
                    setNewAssociation({
                      ...newAssociation,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAssociation.description}
                  onChange={(e) =>
                    setNewAssociation({
                      ...newAssociation,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newAssociation.category}
                  onValueChange={(value) =>
                    setNewAssociation({ ...newAssociation, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newAssociation.location}
                  onChange={(e) =>
                    setNewAssociation({
                      ...newAssociation,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newAssociation.status}
                  onValueChange={(value) =>
                    setNewAssociation({ ...newAssociation, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAssociation}
                disabled={
                  !newAssociation.name ||
                  !newAssociation.description ||
                  !newAssociation.location
                }
              >
                Create Association
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Association</TableHead>
              {!isMobile && <TableHead>Category</TableHead>}
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              {!isMobile && <TableHead>Created</TableHead>}
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssociations.map((association) => (
              <TableRow key={association.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={association.avatar || "/placeholder.svg"}
                        alt={association.name}
                      />
                      <AvatarFallback>
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{association.name}</div>
                      {isMobile && (
                        <div className="text-xs text-muted-foreground">
                          {association.category}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                {!isMobile && <TableCell>{association.category}</TableCell>}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{association.location}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(association.status)}</TableCell>
                {!isMobile && <TableCell>{association.createdAt}</TableCell>}
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
                      <DropdownMenuItem onClick={() => {}}>
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
                        <Trash className="mr-2 h-4 w-4" /> Delete association
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Association Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Association</DialogTitle>
            <DialogDescription>
              Update association information.
            </DialogDescription>
          </DialogHeader>
          {currentAssociation && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={currentAssociation.name}
                  onChange={(e) =>
                    setCurrentAssociation({
                      ...currentAssociation,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={currentAssociation.description}
                  onChange={(e) =>
                    setCurrentAssociation({
                      ...currentAssociation,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={currentAssociation.category}
                  onValueChange={(value) =>
                    setCurrentAssociation({
                      ...currentAssociation,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={currentAssociation.location}
                  onChange={(e) =>
                    setCurrentAssociation({
                      ...currentAssociation,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentAssociation.status}
                  onValueChange={(value) =>
                    setCurrentAssociation({
                      ...currentAssociation,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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
            <Button onClick={handleEditAssociation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Association Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Association</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this association? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentAssociation && (
            <div className="flex items-center gap-4 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={currentAssociation.avatar || "/placeholder.svg"}
                  alt={currentAssociation.name}
                />
                <AvatarFallback>
                  <Building className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentAssociation.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentAssociation.location}
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
            <Button variant="destructive" onClick={handleDeleteAssociation}>
              Delete Association
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

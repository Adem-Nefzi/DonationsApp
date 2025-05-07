"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  HandHelping,
  MessageSquare,
  Search,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Association type
type Association = {
  id: string;
  name: string;
  avatar: string;
  description: string;
  services: string[];
  location: string;
  category: string;
};

// Mock data for associations
const associationsData: Association[] = [
  {
    id: "1",
    name: "Helping Hands Foundation",
    avatar: "/placeholder.svg?height=80&width=80",
    description:
      "Supporting homeless individuals with essential supplies and shelter",
    services: ["Clothes", "Food", "Hygiene Products"],
    location: "New York, NY",
    category: "Homelessness",
  },
  {
    id: "2",
    name: "Children's Hope Alliance",
    avatar: "/placeholder.svg?height=80&width=80",
    description:
      "Providing educational resources and support for underprivileged children",
    services: ["Books", "School Supplies", "Toys"],
    location: "Chicago, IL",
    category: "Education",
  },
  {
    id: "3",
    name: "Food for All",
    avatar: "/placeholder.svg?height=80&width=80",
    description: "Fighting hunger by distributing food to families in need",
    services: ["Non-perishable Food", "Fresh Produce", "Meal Programs"],
    location: "Los Angeles, CA",
    category: "Food Security",
  },
  {
    id: "4",
    name: "Medical Relief Initiative",
    avatar: "/placeholder.svg?height=80&width=80",
    description:
      "Providing access to basic healthcare and medications for those in need",
    services: ["Medications", "Health Checkups", "Medical Supplies"],
    location: "Boston, MA",
    category: "Healthcare",
  },
];

// Categories for filtering
const categories = [
  "All",
  "Homelessness",
  "Education",
  "Food Security",
  "Healthcare",
  "Employment",
];

type AssociationsListProps = {
  limit?: number;
};

export default function AssociationsList({ limit }: AssociationsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [requestDetails, setRequestDetails] = useState("");

  const filteredAssociations = associationsData
    .filter((association) => {
      const matchesSearch =
        association.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        association.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || association.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .slice(0, limit || associationsData.length);

  const handleRequestHelp = (association: Association) => {
    setSelectedAssociation(association);
    setRequestDialogOpen(true);
    // Reset form fields
    setRequestType("");
    setRequestDetails("");
  };

  const handleSubmitRequest = () => {
    // In a real app, you would send the request to the backend
    console.log("Submitting request:", {
      association: selectedAssociation?.name,
      type: requestType,
      details: requestDetails,
    });
    setRequestDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search associations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> {selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssociations.map((association) => (
          <Card key={association.id} className="overflow-hidden h-full">
            <div className="p-4 pb-0 flex justify-center">
              <Avatar className="h-16 w-16 border-2 border-background">
                <AvatarImage
                  src={association.avatar || "/placeholder.svg"}
                  alt={association.name}
                />
                <AvatarFallback>
                  <Building className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="p-4 flex-grow">
              <div className="text-center mb-3">
                <h3 className="font-semibold text-base">{association.name}</h3>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{association.location}</span>
                </div>
              </div>
              <p className="text-xs mb-3">{association.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge variant="outline" className="bg-primary/10 text-xs">
                  {association.category}
                </Badge>
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-medium mb-1">
                  Available Services:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {association.services.map((service) => (
                    <Badge
                      key={service}
                      variant="secondary"
                      className="text-xs"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 p-4 pt-0">
              <Button
                className="flex-1 gap-2 text-xs"
                size="sm"
                onClick={() => handleRequestHelp(association)}
              >
                <HandHelping className="h-3 w-3" /> Request Help
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MessageSquare className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Request Help from {selectedAssociation?.name}
            </DialogTitle>
            <DialogDescription>
              Fill out this form to request assistance. The association will
              review your request and contact you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="request-type">Type of Help Needed</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger id="request-type">
                  <SelectValue placeholder="Select type of help" />
                </SelectTrigger>
                <SelectContent>
                  {selectedAssociation?.services.map((service: string) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="request-details">Details</Label>
              <Textarea
                id="request-details"
                placeholder="Please describe your situation and what you need..."
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSubmitRequest}
              disabled={!requestType || !requestDetails}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

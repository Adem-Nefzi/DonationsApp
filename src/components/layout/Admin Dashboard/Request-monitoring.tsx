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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  MessageSquare,
  Check,
  X,
  User,
  Building,
  Search,
  Filter,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
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

// Mock data for requests
const requestsData = [
  {
    id: "1",
    recipient: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    association: {
      name: "Helping Hands Foundation",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    type: "Clothes",
    details: "Winter clothes for family of 5",
    status: "pending",
    date: "2023-12-15",
  },
  {
    id: "2",
    recipient: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    association: {
      name: "Food for All",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    type: "Food",
    details: "Non-perishable food items for a family of 3",
    status: "approved",
    date: "2023-12-14",
  },
  {
    id: "3",
    recipient: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    association: {
      name: "Children's Hope Alliance",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    type: "School Supplies",
    details: "School supplies for 2 children (ages 8 and 10)",
    status: "pending",
    date: "2023-12-13",
  },
  {
    id: "4",
    recipient: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    association: {
      name: "Medical Relief Initiative",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    type: "Medicine",
    details: "Over-the-counter medications for cold and flu",
    status: "rejected",
    date: "2023-12-12",
  },
  {
    id: "5",
    recipient: {
      name: "Lisa Patel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    association: {
      name: "Food for All",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    type: "Food",
    details: "Emergency food assistance",
    status: "approved",
    date: "2023-12-11",
  },
  {
    id: "6",
    recipient: {
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    association: {
      name: "Helping Hands Foundation",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    type: "Clothes",
    details: "Winter jackets for children",
    status: "pending",
    date: "2023-12-10",
  },
];

type RequestMonitoringProps = {
  limit?: number;
};

export default function RequestMonitoring({ limit }: RequestMonitoringProps) {
  // Define the Request type based on the structure of requestsData
  type Request = {
    id: string;
    recipient: {
      name: string;
      avatar: string;
    };
    association: {
      name: string;
      avatar: string;
    };
    type: string;
    details: string;
    status: string;
    date: string;
  };

  const [requests, setRequests] = useState(requestsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const isMobile = useMobile();

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] =
    useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.recipient.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.association.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "all" ||
        request.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    })
    .slice(0, limit || requests.length);

  const handleUpdateStatus = () => {
    if (!selectedRequest || !newStatus) return;

    const updatedRequests = requests.map((request) =>
      request.id === selectedRequest.id
        ? {
            ...request,
            status: newStatus,
          }
        : request
    );

    setRequests(updatedRequests);
    setIsUpdateStatusDialogOpen(false);
    setStatusNote("");
    setNewStatus("");
  };

  const openViewDialog = (request: Request) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const openUpdateStatusDialog = (request: Request, status: string) => {
    setSelectedRequest(request);
    setNewStatus(status);
    setIsUpdateStatusDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Request types for filtering
  const requestTypes = [
    "all",
    "Clothes",
    "Food",
    "Medicine",
    "School Supplies",
    "Hygiene Products",
    "Other",
  ];

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <span className="truncate">
                  {typeFilter === "all" ? "All Types" : typeFilter}
                </span>
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <span className="truncate">
                  {statusFilter === "all"
                    ? "All Status"
                    : statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Association</TableHead>
              {!isMobile && <TableHead>Type</TableHead>}
              {!isMobile && <TableHead>Details</TableHead>}
              <TableHead>Status</TableHead>
              {!isMobile && <TableHead>Date</TableHead>}
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={request.recipient.avatar || "/placeholder.svg"}
                        alt={request.recipient.name}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {request.recipient.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={request.association.avatar || "/placeholder.svg"}
                        alt={request.association.name}
                      />
                      <AvatarFallback>
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{request.association.name}</span>
                  </div>
                </TableCell>
                {!isMobile && <TableCell>{request.type}</TableCell>}
                {!isMobile && (
                  <TableCell className="max-w-[200px] truncate">
                    {request.details}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant={getStatusBadge(request.status)}>
                    {request.status}
                  </Badge>
                </TableCell>
                {!isMobile && <TableCell>{request.date}</TableCell>}
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
                      <DropdownMenuItem onClick={() => openViewDialog(request)}>
                        <Eye className="mr-2 h-4 w-4" /> View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" /> Send message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          openUpdateStatusDialog(request, "approved")
                        }
                      >
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          openUpdateStatusDialog(request, "rejected")
                        }
                      >
                        <X className="mr-2 h-4 w-4" /> Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              View detailed information about this request.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Recipient</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          selectedRequest.recipient.avatar || "/placeholder.svg"
                        }
                        alt={selectedRequest.recipient.name}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedRequest.recipient.name}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Association</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          selectedRequest.association.avatar ||
                          "/placeholder.svg"
                        }
                        alt={selectedRequest.association.name}
                      />
                      <AvatarFallback>
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedRequest.association.name}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Request Type</h3>
                <p>{selectedRequest.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Details</h3>
                <p className="text-sm">{selectedRequest.details}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <Badge variant={getStatusBadge(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Date</h3>
                  <p>{selectedRequest.date}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={isUpdateStatusDialogOpen}
        onOpenChange={setIsUpdateStatusDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === "approved" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {newStatus === "approved"
                ? "Approve this request and notify the recipient."
                : "Reject this request and provide a reason."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status-note">
                {newStatus === "approved"
                  ? "Additional Information (Optional)"
                  : "Reason for Rejection"}
              </Label>
              <Textarea
                id="status-note"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder={
                  newStatus === "approved"
                    ? "Add any additional information for the recipient..."
                    : "Provide a reason for rejecting this request..."
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={newStatus === "approved" ? "default" : "destructive"}
              onClick={handleUpdateStatus}
              disabled={newStatus === "rejected" && !statusNote}
            >
              {newStatus === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

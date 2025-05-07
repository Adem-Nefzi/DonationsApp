"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  MoreHorizontal,
  MessageSquare,
  Eye,
  Building,
  Clock,
  X,
} from "lucide-react";

// Mock data for requests
const requestsData = [
  {
    id: "1",
    association: "Helping Hands Foundation",
    associationAvatar: "/placeholder.svg?height=40&width=40",
    type: "Clothes",
    details: "Winter clothes for my family (2 adults, 3 children)",
    status: "approved",
    date: "2023-12-15",
    pickupDate: "2023-12-20",
    pickupLocation: "123 Main St, New York, NY 10001",
  },
  {
    id: "2",
    association: "Food for All",
    associationAvatar: "/placeholder.svg?height=40&width=40",
    type: "Food",
    details: "Non-perishable food items for a family of 5",
    status: "pending",
    date: "2023-12-14",
  },
  {
    id: "3",
    association: "Children's Hope Alliance",
    associationAvatar: "/placeholder.svg?height=40&width=40",
    type: "School Supplies",
    details: "School supplies for 3 children (ages 7, 9, and 12)",
    status: "approved",
    date: "2023-12-10",
    pickupDate: "2023-12-18",
    pickupLocation: "456 Park Ave, Chicago, IL 60601",
  },
  {
    id: "4",
    association: "Medical Relief Initiative",
    associationAvatar: "/placeholder.svg?height=40&width=40",
    type: "Medicine",
    details: "Over-the-counter medications for cold and flu",
    status: "rejected",
    date: "2023-12-05",
    rejectionReason:
      "We currently don't have these items in stock. Please check back next week.",
  },
  {
    id: "5",
    association: "Food for All",
    associationAvatar: "/placeholder.svg?height=40&width=40",
    type: "Food",
    details: "Emergency food assistance",
    status: "pending",
    date: "2023-12-12",
  },
];

type RequestHistoryProps = {
  limit?: number;
};

export default function RequestHistory({ limit }: RequestHistoryProps) {
  const [filter, setFilter] = useState("all");
  const [requests, setRequests] = useState(requestsData);

  const filteredRequests = requests
    .filter((request) => {
      if (filter === "all") return true;
      return request.status === filter;
    })
    .slice(0, limit || requests.length);

  const handleCancelRequest = (id: string) => {
    // In a real app, you would send a request to the backend
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "cancelled" } : req
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-yellow-500"; // pending
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "cancelled":
        return "outline";
      default:
        return "secondary"; // pending
    }
  };

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage
                      src={request.associationAvatar || "/placeholder.svg"}
                      alt={request.association}
                    />
                    <AvatarFallback>
                      <Building className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">
                        {request.association}
                      </h4>
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Type: {request.type}
                    </p>
                    <p className="text-xs mt-1">{request.details}</p>

                    {request.status === "approved" && (
                      <div className="mt-2 p-2 bg-muted rounded-md text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>Pickup: {request.pickupDate}</span>
                        </div>
                        <div className="flex items-start gap-1 mt-1">
                          <Building className="h-3 w-3 text-muted-foreground mt-0.5" />
                          <span>{request.pickupLocation}</span>
                        </div>
                      </div>
                    )}

                    {request.status === "rejected" &&
                      request.rejectionReason && (
                        <div className="mt-2 p-2 bg-destructive/10 rounded-md text-xs">
                          <p>Reason: {request.rejectionReason}</p>
                        </div>
                      )}

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">
                        {request.date}
                      </Badge>
                      <Badge
                        variant={getStatusBadge(request.status)}
                        className="text-[10px]"
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-3 w-3" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-xs">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-xs">
                        <Eye className="mr-2 h-3 w-3" /> View details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">
                        <MessageSquare className="mr-2 h-3 w-3" /> Message
                        association
                      </DropdownMenuItem>
                      {request.status === "pending" && (
                        <DropdownMenuItem
                          className="text-xs text-destructive"
                          onClick={() => handleCancelRequest(request.id)}
                        >
                          <X className="mr-2 h-3 w-3" /> Cancel request
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

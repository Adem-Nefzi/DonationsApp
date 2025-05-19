"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Clock } from "lucide-react";
import { getRecipientRequests } from "@/api/donation";
import { RecipientRequest } from "@/api/donation";
import { format } from "date-fns";

type RequestHistoryProps = {
  limit?: number;
};

export default function RequestHistory({ limit }: RequestHistoryProps) {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [requests, setRequests] = useState<RecipientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getRecipientRequests();
        setRequests(data);
      } catch (err) {
        setError("Failed to fetch requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests
    .filter((request) => {
      if (filter === "all") return true;
      return request.status === filter;
    })
    .slice(0, limit || requests.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
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
      default:
        return "secondary"; // pending
    }
  };

  const getAssociationName = (request: RecipientRequest) => {
    return request.association?.name || "Association";
  };

  const getAssociationLogo = (request: RecipientRequest) => {
    return request.association?.logo || "/placeholder.svg";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        No requests found
      </div>
    );
  }

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
                      src={getAssociationLogo(request)}
                      alt={getAssociationName(request)}
                    />
                    <AvatarFallback>
                      <Building className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">
                        {getAssociationName(request)}
                      </h4>
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Title: {request.title}
                    </p>
                    <p className="text-xs mt-1">
                      {request.description || "No description"}
                    </p>

                    {request.status === "approved" && (
                      <div className="mt-2 p-2 bg-muted rounded-md text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>
                            Created:{" "}
                            {format(
                              new Date(request.created_at),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">
                        {format(new Date(request.created_at), "MMM dd, yyyy")}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
import { CheckCircle, User, XCircle } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getAssociationRequests,
  updateRequestStatus,
  type Offer as BaseOffer,
} from "@/api/donation";

// Extended Offer type with user property
type Offer = BaseOffer & {
  user?: {
    avatar?: string;
    first_name?: string;
    last_name?: string;
  };
};
import { toast } from "@/hooks/use-toast";

type DonationsListProps = {
  associationId: number; // Changed from string to number
  limit?: number;
};
const user = JSON.parse(localStorage.getItem("user") || "{}");
export default function DonationsList({
  associationId = user.id, // Changed from string to number
  limit,
}: DonationsListProps) {
  const [donations, setDonations] = useState<Offer[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const isMobile = useMobile();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!associationId) return;

    const fetchDonations = async () => {
      setLoading(true);

      try {
        const response = await getAssociationRequests(associationId);

        // If we get this far but no logs appear, the issue is in getAssociationOffers
        const offers = Array.isArray(response)
          ? response
          : response.offers || response.data || [];

        setDonations(offers);
      } catch (error) {
        toast({
          title: "Failed to load donations",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [associationId]);

  const filteredDonations = donations
    .filter((donation) => filter === "all" || donation.status === filter)
    .slice(0, limit || donations.length);

  const getStatusColor = (status: Offer["status"]) => {
    switch (status) {
      case "approved": // Changed from "approved"
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleUpdateStatus = async (
    id: number, // Changed from string to number
    status: "approved" | "rejected"
  ) => {
    try {
      await updateRequestStatus(id, associationId, status); // Added associationId
      setDonations((prev) =>
        prev.map((don) => (don.id === id ? { ...don, status } : don))
      );
      toast({
        title: `Offer ${status}`,
        description: `Offer was successfully ${status}.`,
        className:
          "border-emerald-200 dark:border-emerald-600/50 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-2xl px-5 py-4 shadow-lg font-medium",
      });
    } catch (error) {
      console.error("Failed to update offer status:", error);
      toast({
        title: "Failed to update offer",
        description: "Please try again.",
        variant: "destructive",
      });
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
            variant={filter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending
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

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Donor</TableHead>
              {!isMobile && <TableHead>Title</TableHead>}
              {!isMobile && <TableHead>Description</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredDonations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No donations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={donation.user?.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-xs">
                        {donation.user?.first_name && donation.user?.last_name
                          ? `${donation.user.first_name} ${donation.user.last_name}`
                          : `Donor #${donation.user_id}`}
                      </span>
                    </div>
                  </TableCell>
                  {!isMobile && (
                    <TableCell className="text-xs">{donation.title}</TableCell>
                  )}
                  {!isMobile && (
                    <TableCell className="text-xs truncate max-w-xs">
                      {donation.description}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusColor(
                          donation.status
                        )}`}
                      />
                      <span className="capitalize text-xs">
                        {donation.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {donation.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            handleUpdateStatus(donation.id, "approved")
                          }
                          title="Accept"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            handleUpdateStatus(donation.id, "rejected")
                          }
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

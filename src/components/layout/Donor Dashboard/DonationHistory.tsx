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
import {
  Building,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDonorOffers } from "@/api/donation";
import { Offer } from "@/api/donation";
import { format } from "date-fns";

export default function DonationHistory() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMobile();

  useEffect(() => {
    const fetchDonorOffers = async () => {
      try {
        setLoading(true);
        const data = await getDonorOffers();
        setOffers(data);
      } catch (err) {
        setError("Failed to fetch donation history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorOffers();
  }, []);

  const filteredOffers = offers.filter((offer) => {
    if (filter === "all") return true;
    return offer.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading donation history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No donation history found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Association</TableHead>
              {!isMobile && <TableHead>Title</TableHead>}
              {!isMobile && <TableHead>Description</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          typeof offer.association?.logo === "string"
                            ? offer.association.logo
                            : "/placeholder.svg"
                        }
                        alt={offer.association?.name || "Association"}
                      />
                      <AvatarFallback>
                        <Building className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-xs">
                      {offer.association?.name || "Association not found"}
                    </span>
                  </div>
                </TableCell>
                {!isMobile && (
                  <TableCell className="text-xs">{offer.title}</TableCell>
                )}
                {!isMobile && (
                  <TableCell className="text-xs">
                    {offer.description || "No description"}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${getStatusColor(
                        offer.status
                      )}`}
                    />
                    <span className="capitalize text-xs">
                      {getStatusDisplay(offer.status)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  {format(new Date(offer.created_at), "MMM dd, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

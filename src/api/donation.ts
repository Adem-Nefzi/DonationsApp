// src/api/donation.ts
import api from "./client";

// Create a new offer (donation)
export const createOffer = async (offerData: {
  association_id: number;
  user_id: number;
  title: string;
  description?: string;
}) => {
  const response = await api.post("/offers", offerData, {
    withCredentials: true, // required if using sanctum for auth
  });
  return response.data;
};

// Offer type definition
export interface Offer {
  id: number;
  association_id: number;
  user_id: number;
  title: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  user?: {
    // This might be missing
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
}

// Get offers for an association
export const getAssociationOffers = async (associationId: number) => {
  const response = await api.get(`/association/${associationId}/offers`, {
    withCredentials: true,
  });
  return response.data.offers;
};

export const updateOfferStatus = async (
  offerId: number, // Changed from string to number
  associationId: number,
  status: "approved" | "rejected"
) => {
  const response = await api.patch(
    `/offers/${offerId}/status`,
    {
      status,
      association_id: associationId,
    },
    { withCredentials: true }
  );
  return response.data;
};

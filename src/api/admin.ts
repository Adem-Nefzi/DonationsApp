// src/api/admin.ts
import api from "./client";

// Admin User Management
export const adminGetAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const adminGetUser = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const adminCreateUser = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  user_type: "donor" | "recipient" | "admin";
}) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const adminUpdateUser = async (
  userId: string,
  userData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    user_type?: "donor" | "recipient" | "admin";
  }
) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const adminDeleteUser = async (userId: string) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const adminRestoreUser = async (userId: string) => {
  const response = await api.post(`/users/${userId}/restore`);
  return response.data;
};

export const adminGetDeletedUsers = async () => {
  const response = await api.get("/users/deleted");
  // Handle both array and object responses in one line
  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || response.data?.users || [];
};

// Admin Association Management
export const adminCreateAssociation = async (associationData: {
  name: string;
  email: string;
  password: string;
  description?: string;
  phone?: string;
  address?: string;
}) => {
  const response = await api.post("/associations", associationData);
  return response.data;
};

export const adminDeleteAssociation = async (associationId: string) => {
  const response = await api.delete(`/associations/${associationId}`);
  return response.data;
};

// Type for user data
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  user_type: "donor" | "recipient" | "admin";
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Type for association data
export interface Association {
  id: string;
  name: string;
  email: string;
  description?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ExtendedAssociation extends Association {
  logo_url?: string;
  category?: "Food" | "Clothes" | "Healthcare" | "Education" | "Home supplies";
}

export const adminDeleteAssociationPermanently = async (
  id: string,
  force = false
) => {
  const url = force ? `/associations/${id}/force` : `/associations/${id}`;
  const response = await api.delete(url);
  return response.data;
};

export const getDeletedAssociations = async () => {
  const response = await api.get("/associations/trashed/all");
  return response.data;
};

export const restoreAssociation = async (id: string) => {
  const response = await api.post(`/associations/${id}/restore`);
  return response.data;
};

export const getAllAssociations = async () => {
  const response = await api.get("/associations");
  return response.data;
};

export const getAssociationById = async (id: string) => {
  const response = await api.get(`/associations/${id}`);
  return response.data;
};

export const createAssociation = async (associationData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
  description?: string;
  category?: "Food" | "Clothes" | "Healthcare" | "Education" | "Home supplies";
  logo_url?: File;
}) => {
  const formData = new FormData();
  formData.append("name", associationData.name);
  formData.append("email", associationData.email);
  formData.append("password", associationData.password);
  formData.append("password_confirmation", associationData.confirmPassword);
  if (associationData.phone) formData.append("phone", associationData.phone);
  if (associationData.address)
    formData.append("address", associationData.address);
  if (associationData.description)
    formData.append("description", associationData.description);
  if (associationData.category)
    formData.append("category", associationData.category);
  if (associationData.logo_url)
    formData.append("logo_url", associationData.logo_url);

  const response = await api.post("/associations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const adminUpdateAssociation = async (
  id: string,
  associationData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    description?: string;
    category?: string;
    password?: string;
    confirmPassword?: string;
    logo_url?: File | string;
  }
) => {
  const formData = new FormData();

  // Append all fields to FormData
  if (associationData.name) formData.append("name", associationData.name);
  if (associationData.email) formData.append("email", associationData.email);
  if (associationData.phone) formData.append("phone", associationData.phone);
  if (associationData.address)
    formData.append("address", associationData.address);
  if (associationData.description)
    formData.append("description", associationData.description);
  if (associationData.category)
    formData.append("category", associationData.category);
  if (associationData.password) {
    formData.append("password", associationData.password);
    formData.append(
      "password_confirmation",
      associationData.confirmPassword || ""
    );
  }
  if (associationData.logo_url instanceof File) {
    formData.append("logo_url", associationData.logo_url);
  }

  const response = await api.put(`/associations/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

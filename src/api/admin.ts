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

export const adminUpdateAssociation = async (
  associationId: string,
  associationData: {
    name?: string;
    email?: string;
    description?: string;
    phone?: string;
    address?: string;
  }
) => {
  const response = await api.put(
    `/associations/${associationId}`,
    associationData
  );
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

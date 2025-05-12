// src/api/auth.ts
import api from "./client";

interface LoginData {
  email: string;
  password: string;
}

interface AssociationRegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  description?: string;
  logo_url?: File;
  category?: "Food" | "Clothes" | "Healthcare" | "Education" | "Home supplies";
}

export const login = async (data: LoginData) => {
  const response = await api.post("/login", data);
  localStorage.setItem("sanctum_token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

export const register = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: "donor" | "recipient" | "admin";
}) => {
  return api.post("/register", data);
};

// Updated association register function
export const associationRegister = async (data: AssociationRegisterData) => {
  // Create a FormData object for multipart/form-data submission
  const formData = new FormData();

  // Append all fields to the FormData
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (data.phone) formData.append("phone", data.phone);
  if (data.address) formData.append("address", data.address);
  if (data.description) formData.append("description", data.description);
  if (data.category) formData.append("category", data.category);

  // Append the file if it exists
  if (data.logo_url) {
    formData.append("logo_url", data.logo_url);
  }

  // Make the API request with FormData
  const response = await api.post("/association/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Important for file uploads
    },
  });

  localStorage.setItem("sanctum_token", response.data.token);
  localStorage.setItem("user_type", "association");
  localStorage.setItem("user", JSON.stringify(response.data.association));

  return response.data;
};

export const logout = async () => {
  await api.post("/logout");
  localStorage.removeItem("sanctum_token");
  localStorage.removeItem("user_type");
  localStorage.removeItem("user");
};

export const associationLogin = async (data: LoginData) => {
  const response = await api.post("/association/login", data);
  localStorage.setItem("sanctum_token", response.data.token);
  localStorage.setItem("user_type", "association");
  localStorage.setItem("user", JSON.stringify(response.data.association));
  return response.data;
};

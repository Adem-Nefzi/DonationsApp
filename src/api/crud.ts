import api from "@/api/client";

// Regular User Profile CRUD
export const updateUserProfile = async (userData: {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  password?: string;
  confirmPassword?: string;
}) => {
  const transformedData = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    phone: userData.phone,
    address: userData.address,
    ...(userData.password && {
      password: userData.password,
      password_confirmation: userData.confirmPassword,
    }),
  };

  const response = await api.put("/me", transformedData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/me");
  return response.data;
};

export const deleteUserAccount = async (userId?: string) => {
  const url = userId ? `/users/${userId}` : "/me";
  const response = await api.delete(url);
  return response.data;
};

// Association CRUD Operations
export const getAssociationProfile = async () => {
  try {
    const response = await api.get("/me"); // Changed from "/me"
    console.log("Association profile response:", response.data); // For debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching association profile:", error);
    throw error;
  }
};

export const updateAssociationProfile = async (associationData: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  category?: "Food" | "Clothes" | "Healthcare" | "Education" | "Home supplies";
  password?: string;
  confirmPassword?: string;
  logo_url?: File | string;
}) => {
  const formData = new FormData();

  // Append all fields to FormData
  if (associationData.name !== undefined)
    formData.append("name", associationData.name);
  if (associationData.email !== undefined)
    formData.append("email", associationData.email);
  if (associationData.phone !== undefined)
    formData.append("phone", associationData.phone);
  if (associationData.address !== undefined)
    formData.append("address", associationData.address);
  if (associationData.description !== undefined)
    formData.append("description", associationData.description);
  if (associationData.category !== undefined)
    formData.append("category", associationData.category);

  // Handle password fields
  if (associationData.password !== undefined) {
    formData.append("password", associationData.password);
    formData.append(
      "password_confirmation",
      associationData.confirmPassword || ""
    );
  }

  // Handle file upload
  if (associationData.logo_url instanceof File) {
    formData.append("logo_url", associationData.logo_url);
  } else if (associationData.logo_url !== undefined) {
    formData.append("logo_url", associationData.logo_url);
  }

  // Debug output
  console.log("FormData contents:");
  formData.forEach((value, key) => {
    console.log(key, value instanceof File ? `File: ${value.name}` : value);
  });

  const response = await api.put("/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("API Response:", response.data);
  return response.data;
};

export const deleteAssociationAccount = async () => {
  const response = await api.delete("/me");
  return response.data;
};





export const fetchAllAssociations = async (params?: {
  category?: string;
  search?: string;
}) => {
  try {
    const response = await api.get("/associations", {
      params: {
        category: params?.category,
        search: params?.search,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching associations:", error);
    throw error;
  }
};

export const fetchSingleAssociation = async (id: string) => {
  try {
    const response = await api.get(`/associations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching association with ID ${id}:`, error);
    throw error;
  }
};

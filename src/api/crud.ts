import api from "@/api/client";

// Update Regular User Profile
export const updateUserProfile = async (userData: {
  firstName: string; // Changed from FirstName
  lastName: string; // Changed from LastName
  phone: string;
  address: string;
  password?: string;
  confirmPassword?: string; // Changed from password_confirmation
}) => {
  // Transform data to match backend expectations
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
// Update Association Profile
export const updateAssociationProfile = async (associationData: {
  FirstName: string;
  LastName: string;
  phone: string;
  address: string;
  description: string;
  password?: string;
  password_confirmation?: string;
}) => {
  const response = await api.put("/my-association", associationData);
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

// src/api/auth.ts
import api from "./client";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post("/login", data);
  localStorage.setItem("sanctum_token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user)); // assuming response contains user object
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

export const logout = async () => {
  await api.post("/logout");
  localStorage.removeItem("sanctum_token");
};

export const associationLogin = async (data: LoginData) => {
  const response = await api.post("/association/login", data);
  localStorage.setItem("sanctum_token", response.data.token);
  localStorage.setItem("user_type", "association");
  localStorage.setItem("user", JSON.stringify(response.data.user)); // save user data
  return response.data;
};

import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "@/api/auth";

export const ProtectedRoute = () => {
  const user = getCurrentUser();

  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the child routes
  return <Outlet />;
};

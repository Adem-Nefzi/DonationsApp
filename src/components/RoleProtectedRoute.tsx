// src/components/RoleProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "@/api/auth";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.user_type)) {
    // User doesn't have the required role, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

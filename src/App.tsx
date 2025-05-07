import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupPage from "./components/Signup";
import HomePage from "./components/HomePage"; // Assuming you have this
import LoginPage from "./components/Login";
import RecipientPage from "./components/RecipientDashboard";
import AssociationPage from "./components/AssociationDashboard";
import DashboardPage from "./components/DonorDashboard";
import AdminDashboard from "./components/layout/Admin Dashboard/Admin-Dashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/donor-dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/association-dashboard",
    element: <AssociationPage />,
  },
  {
    path: "/recipient-dashboard",
    element: <RecipientPage />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

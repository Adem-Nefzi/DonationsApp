import { Suspense } from "react";
import AdminDashboard from "@/components/layout/Admin Dashboard/Admin-Dashboard";
import DashboardSkeleton from "@/components/layout/Admin Dashboard/DashboardSkeleton";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
          <Suspense fallback={<DashboardSkeleton />}>
            <AdminDashboard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

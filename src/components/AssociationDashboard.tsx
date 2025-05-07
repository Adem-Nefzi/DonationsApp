import { Suspense } from "react";
import AssociationDashboard from "@/components/layout/Association Dashboard/AssociationDashboard";
import DashboardSkeleton from "@/components/layout/Donor Dashboard/DashboardSkeleton";

export default function AssociationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <AssociationDashboard />
        </Suspense>
      </div>
    </div>
  );
}

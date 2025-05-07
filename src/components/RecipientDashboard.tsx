import { Suspense } from "react";
import RecipientDashboard from "@/components/layout/Recipient-Dashboard/Recipient-Dashboard";
import DashboardSkeleton from "@/components/layout/Recipient-Dashboard/DashboardSkeleton";

export default function RecipientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-8xl mx-auto p-6 md:p-8 lg:p-10">
        <Suspense fallback={<DashboardSkeleton />}>
          <RecipientDashboard />
        </Suspense>
      </div>
    </div>
  );
}

import { MainLayout, type NavTab } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, lazy, useState } from "react";

const CompilerPage = lazy(() => import("@/pages/CompilerPage"));
const EvaluationPage = lazy(() => import("@/pages/EvaluationPage"));
const MetricsPage = lazy(() => import("@/pages/MetricsPage"));

function PageFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-64 mt-4" />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("compiler");

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Suspense fallback={<PageFallback />}>
        {activeTab === "compiler" && <CompilerPage />}
        {activeTab === "evaluation" && <EvaluationPage />}
        {activeTab === "metrics" && <MetricsPage />}
      </Suspense>
    </MainLayout>
  );
}

// src/components/shared/transitions/AdminDashboardSkeleton.tsx
"use client";

interface AdminDashboardSkeletonProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const AdminDashboardSkeleton = ({
  children,
  isLoading = false,
}: AdminDashboardSkeletonProps) => {
  // Apenas mostra skeleton se estiver carregando, sem transições entre páginas
  if (isLoading) {
    return <AdminSkeletonLoader />;
  }

  // Sem animações extras - o AdminLayout já tem suas próprias transições
  return <>{children}</>;
};

// Componente de Skeleton para páginas admin
const AdminSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-8">
          <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex w-64 flex-col bg-background border-r border-border">
          <div className="p-6">
            <div className="h-8 w-24 bg-muted animate-pulse rounded mb-6"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2"></div>
            <div className="h-4 w-72 bg-muted animate-pulse rounded"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <div className="h-4 w-24 bg-muted animate-pulse rounded mb-3"></div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>

          {/* Table/Chart Area */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-6"></div>

            {/* Table Headers */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-20 bg-muted animate-pulse rounded"
                ></div>
              ))}
            </div>

            {/* Table Rows */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 mb-3 py-3 border-b border-border"
              >
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 w-full bg-muted animate-pulse rounded"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

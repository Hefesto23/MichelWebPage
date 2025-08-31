interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function Skeleton({ className = "", height = "h-4", width = "w-full" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${height} ${width} ${className}`}
    />
  );
}

// Skeletons específicos da homepage
export function HeroSkeleton() {
  return (
    <section className="hero-section bg-gray-200 dark:bg-gray-800">
      <div className="hero-overlay section-padding">
        <div className="content-container">
          <div className="hero-content space-y-4">
            <Skeleton height="h-16" className="mb-4" />
            <Skeleton height="h-6" width="w-3/4" />
            <Skeleton height="h-12" width="w-48" className="mt-8 rounded-md" />
            <Skeleton height="h-4" width="w-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WelcomeSkeleton() {
  return (
    <section className="section-padding">
      <div className="content-container space-y-6">
        <Skeleton height="h-8" width="w-1/2" />
        <Skeleton height="h-4" />
        <Skeleton height="h-4" width="w-3/4" />
        <Skeleton height="h-4" width="w-2/3" />
      </div>
    </section>
  );
}

export function ServicesSkeleton() {
  return (
    <section className="section-padding">
      <div className="content-container space-y-6">
        <div className="text-center space-y-4">
          <Skeleton height="h-8" width="w-1/3" className="mx-auto" />
          <Skeleton height="h-4" width="w-2/3" className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton height="h-48" className="rounded-lg" />
              <Skeleton height="h-6" width="w-3/4" />
              <Skeleton height="h-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClinicSkeleton() {
  return (
    <section className="section-padding">
      <div className="content-container space-y-6">
        <Skeleton height="h-8" width="w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton height="h-4" />
            <Skeleton height="h-4" width="w-3/4" />
            <Skeleton height="h-4" width="w-2/3" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height="h-32" className="rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DivisorSkeleton() {
  return (
    <div className="relative w-full h-[400px] bg-gray-200 dark:bg-gray-800">
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton height="h-8" width="w-1/2" />
      </div>
    </div>
  );
}
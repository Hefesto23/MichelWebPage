export const ServicesSkeleton = () => {
  return (
    <section id="primeiros-passos" className="services-section">
      <div className="content-container">
        <div className="services-container">
          <div className="services-content">
            <div className="section-header">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>

            <div className="grid-services">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
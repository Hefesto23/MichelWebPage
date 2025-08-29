export const ClinicSkeleton = () => {
  return (
    <section id="espaco-clinico" className="clinic-section">
      <div className="content-container">
        <div className="clinic-container">
          <div className="section-header">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="mx-auto">
            <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Carregando galeria...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
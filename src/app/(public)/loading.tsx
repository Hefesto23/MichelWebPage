// Global loading component for the entire page
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Loading */}
      <section id="hero" className="hero-section" style={{ backgroundImage: "url('/assets/horizonte.jpg')" }}>
        <div className="hero-overlay section-padding">
          <div className="content-container">
            <div className="hero-content">
              <div className="hero-text animate-pulse space-y-4">
                <div className="h-6 bg-white/20 rounded w-3/4"></div>
                <div className="h-6 bg-white/20 rounded w-2/3"></div>
                <div className="h-6 bg-white/20 rounded w-4/5"></div>
              </div>
              
              <div className="mt-4 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-1/2 mb-6"></div>
              </div>
              
              <div className="my-10">
                <div className="h-12 bg-white/20 rounded w-48 animate-pulse"></div>
              </div>
              
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="hero-cta">
            <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Welcome Loading */}
      <section className="welcome-section">
        <div className="content-container">
          <div className="welcome-container">
            <div className="welcome-text">
              <div className="section-header">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
              </div>
              <div className="welcome-content">
                <article className="space-y-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
                  </div>
                </article>
              </div>
            </div>

            <div className="welcome-image">
              <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisor Loading */}
      <div className="relative h-96 w-full overflow-hidden bg-gray-300 dark:bg-gray-700">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-center z-10">
          <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl animate-pulse p-8">
            <div className="space-y-3">
              <div className="h-6 bg-white/20 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-white/20 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Loading */}
      <section className="services-section">
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

      {/* Loading text at bottom */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-lg font-medium">Carregando página...</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aguarde enquanto carregamos o conteúdo
          </p>
        </div>
      </div>
    </div>
  );
}
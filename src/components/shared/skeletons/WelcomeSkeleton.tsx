export const WelcomeSkeleton = () => {
  return (
    <section id="saiba-mais" className="welcome-section">
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
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
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
  );
};
export const HeroSkeleton = () => {
  return (
    <section id="hero" className="hero-section" style={{ backgroundImage: "url('/assets/horizonte.jpg')" }}>
      <div className="hero-overlay section-padding">
        <div className="content-container">
          <div className="hero-content">
            <div className="hero-text animate-pulse">
              <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-2/3 mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-4/5 mb-6"></div>
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
  );
};
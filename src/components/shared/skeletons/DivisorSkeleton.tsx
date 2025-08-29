export const DivisorSkeleton = () => {
  return (
    <div className="relative h-96 w-full overflow-hidden bg-gray-300 dark:bg-gray-700">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      <div className="relative h-full flex flex-col items-center justify-center text-center z-10" 
           style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl animate-pulse" 
             style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <div className="space-y-3">
            <div className="h-6 bg-white/20 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-white/20 rounded w-2/3 mx-auto"></div>
            <div className="h-6 bg-white/20 rounded w-4/5 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
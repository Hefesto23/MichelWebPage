import {
  getDivisoriasContent,
  type DivisoriaData,
} from "@/components/pages/home/divisorias-content";

interface DivisorProps {
  index?: number;
  quotes: DivisoriaData[];
}

const Divisor = ({ index = 0, quotes }: DivisorProps) => {
  const safeIndex = index % quotes.length;
  const quote = quotes[safeIndex];

  return (
    <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden">
      <div
        className="parallax-bg absolute inset-0 h-[120%] -top-[10%] bg-center bg-cover will-change-transform"
        style={{
          backgroundImage: `url('${quote.backgroundImage}')`,
          transform: "translate3d(0, 0, 0)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      <div
        className="relative h-full flex flex-col items-center justify-center text-center z-10"
        style={{ padding: "clamp(1rem, 4vw, 2rem)" }}
      >
        <div
          className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl"
          style={{ padding: "clamp(1.5rem, 4vw, 2rem)" }}
        >
          <blockquote>
            <p
              className="font-serif text-white leading-relaxed text-center text-lg sm:text-xl md:text-2xl lg:text-3xl"
            >
              {quote.text}
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

// Server Component wrapper para carregar os dados
export const DivisorServer = async ({ index = 0 }: { index?: number }) => {
  const quotes = await getDivisoriasContent();
  return <Divisor index={index} quotes={quotes} />;
};

export default Divisor;

const Divisor = ({ index = 0 }) => {
  const quotes = [
    {
      info: "Segunda à Sexta das 8:00 as 21:00",
      info2: "Obs: As consultas necessitam ser previamente agendadas.",
      info3: "",
      detail: "* Atendimentos a partir de 20 anos de idade",
      backgroundImage: "/assets/quotes/mindfulness.jpg",
    },
    {
      info: "Plantão psicológico - serviço de atendimento pontual de suporte emocional imediato.",
      info2:
        "Psicoterapia online - uma modalidade de terapia que possibilita" +
        "atendimento à distância, incluindo pacientes em diferentes países.",
      detail: "Veja mais em terapias...",
      backgroundImage: "/assets/quotes/growth.jpg",
    },
    {
      info: "A mudança é um processo, não um evento.",
      info2: "",
      info3: "",
      detail: "Albert Ellis",
      backgroundImage: "/assets/quotes/journey.jpg",
    },
    {
      info: "O comportamento é mantido por suas consequências.",
      detail: "B.F. Skinner",
      backgroundImage: "/assets/quotes/reflection.jpg",
    },
    {
      info: "A terapia é uma oportunidade de reconstruir a forma como vivenciamos o mundo.",
      detail: "Donald Meichenbaum",
      backgroundImage: "/assets/quotes/rebuild.jpg",
    },
    {
      info: "Toda resposta aprendida é uma oportunidade de mudança.",
      detail: "Joseph Wolpe",
      backgroundImage: "/assets/quotes/opportunity.jpg",
    },
  ];

  const safeIndex = index % quotes.length;
  const quote = quotes[safeIndex];

  return (
    <div className="relative h-96 w-full overflow-hidden">
      <div
        className="parallax-bg absolute inset-0 h-[120%] -top-[10%] bg-center bg-cover will-change-transform"
        style={{
          backgroundImage: `url('${quote.backgroundImage}')`,
          transform: "translate3d(0, 0, 0)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      <div className="relative h-full flex flex-col items-center justify-center text-center z-10" 
           style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl" 
             style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
          <blockquote>
            <p className="font-serif text-white leading-relaxed" 
               style={{ 
                 fontSize: 'clamp(1.125rem, 4vw, 1.875rem)',
                 marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
               }}>
              {quote.info}
            </p>
            <p className="font-serif text-white leading-relaxed" 
               style={{ 
                 fontSize: 'clamp(1.125rem, 4vw, 1.875rem)',
                 marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
               }}>
              {quote?.info2}
            </p>
            <p className="font-serif text-white leading-relaxed" 
               style={{ 
                 fontSize: 'clamp(1.125rem, 4vw, 1.875rem)',
                 marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
               }}>
              {quote?.info3}
            </p>
            <footer className="text-white/90 font-bold italic" 
                    style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
              {quote.detail}
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Divisor;

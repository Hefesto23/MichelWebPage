"use client";
export default function Services() {
  const services = [
    {
      title: "Terapia Individual",
      description:
        "Apoio emocional e psicológico para indivíduos que buscam autoconhecimento e desenvolvimento pessoal.",
    },
    {
      title: "Terapia de Casal",
      description:
        "Ajuda para casais enfrentarem desafios e melhorarem sua comunicação e conexão emocional.",
    },
    {
      title: "Terapia Familiar",
      description:
        "Suporte para famílias em crises, com foco em melhorar o relacionamento e o entendimento mútuo.",
    },
    {
      title: "Consultas Online",
      description:
        "Atendimento psicológico no conforto da sua casa, através de plataformas seguras e confiáveis.",
    },
  ];

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Nossos Serviços</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

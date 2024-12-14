"use client";
import { Clock, Mail, MapPin, Maximize2, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Contact() {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const toggleMapSize = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Contato</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
            Informações de Contato
          </h2>

          {/* Phone */}
          <div className="mb-4 flex items-center">
            <Phone className="mr-3 text-blue-600" size={24} />
            <Link
              href="https://wa.me/5515997646421"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-blue-700 transition-colors"
            >
              +55 (15) 99764-6421
            </Link>
          </div>

          {/* Email */}
          <div className="mb-4 flex items-center">
            <Mail className="mr-3 text-blue-600" size={24} />
            <Link
              href="mailto:michelcamargo.psi@gmail.com"
              className="text-lg hover:text-blue-700 transition-colors"
            >
              michelcamargo.psi@gmail.com
            </Link>
          </div>
        </div>

        {/* Location and Hours */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
            Atendimento
          </h2>

          {/* Address */}
          <div className="mb-4 flex items-start">
            <MapPin className="mr-3 mt-1 text-blue-600" size={24} />
            <div>
              <p className="text-lg">Rua Antônio Ferreira, 171</p>
              <p className="text-lg">Parque Campolim, Sorocaba SP</p>
              <p className="text-lg">18047-636, Brasil</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start">
            <Clock className="mr-3 mt-1 text-blue-600" size={24} />
            <div>
              <p className="text-lg">Segunda à Sexta</p>
              <p className="text-lg">Das 8:00 as 21:00</p>
              <p className="text-sm text-gray-600 mt-2 italic">
                Obs: As consultas necessitam ser previamente agendadas.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Google Maps Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">Localização no Mapa</h3>
        <div
          className={`relative overflow-hidden transition-all duration-300 ${
            isMapExpanded ? "h-[500px]" : "h-64"
          }`}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.5088240408087!2d-47.47244788549275!3d-23.493335284719095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5d9d6e9e5d7a7%3A0x9fdc74c22ed20a13!2sRua%20Ant%C3%B4nio%20Ferreira%2C%20171%20-%20Parque%20Campolim%2C%20Sorocaba%20-%20SP%2C%2018047-636%2C%20Brasil!5e0!3m2!1sen!2sus!4v1696692299380!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa da Clínica"
          ></iframe>
        </div>
        <button
          onClick={toggleMapSize}
          className="mt-4 text-blue-600 hover:text-blue-800 transition-colors flex items-center"
        >
          <Maximize2 size={20} className="mr-2" />
          {isMapExpanded ? "Reduzir mapa" : "Expandir mapa"}
        </button>
      </div>
    </div>
  );
}

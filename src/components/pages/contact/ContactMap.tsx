// components/pages/contact/ContactMap.tsx
"use client";

import { CLINIC_INFO } from "@/utils/constants";
import { Maximize2 } from "lucide-react";
import { useState } from "react";

export const ContactMap = () => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.5088240408087!2d${
    CLINIC_INFO.ADDRESS.COORDINATES.LNG
  }!3d${
    CLINIC_INFO.ADDRESS.COORDINATES.LAT
  }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5d9d6e9e5d7a7%3A0x9fdc74c22ed20a13!2s${encodeURIComponent(
    formatFullAddress()
  )}!5e0!3m2!1sen!2sus!4v1696692299380!5m2!1sen!2sus`;

  return (
    <>
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          isMapExpanded ? "h-[500px]" : "h-64"
        }`}
      >
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa da Clínica"
          className="rounded-lg"
        />
      </div>
      <button
        onClick={() => setIsMapExpanded(!isMapExpanded)}
        className="mt-4 flex items-center hover:text-foreground/80 transition-colors group"
      >
        <Maximize2
          size={20}
          className="mr-2 group-hover:scale-110 transition-transform duration-300"
        />
        {isMapExpanded ? "Reduzir mapa" : "Expandir mapa"}
      </button>
    </>
  );
};

function formatFullAddress(): string {
  const { STREET, NEIGHBORHOOD, CITY, STATE, ZIP } = CLINIC_INFO.ADDRESS;
  return `${STREET} - ${NEIGHBORHOOD}, ${CITY} - ${STATE}, ${ZIP}`;
}

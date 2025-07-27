// components/pages/contact/ContactHours.tsx
import { CLINIC_INFO } from "@/utils/constants";
import { Clock, MapPin } from "lucide-react";

export const ContactHours = () => {
  return (
    <div className="space-y-6">
      <div className="address-item group">
        <MapPin
          className="address-icon group-hover:scale-110 transition-transform duration-300"
          size={24}
          strokeWidth={3}
        />
        <div className="text-foreground hover:-translate-x-1 transition-transform duration-300">
          <p className="text-lg">{CLINIC_INFO.ADDRESS.STREET}</p>
          <p className="text-lg">
            {CLINIC_INFO.ADDRESS.NEIGHBORHOOD}, {CLINIC_INFO.ADDRESS.CITY}{" "}
            {CLINIC_INFO.ADDRESS.STATE}
          </p>
          <p className="text-lg">
            {CLINIC_INFO.ADDRESS.ZIP}, {CLINIC_INFO.ADDRESS.COUNTRY}
          </p>
        </div>
      </div>

      {/* Hours */}
      <div className="address-item">
        <Clock className="address-icon" size={24} strokeWidth={3} />
        <div className="text-foreground">
          <p className="text-lg">{CLINIC_INFO.HOURS.WEEKDAYS}</p>
          <p className="text-lg">
            Das {CLINIC_INFO.HOURS.START} as {CLINIC_INFO.HOURS.END}
          </p>
          <p className="text-sm text-muted-foreground mt-2 italic">
            Obs: {CLINIC_INFO.HOURS.NOTE}
          </p>
        </div>
      </div>
    </div>
  );
};

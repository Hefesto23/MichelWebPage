"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Appointment() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDate) {
      alert(`Consulta agendada para ${selectedDate.toLocaleString()}`);
    } else {
      alert("Por favor, selecione uma data.");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Agende sua Consulta</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md inline-block"
      >
        <div className="mb-6">
          <label className="block text-left mb-2">
            Escolha uma data e horário:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="w-full p-2 rounded dark:bg-gray-700 dark:text-white"
          />
        </div>
        <Button type="submit">Confirmar Agendamento</Button>
      </form>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
/* 
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Usando um componente Textarea do shadcn/ui
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(
      `Mensagem enviada por ${formData.name} (${formData.email}): ${formData.message}`
    );
    // Aqui você pode adicionar uma lógica de envio real, como uma requisição API.
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Entre em Contato</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-md mx-auto"
      >
        <div className="mb-4">
          <label className="block text-left mb-2">Nome:</label>
          <Input
            type="text"
            name="name"
            placeholder="Seu nome"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-left mb-2">Email:</label>
          <Input
            type="email"
            name="email"
            placeholder="Seu email"
            value={formData.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-left mb-2">Mensagem:</label>
          <Textarea
            name="message"
            placeholder="Sua mensagem"
            value={formData.message}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Enviar Mensagem
        </Button>
      </form>
    </div>
  );
} */

export default function Contact() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Entre em Contato</h1>

      <Button type="submit" className="w-full">
        Enviar Mensagem
      </Button>
    </div>
  );
}

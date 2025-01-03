import "@/styles/components/footer.css";
import Image from "next/image";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Second Column - Psychologist Info */}
        <div className="footer-column">
          <h3 className="footer-title">Michel de Camargo</h3>
          <p className="footer-subtitle">CRP 06/174807</p>
          <div className="footer-contact">
            <IoLogoWhatsapp className="footer-icon" size={24} />
            <Link
              href="https://wa.me/5515997646421"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-link"
            >
              +55 (15) 99764-6421
            </Link>
          </div>
        </div>

        {/* Central Column - Logo */}
        <div className="footer-logo">
          <Image
            src="/logo.png"
            alt="Consultório de Psicologia Logo"
            width={200}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Fourth Column - Contact and Hours */}
        <div className="footer-column">
          <div>
            <h3 className="footer-title">Horário de Atendimento</h3>
            <p className="footer-subtitle">Segunda à Sexta das 8:00 as 21:00</p>
            <p className="footer-subtitle">
              Obs: As consultas necessitam ser previamente agendadas.
            </p>
            <p className="footer-note">
              * Atendimentos a partir de 20 anos de idade
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        &copy; 2024 Consultório de Psicologia. Todos os direitos reservados.
      </div>
    </footer>
  );
};

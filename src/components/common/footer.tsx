import Image from "next/image";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";
import styles from "./footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className="content-container">
        <div className={styles.innerContainer}>
          <div className={styles.footerGrid}>
            {/* First Column - Psychologist Info */}
            <div className={styles.column}>
              <h3 className={styles.title}>Michel de Camargo</h3>
              <p className={styles.subtitle}>CRP 06/174807</p>
              <div className={styles.contact}>
                <IoLogoWhatsapp className={styles.icon} size={24} />
                <Link
                  href="https://wa.me/5515997646421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  +55 (15) 99764-6421
                </Link>
              </div>
            </div>

            {/* Middle Column - Logo */}
            <div className={`${styles.columnCenter} stretch`}>
              <Image
                src="/logo.svg"
                alt="Consultório de Psicologia Logo"
                width={265}
                height={75}
                className="object-contain"
              />
            </div>

            {/* Third Column - Contact and Hours */}
            <div className={styles.columnRight}>
              <h3 className={styles.title}>Horário de Atendimento</h3>
              <p className={styles.subtitle}>
                Segunda à Sexta das 8:00 as 21:00
              </p>
              <p className={styles.subtitle}>
                Obs: As consultas necessitam ser previamente agendadas.
              </p>
              <p className={styles.note}>
                * Atendimentos a partir de 20 anos de idade
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className={styles.copyright}>
            &copy; 2024 Consultório de Psicologia. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

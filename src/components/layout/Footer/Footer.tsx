// ==========================================
// src/components/layout/Footer/Footer.tsx
// ==========================================
import { Container } from "@/components/base/Container";
import { Typography } from "@/components/base/Typography";
import { CONTACT_INFO } from "@/utils/constants";
import { formatPhone } from "@/utils/formatters";
import Image from "next/image";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.innerContainer}>
          <div className={styles.footerGrid}>
            {/* First Column - Psychologist Info */}
            <div className={styles.column}>
              <Typography variant="h3" className={styles.title}>
                Michel de Camargo
              </Typography>
              <Typography variant="subtitle" className={styles.subtitle}>
                CRP 06/174807
              </Typography>
              <div className={styles.contact}>
                <IoLogoWhatsapp className={styles.icon} size={24} />
                <Link
                  href={`https://wa.me/${CONTACT_INFO.PHONE_CLEAN}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  {formatPhone(CONTACT_INFO.PHONE_CLEAN)}
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
              <Typography variant="h3" className={styles.title}>
                Horário de Atendimento
              </Typography>
              <Typography variant="subtitle" className={styles.subtitle}>
                {CONTACT_INFO.WORKING_HOURS.WEEKDAYS}{" "}
                {CONTACT_INFO.WORKING_HOURS.TIME}
              </Typography>
              <Typography variant="subtitle" className={styles.subtitle}>
                {CONTACT_INFO.WORKING_HOURS.NOTE}
              </Typography>
              <Typography variant="caption" className={styles.note}>
                {CONTACT_INFO.WORKING_HOURS.AGE_NOTE}
              </Typography>
            </div>
          </div>

          {/* Copyright */}
          <div className={styles.copyright}>
            &copy; {currentYear} Consultório de Psicologia. Todos os direitos
            reservados.
          </div>
        </div>
      </Container>
    </footer>
  );
};

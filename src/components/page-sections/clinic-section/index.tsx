import {
  ImageGalleryComponent,
  clinicImages,
} from "@/components/ui/image-grid";
import styles from "./clinic.module.css";

export default function ClinicSection() {
  return (
    <section
      id="espaco-clinico"
      className={`${styles.clinicSection} relative z-0 overflow-hidden`}
    >
      <div className="content-container">
        <div className={`${styles.clinicContainer}`}>
          <div className={styles.clinicHeader}>
            <h2>Nosso Espaço</h2>
            <p>
              Explore o ambiente projetado para proporcionar conforto,
              privacidade e bem-estar emocional.
            </p>
          </div>
          <div className={`${styles.clinicGrid} mx-auto`}>
            <ImageGalleryComponent images={clinicImages} />
          </div>
        </div>
      </div>
    </section>
  );
}

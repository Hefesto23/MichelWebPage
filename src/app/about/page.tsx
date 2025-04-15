import Divisor from "@/components/ui/divisor";
import styles from "@/styles/pages/about.module.css";
import Image from "next/image";

export default function About() {
  return (
    <div>
      <section className={styles.aboutSection}>
        <div className="content-container">
          <div className={styles.contentContainer}>
            <div className={styles.imageContainer}>
              <Image
                src="/assets/michel2.png"
                alt="Michel - Psicólogo Clínico"
                width={400}
                height={400}
                className={styles.profileImage}
              />
            </div>

            <div className={styles.textContainer}>
              <h2 className={styles.title}>Sobre mim</h2>
              <h3 className={styles.subtitle}>Psicólogo Clínico</h3>

              <div className={styles.textContent}>
                <p className={styles.paragraph}>
                  Olá! Sou o Michel, psicólogo especializado em transtornos
                  emocionais, como ansiedade e depressão, e como especialista em
                  análise do comportamento, realizo avaliação cognitiva através
                  do teste de inteligência WAIS III.
                </p>

                <p className={styles.paragraph}>
                  Meu objetivo é auxiliar pessoas que estão enfrentando
                  dificuldades psicológicas, proporcionando alívio dos sintomas
                  e uma melhora significativa na qualidade de vida.
                </p>

                <p className={styles.paragraph}>
                  Minha abordagem se baseia na Análise do Comportamento, uma
                  visão teórica da Psicologia Comportamental. Através dela,
                  busco compreender individualmente cada pessoa, considerando
                  tanto o ambiente quanto os comportamentos envolvidos. Acredito
                  que essa compreensão é fundamental para alcançarmos resultados
                  efetivos.
                </p>

                <p className={styles.paragraph}>
                  Estou aqui para te ajudar nessa jornada. Se você está
                  enfrentando desafios emocionais e comportamentais devido à
                  ansiedade e/ou depressão, será um prazer oferecer meu apoio e
                  orientação.
                </p>

                <p className={styles.paragraph}>
                  Entre em contato comigo para agendar uma consulta ou para
                  obter mais informações sobre avaliação cognitiva. Juntos,
                  podemos trilhar um caminho de transformação e bem-estar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Divisor index={3} />
    </div>
  );
}

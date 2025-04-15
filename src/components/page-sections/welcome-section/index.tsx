import Image from "next/image";
import styles from "./welcome.module.css";

export default function WelcomeSection() {
  return (
    <section id="saiba-mais" className={styles.welcomeSection}>
      <div className="content-container">
        <div className={styles.welcomeContainer}>
          <div className={styles.welcomeText}>
            <div className={styles.welcomeHeader}>
              <h1>Seja Bem-Vindo!</h1>
            </div>
            <div className={styles.welcomeContent}>
              <article>
                <p>
                  Sentir-se sobrecarregado, ansioso ou constantemente em alerta
                  pode parecer um fardo solitário, mas saiba que você não está
                  sozinho. A ansiedade é uma reação natural do corpo, mas,
                  quando começa a afetar sua vida, é hora de buscar ajuda.
                </p>
                <p>
                  A ansiedade pode surgir de muitas formas: preocupações
                  excessivas no trabalho, dificuldades nos relacionamentos,
                  tensões familiares ou até mesmo cobranças que você impõe a si
                  mesmo. Talvez você se reconheça em momentos como:
                </p>

                <ul className="list-disc">
                  <li>
                    Procrastinar por medo de errar ou não ser bom o suficiente.
                  </li>
                  <li>
                    Evitar discussões ou situações sociais por receio de
                    julgamento.
                  </li>
                  <li>
                    Ter dificuldade para dormir devido a pensamentos
                    incessantes.
                  </li>
                  <li>
                    Sentir que o coração acelera ou que o ar parece faltar,
                    mesmo sem motivo aparente.
                  </li>
                </ul>

                <p>
                  Aqui, a psicoterapia é um espaço para você entender e
                  transformar essas sensações. A abordagem que utilizo é a{" "}
                  <strong>Análise do Comportamental</strong> (TCC), uma ciência
                  que busca compreender o impacto das situações e das
                  experiências na sua maneira de agir, pensar e sentir. Juntos,
                  investigaremos como os padrões de comportamento relacionados à
                  ansiedade se formaram e como você pode transformá-los de forma
                  prática e eficaz.
                </p>

                <p>No tratamento, você irá:</p>

                <ul className="list-decimal">
                  <li>
                    Compreender os contextos que desencadeiam sua ansiedade.
                  </li>
                  <li>
                    Aprender formas de lidar com as situações que mais afetam
                    seu bem-estar.
                  </li>
                  <li>
                    Desenvolver habilidades para construir relações mais
                    saudáveis e funcionais.
                  </li>
                  <li>Recuperar a autonomia e a segurança em suas escolhas.</li>
                </ul>

                <p>
                  Você não precisa enfrentar tudo sozinho. Estou aqui para
                  oferecer suporte e ajudá-lo a encontrar novos caminhos.
                </p>

                <p className="font-bold">
                  Dê o primeiro passo e agende uma consulta.
                </p>

                <p className="mb-6">
                  Cuidar da sua saúde emocional é um presente que transforma a
                  maneira como você vive e se relaciona com o mundo.
                </p>
              </article>
            </div>
          </div>

          <div className={styles.welcomeImage}>
            <Image
              src="/assets/michel1.svg"
              alt="Foto de Michel Psicologo Clinico"
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

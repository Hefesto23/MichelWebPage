import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Conteúdo principal com espaço para header e footer */}
      <main className="flex-1 w-full bg-background flex items-center justify-center py-16">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Coluna de texto */}
            <div className="text-center md:text-left max-w-xl">
              {/* Número 404 grande */}
              <div className="text-9xl md:text-[12rem] font-bold mb-2 leading-none">
                <span className="text-foreground opacity-90">404</span>
              </div>

              {/* Título principal */}
              <h1 className="text-2xl md:text-4xl font-bold mb-4 text-foreground">
                Ops! Página não encontrada
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Parece que você tomou um desvio inesperado em sua jornada. Que tal retornarmos ao
                caminho principal?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/"
                  className="py-3 px-6 rounded-lg font-medium bg-primary-foreground text-btnFg dark:bg-btn dark:text-btn-fg dark:border-btn-border flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Voltar ao Início
                </Link>
                <Link
                  href="/contato"
                  className="py-3 px-6 rounded-lg font-medium transition-all duration-200 bg-background text-card-foreground border-2 border-card hover:border-foreground hover:text-card-foreground dark:bg-secondary dark:text-secondary-foreground dark:hover:border-white dark:hover:text-secondary-foreground dark:hover:shadow-md flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Fale Conosco
                </Link>
              </div>
            </div>

            {/* Ilustração temática */}
            <div className="relative w-full md:w-1/2 h-[400px] md:h-[500px] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center p-8">
                {/* Imagem 404 com alternância claro/escuro */}
                <Image
                  src="/erro-404.png"
                  alt="Página não encontrada - 404"
                  width={400}
                  height={400}
                  className="block dark:hidden w-full h-auto max-w-md object-contain"
                  priority
                />
                <Image
                  src="/erro-404-dark.png"
                  alt="Página não encontrada - 404"
                  width={400}
                  height={400}
                  className="hidden dark:block w-full h-auto max-w-md object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

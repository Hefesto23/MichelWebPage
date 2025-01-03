import { Button } from "@/components/ui/button";
import Link from "next/link";
// import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-background">
      <div className="container mx-auto h-screen">
        <div className="flex flex-col md:flex-row items-center justify-center h-full gap-8 px-4">
          {/* Coluna de texto */}
          <div className="text-center md:text-left md:flex-1 max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
              Oops! Página não encontrada
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Parece que você se perdeu no caminho. Não se preocupe, às vezes
              isso acontece na jornada do autoconhecimento. Que tal voltarmos
              para um lugar familiar?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-[#ffbf9e] hover:bg-[#ffbf9e]/90"
              >
                <Link href="/">Voltar para Home</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contato">Entrar em Contato</Link>
              </Button>
            </div>
          </div>

          {/* Imagem ilustrativa */}
          <div className="relative w-full md:w-1/2 h-64 md:h-[600px] flex items-center justify-center">
            <iframe
              src="https://giphy.com/embed/14uQ3cOFteDaU"
              width="100%"
              height="100%"
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}

// Você também pode usar estas alternativas de imagens comentando a atual e descomentando uma destas:

/*
// Opção 1: Robô 404 animado
<iframe 
  src="https://giphy.com/embed/8L0Pky6C83SzkzU55a" 
  width="100%" 
  height="100%" 
  frameBorder="0" 
  className="giphy-embed" 
  allowFullScreen
></iframe>

// Opção 2: Personagem pensativo
<iframe 
  src="https://giphy.com/embed/xTiN0L7EW5trfOvEk0" 
  width="100%" 
  height="100%" 
  frameBorder="0" 
  className="giphy-embed" 
  allowFullScreen
></iframe>

// Opção 3: Efeito glitch 404
<iframe 
  src="https://giphy.com/embed/14uQ3cOFteDaU" 
  width="100%" 
  height="100%" 
  frameBorder="0" 
  className="giphy-embed" 
  allowFullScreen
></iframe>
*/

import Footer from "@/components/navigation/footer";
import Navbar from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "Generated by create next app",
};

const NotFound = () => {
  return (
    <main className="relative flex flex-col items-center justify-center px-4">
      <Navbar />
      <div className="flex flex-col items-center justify-center mx-auto h-screen">
        <div className="flex items-center justify-center h-full flex-col">
          <span className="text-sm font-medium px-3.5 py-1 rounded-md bg-gradient-to-br from-gray-400 to-gray-600 text-neutral-50 not-found">
            404
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-5">Not Found</h1>
          <p className="text-base text-neutral-400 font-medium mt-5 text-center mx-auto max-w-xl">
            A página que você procura não existe. <br /> Mas não se preocupe,
            nós ajudamos você. Você pode{" "}
            <Link href="/pages/ajuda" className="text-foreground">
              Entrar em contato conosco
            </Link>
            .
          </p>
          <Link href="/">
            <Button className="mt-8">Voltar à página inicial</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default NotFound;
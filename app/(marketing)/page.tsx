"use client";

import AnimationContainer from "@/components/global/animation-container";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import { PROCESS } from "@/utils";
import { ArrowRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { theme } = useTheme();

  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (theme === "dark") {
      setImageSrc("/assets/dashboard-dark.png");
    } else {
      setImageSrc("/assets/dashboard-light.png");
    }
  }, [theme]);

  return (
    <div className="overflow-x-hidden scrollbar-hide size-full">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background">
          <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
            <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
              <span>
                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
              </span>
              <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
              <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/20"></span>
              <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1">
                ✨ Gerencie suas tarefas e rotinas da melhor forma
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </span>
            </button>
            <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
              Organização pessoal de forma{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text inline-block">
                simples e fácil
              </span>
            </h1>
            <p className="mb-8 tracking-tight text-muted-foreground text-base text-balance">
              Gerencie suas tarefas, projetos de forma simplificada e prática
              para ajudar e
              <br className="hidden md:block" />
              <span className="hidden md:block">
                auxiliar em suas organizações rotineiras.
              </span>
            </p>
            <div className="flex items-center justify-center whitespace-nowrap gap-4 z-50">
              <Button asChild>
                <Link href="#precos" className="flex items-center">
                  Comece agora mesmo
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </AnimationContainer>

          <AnimationContainer
            delay={0.2}
            className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full"
          >
            <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
            <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
              {imageSrc && (
                <Image
                  src={imageSrc}
                  alt="Dashboard"
                  width={1200}
                  height={1200}
                  quality={100}
                  className="rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
                />
              )}
              <BorderBeam size={250} duration={12} delay={9} />
              <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
              <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
            </div>
          </AnimationContainer>
        </div>
      </MaxWidthWrapper>

      {/* Processos */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title="O Processo" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              Gerenciamento fácil em 3 funcionalidades
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
            Simplifique sua rotina com um processo intuitivo e eficiente. Em poucos passos, organize suas atividades e aumente sua produtividade.
            </p>
          </div>
        </AnimationContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4 md:gap-8">
          {PROCESS.map((process, id) => (
            <AnimationContainer delay={0.2 * id} key={id}>
              <MagicCard className="group md:py-8">
                <div className="flex flex-col items-start justify-center w-full">
                  <process.icon
                    strokeWidth={1.5}
                    className="w-10 h-10 text-foreground"
                  />
                  <div className="flex flex-col relative items-start">
                    <span className="absolute -top-6 right-0 border-2 border-border text-foreground font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center pt-0.5">
                      {id + 1}
                    </span>
                    <h3 className="text-base mt-6 font-medium text-foreground">
                      {process.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {process.description}
                    </p>
                  </div>
                </div>
              </MagicCard>
            </AnimationContainer>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default HomePage;

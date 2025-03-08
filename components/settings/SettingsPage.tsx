"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SettingsSkeleton } from "../skeletons/SettingsSkeleton";
import ThemeCard from "./ThemeCard";

export default function SettingsPage() {
  const { theme } = useTheme();
  const [activeTheme, setActiveTheme] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTheme(theme || "system");
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [theme]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (isLoading || !activeTheme) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Configurações
              </h1>
              <p className="text-muted-foreground mt-2">
                Personalize suas preferências de aplicativo
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Tabs defaultValue="appearance" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
                <TabsTrigger value="account" disabled>
                  Conta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Tema</CardTitle>
                    <CardDescription>
                      Personalize a aparência do aplicativo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ThemeCard />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import type React from "react";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { userSingUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema, type SignUpSchemaType } from "@/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { signInWithGithub, signInWithGoogle } from "@/actions/social-auth";
import { Loader2 } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & HTMLMotionProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpSchemaType) => {
    const res = await userSingUp(values);
    if (res && "error" in res) {
      toast.error(res.error);
    }
  };

  const handleGithubSignIn = () => {
    startTransition(() => {
      signInWithGithub();
    });
  };

  const handleGoogleSignIn = () => {
    startTransition(() => {
      signInWithGoogle();
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="border-none shadow-lg backdrop-blur-sm bg-background/80">
        <CardHeader className="text-center pb-4">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <CardTitle className="text-xl font-light tracking-tight">
                  Crie sua conta
                </CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="text-sm text-muted-foreground">
                  Preencha os dados abaixo para se cadastrar
                </CardDescription>
              </motion.div>
            </>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-full rounded-full" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="space-y-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => {
                  startTransition(() => {
                    onSubmit(values);
                  });
                })}
                className="space-y-4"
              >
                <div className="grid gap-6">
                  <motion.div
                    className="flex flex-col gap-4"
                    variants={itemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                        onClick={handleGithubSignIn}
                        type="button"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            fill="currentColor"
                          />
                        </svg>
                        Faça login com o Github
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                        onClick={handleGoogleSignIn}
                        type="button"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        Faça login com o Google
                      </Button>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
                    variants={itemVariants}
                  >
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Ou preencha o formulário
                    </span>
                  </motion.div>
                  <motion.div className="grid gap-5" variants={itemVariants}>
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-normal text-muted-foreground">
                              Nome
                            </FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.01 }}>
                                <Input
                                  {...field}
                                  disabled={isPending}
                                  placeholder="Seu nome completo"
                                  className="rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-normal text-muted-foreground">
                              Email
                            </FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.01 }}>
                                <Input
                                  {...field}
                                  type="email"
                                  disabled={isPending}
                                  placeholder="seu@email.com"
                                  className="rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-normal text-muted-foreground">
                              Senha
                            </FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.01 }}>
                                <Input
                                  {...field}
                                  type="password"
                                  disabled={isPending}
                                  placeholder="Mínimo 8 caracteres"
                                  className="rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                    >
                      <Button
                        disabled={isPending}
                        className="w-full rounded-full shadow-md"
                      >
                        {isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          "Criar Conta"
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="text-center text-xs text-muted-foreground"
                    variants={itemVariants}
                  >
                    Já possui uma conta?{" "}
                    <motion.span whileHover={{ scale: 1.05 }}>
                      <Link
                        href="/auth/sign-in"
                        className="text-primary hover:underline underline-offset-4 transition-all"
                      >
                        Faça Login
                      </Link>
                    </motion.span>
                  </motion.div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      <motion.div
        className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
        variants={itemVariants}
      >
        Ao clicar em registrar, você concorda com nossos{" "}
        <motion.a href="#" whileHover={{ scale: 1.05 }}>
          Termos de serviço
        </motion.a>{" "}
        e{" "}
        <motion.a href="#" whileHover={{ scale: 1.05 }}>
          Política de Privacidade
        </motion.a>
        .
      </motion.div>
    </motion.div>
  );
}

/*
"use client";

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
import { SignUpSchema, SignUpSchemaType } from "@/schemas";
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

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Seja bem vindo</CardTitle>
          <CardDescription>
            Faça seu cadastro com sua conta do Github ou Google
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGithubSignIn}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="currentColor"
                      />
                    </svg>
                    Faça login com o Github
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Faça login com o Google
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
                <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              disabled={isPending}
                              placeholder="name@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              disabled={isPending}
                              placeholder="******"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <Button disabled={isPending} className="w-full">
                    {isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Já possui uma conta?{" "}
                  <a
                    href="/auth/sign-in"
                    className="underline underline-offset-4"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Ao clicar em registrar, você concorda com nossos{" "}
        <a href="#">Termos de serviço</a> e{" "}
        <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  );
}
  */

"use client";

import type React from "react";
import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGithub, signInWithGoogle } from "@/actions/social-auth";
import { RegisterSkeleton } from "./register-skeleton";
import { Loader2 } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <RegisterSkeleton />;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const buttonHover = {
    scale: 1.02,
    transition: { duration: 0.2 },
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

  return (
    <motion.div
      className={cn("flex flex-col gap-6", className)}
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item}>
        <Card className="border-none shadow-lg backdrop-blur-sm bg-background/80">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-light tracking-tight">
              Crie sua conta
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Preencha os dados abaixo para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-6">
                <motion.div className="flex flex-col gap-4" variants={item}>
                  <motion.div whileHover={buttonHover}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                      onClick={handleGithubSignIn}
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
                      Cadastrar com Github
                    </Button>
                  </motion.div>
                  <motion.div whileHover={buttonHover}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                      onClick={handleGoogleSignIn}
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
                      Cadastrar com Google
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  variants={item}
                  className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
                >
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Ou preencha o formulário
                  </span>
                </motion.div>
                <motion.div className="grid gap-5" variants={item}>
                  <motion.div className="grid gap-2" variants={item}>
                    <Label
                      htmlFor="name"
                      className="text-xs font-normal text-muted-foreground"
                    >
                      Nome
                    </Label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        required
                        className="rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div className="grid gap-2" variants={item}>
                    <Label
                      htmlFor="email"
                      className="text-xs font-normal text-muted-foreground"
                    >
                      Email
                    </Label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className="rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div className="grid gap-2" variants={item}>
                    <Label
                      htmlFor="password"
                      className="text-xs font-normal text-muted-foreground"
                    >
                      Senha
                    </Label>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        required
                        className="rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur-sm"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    variants={item}
                    whileHover={buttonHover}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      disabled={isPending}
                      className="w-full rounded-full shadow-md"
                    >
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Criar conta"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="text-center text-xs text-muted-foreground"
                  variants={item}
                >
                  Já tem uma conta?{" "}
                  <a
                    href="/auth/sign-in"
                    className="text-primary hover:underline underline-offset-4 transition-all"
                  >
                    Faça login
                  </a>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        variants={item}
        className="text-balance text-center text-xs text-muted-foreground [&_a]:text-primary [&_a]:hover:underline [&_a]:underline-offset-4"
      >
        Ao se cadastrar, você concorda com nossos{" "}
        <a href="#">Termos de Serviço</a> e{" "}
        <a href="#">Política de Privacidade</a>.
      </motion.div>
    </motion.div>
  );
}

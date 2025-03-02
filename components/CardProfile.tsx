"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CardProfile() {
  const { data: session } = useSession()
  const [, setIsHovering] = useState(false)

  if (!session?.user) return null

  const user = session.user
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U"

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="overflow-hidden border-0 bg-gradient-to-b from-background/80 to-background/60 backdrop-blur-xl shadow-xl">
          {/* Header gradient */}
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />

          <CardContent className="p-0">
            <div className="flex flex-col items-center px-8 -mt-12 pb-8">
              {/* Avatar Section with Animation */}
              <motion.div className="relative mb-6" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <div
                  className="relative group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Avatar className="h-28 w-28 rounded-full border-4 border-background shadow-xl">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? "User"}
                        className="rounded-full object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="text-center space-y-1.5 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-foreground">{user.name ?? "Usuário"}</h2>
                <Badge variant="secondary" className="font-normal text-xs px-2 py-0.5">
                  Usuário
                </Badge>
              </motion.div>

              <Separator className="w-full mb-6 opacity-50" />

              <motion.div
                className="w-full space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</span>
                  <span className="text-sm text-foreground font-medium">{user.email ?? "Sem e-mail"}</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span className="text-sm text-foreground font-medium">Online</span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute top-6 right-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute bottom-6 left-6 h-16 w-16 rounded-full bg-primary/10 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 1,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}


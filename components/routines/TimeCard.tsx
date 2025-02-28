"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock } from "lucide-react"

export function TimeCard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatSeconds = (date: Date) => {
    return date.getSeconds().toString().padStart(2, "0")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="h-[500px] relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
        <div className="absolute inset-0 bg-grid-white/10" />
        <CardContent className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="space-y-12">
            <div className="flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary animate-pulse" />
            </div>

            <div className="space-y-8">
              <motion.div
                key={time.getMinutes()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <h2 className="text-5xl font-bold tracking-tight text-primary">{formatTime(time)}</h2>
                <motion.span
                  key={time.getSeconds()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -right-8 top-1 text-lg text-primary/60"
                >
                  {formatSeconds(time)}
                </motion.span>
              </motion.div>

              <Separator className="w-24 mx-auto bg-primary/20" />

              <div className="grid gap-2">
                <motion.p className="text-3xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {time.toLocaleDateString("pt-BR", { weekday: "long" })}
                </motion.p>
                <p className="text-xl text-muted-foreground">
                  {time.toLocaleDateString("pt-BR", { month: "long", day: "numeric" })}
                </p>
                <p className="text-sm text-muted-foreground/60">{time.getFullYear()}</p>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
        </CardContent>
      </Card>
    </motion.div>
  )
}


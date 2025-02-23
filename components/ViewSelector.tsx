"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, Table2, Calendar } from "lucide-react"
import { motion } from "framer-motion"

type ViewSelectorProps = {
  currentView: "column" | "table" | "calendar"
  onViewChange: (view: "column" | "table" | "calendar") => void
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  const views = [
    { id: "column", icon: LayoutGrid, label: "Colunas" },
    { id: "table", icon: Table2, label: "Tabela" },
    { id: "calendar", icon: Calendar, label: "Calendário" },
  ] as const

  return (
    <div className="flex items-center bg-muted/40 rounded-lg p-1">
      {views.map(({ id, icon: Icon, label }) => {
        const isActive = currentView === id
        return (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onViewChange(id)}
            className={`relative ${
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="viewSelector"
                className="absolute inset-0 bg-primary rounded-md -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className="h-4 w-4 mr-2" />
            <span>{label}</span>
          </Button>
        )
      })}
    </div>
  )
}
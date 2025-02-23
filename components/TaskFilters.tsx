"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export type TaskFilters = {
  search: string
  status: string[]
  priority: string[]
}

type TaskFiltersProps = {
  onFilterChange: (filters: TaskFilters) => void
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    status: [],
    priority: [],
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleFilterChange = (key: keyof TaskFilters, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleFilter = (key: "status" | "priority", value: string) => {
    const currentFilters = filters[key]
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter((item) => item !== value)
      : [...currentFilters, value]
    handleFilterChange(key, newFilters)
  }

  const clearFilters = () => {
    setFilters({ search: "", status: [], priority: [] })
    setIsOpen(false)
  }

  const getActiveFiltersCount = () => {
    return filters.status.length + filters.priority.length + (filters.search ? 1 : 0)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
      <div className="relative flex-grow w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Pesquisar por tarefas..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-9 pr-4 w-full"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => handleFilterChange("search", "")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
            <AnimatePresence>
              {getActiveFiltersCount() > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFiltersCount()}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["Pendente", "Em Progresso", "Feita"].map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filters.status.includes(status)}
              onCheckedChange={() => toggleFilter("status", status)}
            >
              {status}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Prioridade</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["Baixa", "Média", "Alta"].map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority}
              checked={filters.priority.includes(priority)}
              onCheckedChange={() => toggleFilter("priority", priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full justify-start"
            disabled={getActiveFiltersCount() === 0}
          >
            Limpar filtros
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
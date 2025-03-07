import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Obter o número da semana ISO de uma data
 * @param date A data para obter o número da semana para
 * @returns
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/**
 * Formatar a data para uma sequência legível
 * @param date A data a ser formatada
 * @param format O formato a ser usado (curto, médio, longo)
 * @returns A sequência de data formatada
 */
export function formatDate(date: Date, format: "short" | "medium" | "long" = "medium"): string {
  if (format === "short") {
    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
  } else if (format === "medium") {
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "numeric" })
  } else {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

/**
 * Obter o nome do dia de um índice de dia
 * @param dayIndex O índice do dia (0-6, onde 0 é domingo)
 * @returns O nome do dia
 */
export function getDayName(dayIndex: number, format: "short" | "long" = "long"): string {
  const days =
    format === "short"
      ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
      : ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]
  return days[dayIndex % 7]
}

/**
 * Obtenha as datas de início e término de uma semana
 * @param date Um encontro na semana
 * @returns Um objeto com as datas de início e término da semana
 */
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const day = date.getDay()
  const diff = date.getDate() - day
  const start = new Date(date)
  start.setDate(diff)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

/**
 * Obtendo uma série de datas para uma semana
 * @param date Um encontro na semana
 * @returns Uma matriz de 7 datas representando a semana
 */
export function getWeekDates(date: Date): Date[] {
  const { start } = getWeekRange(date)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start)
    day.setDate(day.getDate() + i)
    return day
  })
}
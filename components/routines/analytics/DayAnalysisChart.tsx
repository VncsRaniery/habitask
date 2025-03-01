"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { DayStats } from "@/types"

const DAYS = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]

interface DayAnalysisChartProps {
  data: DayStats[]
}

export function DayAnalysisChart({ data }: DayAnalysisChartProps) {
  return (
    <Card className="backdrop-blur-sm bg-card/50">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Análise do dia</CardTitle>
        <CardDescription className="text-base">
        Compare as taxas de conclusão de rotina em diferentes dias da semana
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="dayOfWeek" tickFormatter={(day) => DAYS[day].slice(0, 3)} stroke="#888888" />
              <YAxis tickFormatter={(value) => `${value}%`} stroke="#888888" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DayStats
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Dia</span>
                            <span className="font-bold">{DAYS[data.dayOfWeek]}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Taxa de conclusão</span>
                              <span className="font-bold">{Math.round(data.rate)}%</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Conclusões</span>
                              <span className="font-bold">
                                {data.completions} de {data.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="rate" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


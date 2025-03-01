"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { format } from "date-fns"
import type { TimeDistribution } from "@/types"

interface TimeDistributionChartProps {
  data: TimeDistribution[]
}

export function TimeDistributionChart({ data }: TimeDistributionChartProps) {
  return (
    <Card className="backdrop-blur-sm bg-card/50">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Time Distribution</CardTitle>
        <CardDescription className="text-base">
          Discover your most productive hours and routine completion patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="hour"
                tickFormatter={(hour) => format(new Date().setHours(hour), "ha")}
                stroke="#888888"
                fontSize={12}
              />
              <YAxis tickFormatter={(value) => `${value}%`} stroke="#888888" fontSize={12} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as TimeDistribution
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                            <span className="font-bold">{format(new Date().setHours(data.hour), "h:00 a")}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Completion Rate</span>
                              <span className="font-bold">{Math.round(data.rate)}%</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Completions</span>
                              <span className="font-bold">
                                {data.completions} of {data.total}
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
              <Area
                type="monotone"
                dataKey="rate"
                stroke="hsl(var(--primary))"
                fill="url(#colorRate)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


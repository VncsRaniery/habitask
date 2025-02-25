import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "lucide-react"

interface EmptyChartStateProps {
  message?: string
}

export function EmptyChartState({ message = "No data available" }: EmptyChartStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <BarChart className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}


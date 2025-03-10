import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <Skeleton className="h-10 w-[150px]" />
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-[200px] rounded-lg" />

            {/* Theme Selection Cards Skeleton */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-[100px] mb-2" />
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Card Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-5 w-[120px] mb-4" /> {/* Legend */}
                  <div className="flex gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <Skeleton className="h-[70px] w-[88px] rounded-md mb-2" /> {/* Image */}
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
                          <Skeleton className="h-4 w-[40px]" /> {/* Label */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


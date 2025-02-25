import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function WelcomeSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero Section Skeleton */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-[300px] mx-auto" />
              <Skeleton className="h-6 w-[600px] mx-auto" />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-[140px]" />
            </div>
          </div>

          {/* Stats Overview Skeleton */}
          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader>
              <Skeleton className="h-6 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Features Grid Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-full transition-shadow">
                <CardHeader>
                  <Skeleton className="h-8 w-8 mb-2" />
                  <Skeleton className="h-6 w-[200px] mb-2" />
                  <Skeleton className="h-4 w-[300px]" />
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Upcoming Tasks Skeleton */}
          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader>
              <Skeleton className="h-6 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-[200px]" />
                          <Skeleton className="h-4 w-[300px]" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


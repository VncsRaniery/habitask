import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SessionsTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <Skeleton className="h-10 w-full sm:w-[300px]" />
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-2 bg-muted" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-[150px]" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[180px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


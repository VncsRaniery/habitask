import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ResourcesTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <Skeleton className="h-10 w-full md:w-[300px]" />
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[180px]" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


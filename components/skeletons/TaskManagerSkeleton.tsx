import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskCardSkeleton } from "../TaskCardSkeleton"

export function TaskManagerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <header className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 flex-1 sm:w-[120px]" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-full sm:w-[320px]" />
          <Skeleton className="h-10 w-full sm:w-[280px]" />
        </div>
      </header>

      {/* Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, columnIndex) => (
          <Card key={columnIndex} className="h-[calc(100vh-280px)] flex flex-col">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-8" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-2">
              <div className="space-y-3">
                {[...Array(3)].map((_, cardIndex) => (
                  <TaskCardSkeleton key={cardIndex} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


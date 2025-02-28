import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TimeCardSkeleton() {
  return (
    <Card className="h-[500px] relative overflow-hidden">
      <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-12">
          <Skeleton className="h-8 w-8 rounded-full mx-auto" />

          <div className="space-y-8">
            <div className="relative">
              <Skeleton className="h-12 w-48 mx-auto" />
              <Skeleton className="h-6 w-6 absolute -right-8 top-1" />
            </div>

            <Skeleton className="h-1 w-24 mx-auto" />

            <div className="space-y-4">
              <Skeleton className="h-8 w-40 mx-auto" />
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


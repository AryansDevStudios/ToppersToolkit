import { Skeleton } from "@/components/ui/skeleton";

export function AdminPageSkeleton() {
    return (
        <div className="w-full">
            <div className="grid w-full grid-cols-3 p-1 bg-muted rounded-md mb-4">
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
}

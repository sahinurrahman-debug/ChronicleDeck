import { Page } from "@/components/ui/container";
import { CardSkeleton, LoadingRegion, Skeleton } from "@/components/ui/skeleton";

// Shown while a page's code loads, so navigation never flashes blank.
export default function Loading() {
  return (
    <Page>
      <LoadingRegion label="Loading the page">
        <Skeleton className="mb-3 h-12 w-2/3 max-w-md" />
        <Skeleton className="mb-10 h-6 w-full max-w-xl" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </LoadingRegion>
    </Page>
  );
}

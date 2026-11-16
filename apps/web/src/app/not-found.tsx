import { Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <Page className="max-w-2xl">
      <EmptyState
        icon={Compass}
        title="We couldn't find that page"
        description="It may have moved, or the link may be mistyped. Let's get you back to your story."
        action={
          <>
            <Button asChild>
              <Link href="/write">Go to Write</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </>
        }
      />
    </Page>
  );
}

"use client";

import { Check, PartyPopper, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Page } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, PreviewNote } from "@/components/ui/page-header";
import { CardSkeleton, LoadingRegion } from "@/components/ui/skeleton";
import { KIND_NAME, PROPOSALS } from "@/lib/mock/suggestions";
import { useMock } from "@/lib/use-mock";

export default function SuggestionsPage() {
  const [handled, setHandled] = useState<string[]>([]);
  const items = useMock("suggestions", PROPOSALS);
  const open = (items.data ?? []).filter((p) => !handled.includes(p.id));
  const resolve = (id: string) => setHandled((h) => [...h, id]);

  return (
    <Page className="max-w-4xl">
      <PageHeader
        eyebrow="Suggestions"
        title="New ideas waiting for you"
        description="Characters, words and facts that turned up as you wrote. Nothing joins your story bible until you approve it."
      />
      <PreviewNote />

      {items.isPending && (
        <LoadingRegion label="Loading suggestions" className="space-y-5">
          <CardSkeleton />
          <CardSkeleton />
        </LoadingRegion>
      )}

      {!items.isPending && open.length > 0 && (
        <ul className="space-y-5">
          {open.map((p) => (
            <li key={p.id} className="animate-fade-up">
              <Card interactive>
                <CardHeader className="flex-row items-center justify-between gap-3">
                  <CardTitle>{p.title}</CardTitle>
                  <Badge>{KIND_NAME[p.kind]}</Badge>
                </CardHeader>
                <CardContent>
                  <p>{p.detail}</p>
                  <p className="mt-2 text-[15px] text-muted-foreground">Why it&apos;s here: {p.rationale}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => resolve(p.id)}>
                      <Check className="h-4 w-4" aria-hidden /> Add to my story bible
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => resolve(p.id)}>
                      <X className="h-4 w-4" aria-hidden /> Not now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {!items.isPending && open.length === 0 && (
        <EmptyState
          icon={PartyPopper}
          title="You're all caught up"
          description="No new ideas to review. As you keep writing, anything new we spot will show up here."
          action={
            <>
              <Button asChild>
                <Link href="/write">Back to writing</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/bible">View story bible</Link>
              </Button>
            </>
          }
        />
      )}
    </Page>
  );
}

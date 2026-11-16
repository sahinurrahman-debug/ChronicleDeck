"use client";

import { BookMarked, Check, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Page } from "@/components/ui/container";
import { CtaBanner } from "@/components/ui/cta-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, PreviewNote } from "@/components/ui/page-header";
import { Segmented } from "@/components/ui/segmented";
import { CardSkeleton, LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { STATUS_LABEL } from "@/lib/labels";
import { BIBLE_CARDS, BIBLE_SECTIONS } from "@/lib/mock/bible";
import type { BibleSection } from "@/lib/types";
import { useMock } from "@/lib/use-mock";

export default function BiblePage() {
  const [section, setSection] = useState<BibleSection>("character");
  const [removed, setRemoved] = useState<string[]>([]);
  const [approved, setApproved] = useState<string[]>([]);
  const entries = useMock("bible", BIBLE_CARDS);

  const all = (entries.data ?? []).filter((c) => !removed.includes(c.id));
  const cards = all.filter((c) => c.section === section);
  const info = BIBLE_SECTIONS.find((s) => s.id === section);
  const needReview = all.filter((c) => c.status === "proposed" && !approved.includes(c.id)).length;

  return (
    <>
      <Page>
        <PageHeader
          eyebrow="Story bible"
          title="Everything we know about your world"
          description="Review each entry and approve, edit or remove it. Only approved entries are used to check your writing."
        />
        <PreviewNote />

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="overflow-x-auto pb-1">
            <Segmented
              label="Section"
              value={section}
              onChange={setSection}
              options={BIBLE_SECTIONS.map((s) => ({ value: s.id, label: s.label }))}
            />
          </div>
          {entries.isPending ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <p className="text-muted-foreground">
              {all.length} entries · {needReview} need{needReview === 1 ? "s" : ""} your review
            </p>
          )}
        </div>

        {entries.isPending && (
          <LoadingRegion label="Loading your story bible" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </LoadingRegion>
        )}

        {!entries.isPending && cards.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => {
              const isApproved = c.status === "canon" || approved.includes(c.id);
              return (
                <li key={c.id} className="animate-fade-up">
                  <Card interactive className="flex h-full flex-col">
                    <CardHeader className="flex-row items-start justify-between gap-3">
                      <CardTitle>{c.name}</CardTitle>
                      <Badge tone={isApproved ? "ok" : "warn"}>
                        {STATUS_LABEL[isApproved ? "canon" : "proposed"]}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-5">
                      <p className="text-muted-foreground">{c.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {!isApproved && (
                          <Button size="sm" onClick={() => setApproved((a) => [...a, c.id])}>
                            <Check className="h-4 w-4" aria-hidden /> Approve
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Pencil className="h-4 w-4" aria-hidden /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRemoved((r) => [...r, c.id])}>
                          <Trash2 className="h-4 w-4" aria-hidden /> Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        {!entries.isPending && cards.length === 0 && info && (
          <EmptyState
            icon={BookMarked}
            title={`No ${info.label.toLowerCase()} yet`}
            description={`When you add a ${info.singular}, or when one turns up in your writing, it will appear here for you to review.`}
            action={
              <>
                <Button>
                  <Plus className="h-4 w-4" aria-hidden /> Add a {info.singular}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/start">Import from my notes</Link>
                </Button>
              </>
            }
          />
        )}
      </Page>

      <Container className="pb-4">
        <CtaBanner
          title="Ready to write?"
          description="Your story bible is ready to keep watch. Open a chapter and we'll let you know if anything doesn't fit."
          actions={
            <Button asChild size="lg" variant="inverse">
              <Link href="/write">Open your chapter</Link>
            </Button>
          }
        />
      </Container>
    </>
  );
}

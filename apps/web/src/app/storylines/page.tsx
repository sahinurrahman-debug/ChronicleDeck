"use client";

import Link from "next/link";
import { BranchGraph, FIT_LEGEND } from "@/components/map/branch-graph";
import { Button } from "@/components/ui/button";
import { Container, Page } from "@/components/ui/container";
import { CtaBanner } from "@/components/ui/cta-banner";
import { PageHeader, PreviewNote } from "@/components/ui/page-header";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import { GRAPH_NODES } from "@/lib/mock/graph";
import { useMock } from "@/lib/use-mock";

export default function StorylinesPage() {
  const map = useMock("storylines", GRAPH_NODES, 700);

  return (
    <>
      <Page>
        <PageHeader
          eyebrow="Storylines"
          title="Every path your story has taken"
          description="Each box is a chapter. Its colour shows how well it fits your story so far."
          actions={
            <Button asChild variant="outline">
              <Link href="/compare">Compare two storylines</Link>
            </Button>
          }
        />
        <PreviewNote />

        <ul className="mb-5 flex flex-wrap gap-x-6 gap-y-2" aria-label="Colour key">
          {FIT_LEGEND.map((f) => (
            <li key={f.label} className="flex items-center gap-2 text-[15px]">
              <span className={`h-3.5 w-3.5 rounded-full border-2 bg-card ${f.className}`} aria-hidden />
              {f.label}
            </li>
          ))}
        </ul>

        {map.isPending ? (
          <LoadingRegion label="Loading your storylines">
            <Skeleton className="h-[34rem] w-full rounded-2xl" />
          </LoadingRegion>
        ) : (
          <BranchGraph />
        )}
      </Page>

      <Container className="pb-4">
        <CtaBanner
          title="Wondering what if?"
          description="Split your story at any chapter, then put the two versions side by side to see what changes."
          actions={
            <Button asChild size="lg" variant="inverse">
              <Link href="/compare">Compare storylines</Link>
            </Button>
          }
        />
      </Container>
    </>
  );
}

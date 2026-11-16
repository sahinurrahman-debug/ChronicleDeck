"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";
import { findQuoteRange } from "@/components/editor/lint-decorations";
import { NoteCard } from "@/components/editor/note-card";
import { StoryEditor } from "@/components/editor/story-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Page } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, PreviewNote } from "@/components/ui/page-header";
import { Segmented } from "@/components/ui/segmented";
import { CardSkeleton, LoadingRegion } from "@/components/ui/skeleton";
import { SAMPLE_HTML, SAMPLE_VIOLATIONS } from "@/lib/mock/editor";
import {
  useStudio,
  visibleSeverities,
  type Creativity,
  type EditorMode,
  type Strictness,
} from "@/lib/store";
import { useMock } from "@/lib/use-mock";
import type { LintViolation } from "@/lib/types";

export default function WritePage() {
  const {
    mode,
    setMode,
    creativity,
    setCreativity,
    strictness,
    setStrictness,
    activeViolationId,
    setActiveViolation,
  } = useStudio();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const notes = useMock("notes", SAMPLE_VIOLATIONS, 800);

  const visible = useMemo(() => {
    const allowed = visibleSeverities(strictness);
    return (notes.data ?? []).filter((v) => allowed.includes(v.severity) && !dismissed.includes(v.id));
  }, [notes.data, strictness, dismissed]);

  const dismiss = (id: string) => {
    setDismissed((d) => [...d, id]);
    setActiveViolation(null);
  };

  const applyFix = (v: LintViolation) => {
    if (editor) {
      const range = findQuoteRange(editor.state.doc, v.quote);
      if (range) editor.chain().focus().insertContentAt(range, v.suggestedFix).run();
    }
    dismiss(v.id);
  };

  return (
    <Page>
      <PageHeader
        eyebrow="Write"
        title="Chapter 3: The Harbour"
        description="Write freely. We'll gently point out anything that doesn't match your story so far, and show you why."
      />
      <PreviewNote />

      <Card className="mb-8 flex flex-wrap gap-x-10 gap-y-5 p-5 sm:p-6">
        <Segmented<EditorMode>
          label="Who writes"
          showLabel
          value={mode}
          onChange={setMode}
          options={[
            { value: "watch", label: "I write" },
            { value: "cowrite", label: "We write" },
            { value: "draft", label: "Draft for me" },
          ]}
        />
        <Segmented<Creativity>
          label="Writing style"
          showLabel
          value={creativity}
          onChange={setCreativity}
          options={[
            { value: "off", label: "Plain" },
            { value: "subtle", label: "Polished" },
            { value: "bold", label: "Vivid" },
          ]}
        />
        <Segmented<Strictness>
          label="How closely we check"
          showLabel
          value={strictness}
          onChange={setStrictness}
          options={[
            { value: 1, label: "Light" },
            { value: 2, label: "Balanced" },
            { value: 3, label: "Thorough" },
          ]}
        />
      </Card>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
        <Card className="p-6 sm:p-10">
          <StoryEditor
            initialHtml={SAMPLE_HTML}
            violations={visible}
            activeId={activeViolationId}
            onSelect={setActiveViolation}
            onReady={setEditor}
          />
        </Card>

        <section aria-label="Notes on this chapter" className="space-y-4">
          <h2 className="font-sans text-lg font-semibold">
            {notes.isPending ? "Checking your chapter…" : `Notes on this chapter (${visible.length})`}
          </h2>

          {notes.isPending && (
            <LoadingRegion label="Checking your chapter" className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </LoadingRegion>
          )}

          {!notes.isPending &&
            visible.map((v) => (
              <NoteCard
                key={v.id}
                violation={v}
                active={v.id === activeViolationId}
                onSelect={() => setActiveViolation(v.id)}
                onFix={() => applyFix(v)}
                onKeep={() => dismiss(v.id)}
              />
            ))}

          {!notes.isPending && visible.length === 0 && (
            <EmptyState
              icon={CheckCircle2}
              title="Nothing to flag"
              description={
                strictness === 1
                  ? "Only serious problems show at this setting, and there are none. Switch to Thorough to see smaller notes."
                  : "This chapter fits your story so far. Keep writing, and we'll keep watching."
              }
              action={
                <Button asChild variant="outline">
                  <Link href="/suggestions">Review suggestions</Link>
                </Button>
              }
            />
          )}
        </section>
      </div>
    </Page>
  );
}

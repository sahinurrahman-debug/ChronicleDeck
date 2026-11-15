"use client";

import { useMemo } from "react";
import { EvidenceCard } from "@/components/editor/evidence-card";
import { StoryEditor } from "@/components/editor/story-editor";
import { Card, CardContent } from "@/components/ui/card";
import { MockNotice, PageHeader } from "@/components/ui/page-header";
import { Segmented } from "@/components/ui/segmented";
import { SAMPLE_HTML, SAMPLE_VIOLATIONS } from "@/lib/mock/editor";
import { useStudio, visibleSeverities, type EditorMode } from "@/lib/store";

export default function EditorPage() {
  const { mode, setMode, strictness, activeViolationId, setActiveViolation } = useStudio();

  const visible = useMemo(() => {
    const allowed = visibleSeverities(strictness);
    return SAMPLE_VIOLATIONS.filter((v) => allowed.includes(v.severity));
  }, [strictness]);

  return (
    <div>
      <PageHeader
        title="Editor"
        description="Write freely. Flags appear as squiggles with the evidence behind them."
        actions={
          <Segmented<EditorMode>
            label="Writing mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "watch", label: "Watch" },
              { value: "cowrite", label: "Co-write" },
              { value: "draft", label: "Draft" },
            ]}
          />
        }
      />
      <MockNotice />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardContent className="p-6">
            <StoryEditor
              initialHtml={SAMPLE_HTML}
              violations={visible}
              activeId={activeViolationId}
              onSelect={setActiveViolation}
            />
          </CardContent>
        </Card>
        <section aria-label="Flags" className="space-y-3">
          <h2 className="text-sm font-semibold">
            {visible.length} {visible.length === 1 ? "flag" : "flags"}
          </h2>
          {visible.map((v) => (
            <EvidenceCard
              key={v.id}
              violation={v}
              active={v.id === activeViolationId}
              onSelect={() => setActiveViolation(v.id)}
            />
          ))}
          {visible.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing to flag at this strictness.</p>
          )}
        </section>
      </div>
    </div>
  );
}

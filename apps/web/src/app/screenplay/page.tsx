"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Page } from "@/components/ui/container";
import { Textarea } from "@/components/ui/input";
import { PageHeader, PreviewNote } from "@/components/ui/page-header";
import { SAMPLE_SCREENPLAY } from "@/lib/mock/editor";

export default function ScreenplayPage() {
  const [text, setText] = useState(SAMPLE_SCREENPLAY);

  return (
    <Page>
      <PageHeader
        eyebrow="Screenplay"
        title="Write in script format"
        description="Words in brackets, like (furious), tell us how a character sounds in that moment."
      />
      <PreviewNote />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <label htmlFor="script" className="mb-3 block text-base font-semibold">
            Your script
          </label>
          <Textarea
            id="script"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[30rem] font-mono text-[15px] leading-7"
            spellCheck={false}
          />
        </Card>
        <Card className="p-6">
          <h2 className="mb-3 font-sans text-base font-semibold">Page preview</h2>
          <pre className="min-h-[30rem] whitespace-pre-wrap rounded-xl bg-muted p-6 font-mono text-[15px] leading-7">
            {text}
          </pre>
        </Card>
      </div>
    </Page>
  );
}

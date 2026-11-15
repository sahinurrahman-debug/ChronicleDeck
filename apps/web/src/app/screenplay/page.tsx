"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MockNotice, PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/input";
import { SAMPLE_SCREENPLAY } from "@/lib/mock/editor";

export default function ScreenplayPage() {
  const [text, setText] = useState(SAMPLE_SCREENPLAY);

  return (
    <div>
      <PageHeader
        title="Screenplay"
        description="Fountain format. Parentheticals like (furious) shift a character's register."
      />
      <MockNotice />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="fountain">
              Fountain source
            </label>
            <Textarea
              id="fountain"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[28rem] font-mono text-[13px] leading-6"
              spellCheck={false}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Page preview</p>
            <pre className="min-h-[28rem] whitespace-pre-wrap rounded-md bg-muted p-6 font-mono text-[13px] leading-6">
              {text}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockNotice, PageHeader } from "@/components/ui/page-header";
import { Segmented } from "@/components/ui/segmented";
import { BIBLE_CARDS, BIBLE_SECTIONS } from "@/lib/mock/bible";
import type { BibleSection } from "@/lib/types";

export default function BiblePage() {
  const [section, setSection] = useState<BibleSection>("character");
  const cards = BIBLE_CARDS.filter((c) => c.section === section);

  return (
    <div>
      <PageHeader
        title="Story bible"
        description="Your canon, as cards. Accept, edit or reject what the compiler found."
      />
      <MockNotice />
      <Segmented
        label="Bible section"
        value={section}
        onChange={setSection}
        options={BIBLE_SECTIONS.map((s) => ({ value: s.id, label: s.label }))}
        className="mb-5"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex-row items-start justify-between">
              <CardTitle>{c.name}</CardTitle>
              <Badge tone={c.status === "canon" ? "ok" : "warn"}>{c.status}</Badge>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">{c.summary}</p>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" aria-label={`Accept ${c.name}`}>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </Button>
                <Button size="sm" variant="outline" aria-label={`Edit ${c.name}`}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                </Button>
                <Button size="sm" variant="outline" aria-label={`Reject ${c.name}`}>
                  <X className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

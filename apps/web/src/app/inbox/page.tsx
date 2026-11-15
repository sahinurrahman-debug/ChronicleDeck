import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockNotice, PageHeader } from "@/components/ui/page-header";
import { PROPOSALS } from "@/lib/mock/inbox";

export default function InboxPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Proposals"
        description="New characters, words and facts the story introduced. Nothing joins canon until you say so."
      />
      <MockNotice />
      <div className="space-y-3">
        {PROPOSALS.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{p.title}</CardTitle>
              <Badge>{p.kind}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{p.detail}</p>
              <p className="mt-1 text-xs text-muted-foreground">Why: {p.rationale}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm">
                  <Check className="h-3.5 w-3.5" aria-hidden /> Add to canon
                </Button>
                <Button size="sm" variant="outline">
                  <X className="h-3.5 w-3.5" aria-hidden /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

export default function NewStoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Start a story"
        description="Any genre, any universe, any invented language. Dump whatever you have and we'll turn it into a story bible you can approve card by card."
      />
      <Card>
        <CardContent className="space-y-4 pt-4">
          <label className="block space-y-1.5 text-sm font-medium">
            Title
            <Input placeholder="Untitled saga" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            Dump anything
            <Textarea
              className="min-h-48"
              placeholder="Notes, a world-building doc, a half-finished chapter, a character sketch…"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            …or upload a file
            <Input type="file" accept=".txt,.md,.docx,.pdf" className="h-auto py-2" />
          </label>
          <div className="flex items-center gap-3 pt-2">
            <Button asChild>
              <Link href="/bible">Build my story bible</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/editor">Just start writing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="mt-3 text-xs text-muted-foreground">
        Nothing becomes canon until you approve it.
      </p>
    </div>
  );
}

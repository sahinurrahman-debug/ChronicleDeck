"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useRef } from "react";
import { LoadingRegion, Skeleton } from "@/components/ui/skeleton";
import type { LintViolation } from "@/lib/types";
import { LintDecorations, setLintMarks } from "./lint-decorations";

interface Props {
  initialHtml: string;
  violations: LintViolation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  /** Called once the editor is ready, so the page can apply fixes to the text. */
  onReady?: (editor: Editor) => void;
}

export function StoryEditor({ initialHtml, violations, activeId, onSelect, onReady }: Props) {
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing here…" }),
      LintDecorations.configure({ onLintClick: (id) => onSelectRef.current(id) }),
    ],
    content: initialHtml,
    immediatelyRender: false, // avoids a server/browser mismatch in the App Router
    editorProps: { attributes: { class: "story-prose", "aria-label": "Your chapter" } },
  });

  useEffect(() => {
    if (editor) onReady?.(editor);
  }, [editor, onReady]);

  const marks = useMemo(
    () => violations.map((v) => ({ id: v.id, quote: v.quote, severity: v.severity })),
    [violations],
  );

  useEffect(() => {
    if (editor) setLintMarks(editor, marks, activeId);
  }, [editor, marks, activeId]);

  if (!editor) {
    return (
      <LoadingRegion label="Loading your chapter" className="space-y-4 py-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-11/12" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="mt-8 h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </LoadingRegion>
    );
  }
  return <EditorContent editor={editor} />;
}

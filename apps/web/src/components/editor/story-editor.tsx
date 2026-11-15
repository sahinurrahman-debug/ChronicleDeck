"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useRef } from "react";
import type { LintViolation } from "@/lib/types";
import { LintDecorations, setLintMarks } from "./lint-decorations";

interface Props {
  initialHtml: string;
  violations: LintViolation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  editable?: boolean;
}

export function StoryEditor({ initialHtml, violations, activeId, onSelect, editable = true }: Props) {
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing…" }),
      LintDecorations.configure({ onLintClick: (id) => onSelectRef.current(id) }),
    ],
    content: initialHtml,
    editable,
    immediatelyRender: false, // avoids an SSR hydration mismatch in the App Router
    editorProps: { attributes: { class: "story-prose", "aria-label": "Story editor" } },
  });

  const marks = useMemo(
    () => violations.map((v) => ({ id: v.id, quote: v.quote, severity: v.severity })),
    [violations],
  );

  useEffect(() => {
    if (editor) setLintMarks(editor, marks, activeId);
  }, [editor, marks, activeId]);

  return <EditorContent editor={editor} />;
}

import { Extension, type Editor } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Node as PMNode } from "@tiptap/pm/model";
import type { Severity } from "@/lib/types";

/**
 * The lint decoration hook. Anything that can name a quote can underline it:
 * `setLintMarks(editor, marks, activeId)`. Pre-build feeds it mock marks; the live build feeds it
 * verified violations (span + exact quote) from the validation pipeline.
 */
export interface LintMark {
  id: string;
  quote: string;
  severity: Severity;
}

interface LintState {
  marks: LintMark[];
  activeId: string | null;
  decorations: DecorationSet;
}

export const lintKey = new PluginKey<LintState>("chronicleLint");

function build(doc: PMNode, marks: LintMark[], activeId: string | null): DecorationSet {
  const decorations: Decoration[] = [];
  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    for (const m of marks) {
      const at = node.text.indexOf(m.quote);
      if (at < 0) continue;
      decorations.push(
        Decoration.inline(pos + at, pos + at + m.quote.length, {
          class: `lint lint-${m.severity}${m.id === activeId ? " lint-active" : ""}`,
          "data-lint-id": m.id,
        }),
      );
    }
  });
  return DecorationSet.create(doc, decorations);
}

export interface LintOptions {
  onLintClick?: (id: string) => void;
}

export const LintDecorations = Extension.create<LintOptions>({
  name: "chronicleLint",

  addOptions() {
    return { onLintClick: undefined };
  },

  addProseMirrorPlugins() {
    const { onLintClick } = this.options;
    return [
      new Plugin<LintState>({
        key: lintKey,
        state: {
          init: () => ({ marks: [], activeId: null, decorations: DecorationSet.empty }),
          apply(tr, prev, _old, next) {
            const meta = tr.getMeta(lintKey) as
              | { marks: LintMark[]; activeId: string | null }
              | undefined;
            if (!meta && !tr.docChanged) return prev;
            const marks = meta?.marks ?? prev.marks;
            const activeId = meta ? meta.activeId : prev.activeId;
            return { marks, activeId, decorations: build(next.doc, marks, activeId) };
          },
        },
        props: {
          decorations: (state) => lintKey.getState(state)?.decorations ?? DecorationSet.empty,
          handleDOMEvents: {
            click: (_view, event) => {
              const el = (event.target as HTMLElement | null)?.closest("[data-lint-id]");
              const id = el?.getAttribute("data-lint-id");
              if (id) onLintClick?.(id);
              return false;
            },
          },
        },
      }),
    ];
  },
});

export function setLintMarks(editor: Editor, marks: LintMark[], activeId: string | null) {
  editor.view.dispatch(editor.state.tr.setMeta(lintKey, { marks, activeId }));
}

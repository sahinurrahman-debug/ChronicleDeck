"use client";

import {
  Activity,
  BookMarked,
  Clapperboard,
  FileText,
  GitBranch,
  GitCompare,
  Inbox,
  PenLine,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Segmented } from "@/components/ui/segmented";
import { useStudio, type Strictness } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/new", label: "New story", icon: PenLine },
  { href: "/bible", label: "Story bible", icon: BookMarked },
  { href: "/editor", label: "Editor", icon: FileText },
  { href: "/screenplay", label: "Screenplay", icon: Clapperboard },
  { href: "/map", label: "Story map", icon: GitBranch },
  { href: "/whatif", label: "What-if", icon: GitCompare },
  { href: "/inbox", label: "Proposals", icon: Inbox },
  { href: "/health", label: "Health & cost", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const strictness = useStudio((s) => s.strictness);
  const setStrictness = useStudio((s) => s.setStrictness);

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
      <div className="px-5 py-5">
        <p className="text-base font-semibold tracking-tight">ChronicleDeck</p>
        <p className="text-xs text-muted-foreground">Canon you can trust</p>
      </div>
      <nav className="flex-1 space-y-0.5 px-2" aria-label="Studio">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-border p-4">
        <p className="text-xs font-medium text-muted-foreground">Strictness</p>
        <Segmented<Strictness>
          label="Strictness"
          value={strictness}
          onChange={setStrictness}
          options={[
            { value: 1, label: "Relaxed" },
            { value: 2, label: "Balanced" },
            { value: 3, label: "Strict" },
          ]}
        />
        <p className="text-[11px] leading-4 text-muted-foreground">
          Changes what is flagged. Nothing is ever blocked.
        </p>
      </div>
    </aside>
  );
}

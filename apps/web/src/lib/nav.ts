import {
  BookMarked,
  Clapperboard,
  GitBranch,
  GitCompare,
  HeartPulse,
  Lightbulb,
  PenLine,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  blurb: string;
}

export const NAV: NavItem[] = [
  { href: "/write", label: "Write", icon: PenLine, blurb: "Write with gentle notes on anything that doesn't fit." },
  { href: "/screenplay", label: "Screenplay", icon: Clapperboard, blurb: "Script format, with character voices." },
  { href: "/bible", label: "Story bible", icon: BookMarked, blurb: "Every character, place and rule in one spot." },
  { href: "/storylines", label: "Storylines", icon: GitBranch, blurb: "See every path your story has taken." },
  { href: "/compare", label: "Compare", icon: GitCompare, blurb: "Put two storylines side by side." },
  { href: "/suggestions", label: "Suggestions", icon: Lightbulb, blurb: "New ideas waiting for your approval." },
  { href: "/health", label: "Story health", icon: HeartPulse, blurb: "How consistent your story is." },
];

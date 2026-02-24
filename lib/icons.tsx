import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Languages,
  Puzzle,
  Trophy,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  BookOpen,
  GraduationCap,
  Sparkles,
  Languages,
  Puzzle,
  Trophy,
};

export function NucleusIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICON_MAP[name] ?? BookOpen;
  return <Icon {...props} />;
}

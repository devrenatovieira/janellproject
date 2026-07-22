import {
  HandHelping,
  HeartHandshake,
  Home,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  hand: HandHelping,
  home: Home,
  heart: HeartHandshake,
};

/** Cores por serviço — fundo suave + ícone em tom forte */
const toneMap: Record<
  string,
  { wrap: string; icon: string }
> = {
  "servico-de-convivencia": {
    wrap: "bg-sky-100 ring-sky-200/80",
    icon: "text-sky-600",
  },
  "abordagem-social": {
    wrap: "bg-amber-100 ring-amber-200/80",
    icon: "text-amber-600",
  },
  "abrigo-institucional": {
    wrap: "bg-emerald-100 ring-emerald-200/80",
    icon: "text-emerald-600",
  },
  "familia-acolhedora": {
    wrap: "bg-rose-100 ring-rose-200/80",
    icon: "text-rose-600",
  },
};

const fallbackTone = {
  wrap: "bg-brand-soft ring-brand/20",
  icon: "text-brand",
};

export function ServiceIcon({
  iconKey,
  slug,
  className,
  size = "md",
}: {
  iconKey?: "heart" | "users" | "home" | "hand";
  slug?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = iconMap[iconKey ?? "heart"] ?? HeartHandshake;
  const tone = (slug && toneMap[slug]) || fallbackTone;
  const box =
    size === "lg"
      ? "h-16 w-16 rounded-2xl"
      : size === "sm"
        ? "h-11 w-11 rounded-xl"
        : "h-14 w-14 rounded-2xl";
  const glyph = size === "lg" ? "h-8 w-8" : size === "sm" ? "h-5 w-5" : "h-7 w-7";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center shadow-sm ring-1",
        box,
        tone.wrap,
        className,
      )}
      aria-hidden
    >
      <Icon className={cn(glyph, tone.icon)} strokeWidth={1.75} />
    </span>
  );
}

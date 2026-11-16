import type { ReactNode } from "react";
import { CheckCircle2, CircleDashed, Eye, Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/data/mock-content";
import { agencyTheme } from "@/theme/agency";

export function AgencyLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {agencyTheme.logoSrc ? (
        <img src={agencyTheme.logoSrc} alt="" className="h-9 w-9 rounded-lg" />
      ) : (
        <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
          {agencyTheme.logoMonogram}
        </span>
      )}
      <span className="font-display text-base font-bold text-text-primary">{agencyTheme.name}</span>
    </div>
  );
}

export function SectionHeader({ title, description, action, id, as: Tag = "h2" }: { title: string; description?: string; action?: ReactNode; id?: string; as?: "h1" | "h2" }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <Tag id={id} className="text-lg font-bold text-text-primary sm:text-xl">{title}</Tag>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetaChip({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-secondary">{children}</span>;
}

const statusMap: Record<ContentStatus, { label: string; icon: typeof Eye; cls: string }> = {
  rascunho: { label: "Rascunho", icon: CircleDashed, cls: "bg-surface-muted text-text-secondary border-border" },
  revisao: { label: "Em revisão", icon: Eye, cls: "bg-warning-soft text-warning border-warning/30" },
  pronto: { label: "Pronto", icon: CheckCircle2, cls: "bg-success-soft text-success border-success/30" },
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const s = statusMap[status];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold", s.cls)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {s.label}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <Inbox className="h-8 w-8 text-text-secondary" aria-hidden />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Carregando…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 text-sm text-text-secondary">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

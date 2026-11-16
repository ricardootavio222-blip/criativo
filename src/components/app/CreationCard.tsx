import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentFormat } from "@/data/formats";
import { MetaChip } from "./primitives";

type Props = {
  format: ContentFormat;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
};

export function CreationCard({ format, loading, disabled, error }: Props) {
  const navigate = useNavigate();
  const soon = format.status === "soon";
  const inactive = disabled || soon || loading;
  const Icon = format.icon;

  return (
    <button
      type="button"
      disabled={inactive}
      aria-busy={loading || undefined}
      aria-describedby={error ? `${format.id}-err` : undefined}
      onClick={() => navigate({ to: "/criar/$formato", params: { formato: format.id } })}
      className={cn(
        "group relative flex h-full w-full flex-col rounded-xl border bg-surface p-5 text-left shadow-soft",
        "transition-[transform,box-shadow,border-color] duration-200 motion-reduce:transform-none",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift active:translate-y-0 active:scale-[0.99]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-soft",
        format.featured ? "border-primary/25" : "border-border",
        error && "border-error",
      )}
    >
      {soon && (
        <span className="absolute right-4 top-4 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">Em breve</span>
      )}
      <span
        aria-hidden
        className={cn(
          "grid h-12 w-12 place-items-center rounded-xl",
          format.featured ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary",
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-bold">{format.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{format.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {format.meta.map((m) => <MetaChip key={m}>{m}</MetaChip>)}
      </div>
      {error && (
        <p id={`${format.id}-err`} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-error">
          <AlertCircle className="h-4 w-4" aria-hidden /> {error}
        </p>
      )}
      <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Abrindo…</> : <>{format.action} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></>}
      </span>
    </button>
  );
}

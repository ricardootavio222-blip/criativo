import { useNavigate } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { getFormat } from "@/data/formats";
import { formatDate, type ContentItem } from "@/data/mock-content";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./primitives";

export function Thumb({ aspect, label, imageDataUrl }: { aspect: string; label: string; imageDataUrl?: string | null }) {
  return (
    <div className="grid aspect-[5/4] place-items-center rounded-lg bg-surface-muted">
      <div
        className="relative h-[70%] max-w-[80%] overflow-hidden rounded-md border border-border-strong/60 bg-surface"
        style={{ aspectRatio: aspect }}
      >
        {imageDataUrl && (
          <img src={imageDataUrl} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="absolute bottom-1 right-1 rounded bg-surface-muted/90 px-1 text-[10px] font-semibold text-text-secondary">
          {label}
        </span>
      </div>
    </div>
  );
}

export function ContentCard({ item, onDelete }: { item: ContentItem; onDelete?: () => void }) {
  const f = getFormat(item.format)!;
  const navigate = useNavigate();

  const open = () => navigate({ to: "/criar/$formato", params: { formato: item.format }, search: { id: item.id } });

  const handle = (action: "Abrir" | "Duplicar" | "Renomear" | "Excluir") => {
    if (action === "Abrir") return open();
    if (action === "Excluir") {
      if (onDelete) {
        onDelete();
        toast.success(`"${item.title}" excluído.`);
      } else {
        toast("Exclusão indisponível aqui.");
      }
      return;
    }
    toast(`${action}: "${item.title}"`, { description: "Essa ação será adicionada em breve." });
  };

  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-3 shadow-soft">
      <button type="button" onClick={open} className="text-left outline-focus-ring" aria-label={`Abrir ${item.title}`}>
        <Thumb aspect={f.aspect} label={f.aspectLabel} imageDataUrl={item.imageDataUrl} />
      </button>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{item.title}</h3>
          <p className="text-xs text-text-secondary">{f.name}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-1 -mt-1" aria-label={`Mais ações para ${item.title}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(["Abrir", "Duplicar", "Renomear"] as const).map((a) => (
              <DropdownMenuItem key={a} onSelect={() => handle(a)}>{a}</DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error focus:text-error" onSelect={() => handle("Excluir")}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <StatusBadge status={item.status} />
        <time dateTime={item.updatedAt} className="text-xs text-text-secondary">{formatDate(item.updatedAt)}</time>
      </div>
    </article>
  );
}

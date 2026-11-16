import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { getFormat } from "@/data/formats";
import { formatDate, type ContentItem } from "@/data/mock-content";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./primitives";

export function Thumb({ aspect, label }: { aspect: string; label: string }) {
  return (
    <div className="grid aspect-[5/4] place-items-center rounded-lg bg-surface-muted">
      <div className="relative h-[70%] max-w-[80%] rounded-md border border-border-strong/60 bg-surface" style={{ aspectRatio: aspect }}>
        <span className="absolute bottom-1 right-1 rounded bg-surface-muted px-1 text-[10px] font-semibold text-text-secondary">{label}</span>
      </div>
    </div>
  );
}

export function ContentCard({ item }: { item: ContentItem }) {
  const f = getFormat(item.format)!;
  const act = (a: string) => toast(`${a}: “${item.title}”`, { description: "Ação de demonstração — nada foi alterado." });
  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-3 shadow-soft">
      <Thumb aspect={f.aspect} label={f.aspectLabel} />
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
            {["Abrir", "Duplicar", "Renomear"].map((a) => <DropdownMenuItem key={a} onSelect={() => act(a)}>{a}</DropdownMenuItem>)}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error focus:text-error" onSelect={() => act("Excluir")}>Excluir</DropdownMenuItem>
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

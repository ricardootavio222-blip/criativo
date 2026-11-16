import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentCard } from "@/components/app/ContentCard";
import { EmptyState } from "@/components/app/primitives";
import { formats, type FormatId } from "@/data/formats";
import { useContents } from "@/hooks/use-contents";

export const Route = createFileRoute("/conteudos")({
  head: () => ({
    meta: [
      { title: "Meus conteúdos — Central de criação" },
      { name: "description", content: "Acesse, continue ou reutilize os conteúdos que você já criou." },
      { property: "og:title", content: "Meus conteúdos" },
      { property: "og:description", content: "Acesse, continue ou reutilize os conteúdos que você já criou." },
    ],
  }),
  component: ContentsPage,
});

function ContentsPage() {
  const { items, remove } = useContents();
  const [filter, setFilter] = useState<FormatId | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      if (filter !== "all" && c.format !== filter) return false;
      if (q && !c.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, filter, query]);

  return (
    <div className="space-y-8">
      <header className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Meus conteúdos</h1>
          <p className="mt-2 text-text-secondary">Acesse, continue ou reutilize o que você já criou.</p>
        </div>
        <Button asChild>
          <Link to="/criar"><Sparkles className="h-4 w-4" /> Criar novo</Link>
        </Button>
      </header>

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            aria-label="Buscar por título"
            placeholder="Buscar por título…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div role="tablist" aria-label="Filtrar por formato" className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Todos</FilterChip>
          {formats.map((f) => (
            <FilterChip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? "Nenhum conteúdo ainda" : "Nada por aqui"}
          description={items.length === 0
            ? "Clique em Criar novo e comece o seu primeiro conteúdo."
            : "Tente mudar o filtro ou a busca."}
          action={items.length === 0 ? (
            <Button asChild><Link to="/criar"><Sparkles className="h-4 w-4" /> Criar novo</Link></Button>
          ) : (
            <Button variant="outline" onClick={() => { setFilter("all"); setQuery(""); }}>Limpar filtros</Button>
          )}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((c) => (
            <li key={c.id}><ContentCard item={c} onDelete={() => remove(c.id)} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        active
          ? "inline-flex items-center rounded-full border border-primary bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
          : "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary hover:bg-surface-muted"
      }
    >
      {children}
    </button>
  );
}

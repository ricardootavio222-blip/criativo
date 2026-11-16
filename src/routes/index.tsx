import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FormatGrid } from "@/components/app/FormatGrid";
import { ContentCard, Thumb } from "@/components/app/ContentCard";
import { SectionHeader, StatusBadge } from "@/components/app/primitives";
import { formatDate, mockContents, mockDraft } from "@/data/mock-content";
import { getFormat } from "@/data/formats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Central de criação" },
      { name: "description", content: "Crie Stories, Reels, carrosséis e posts para suas redes sociais em poucos minutos." },
      { property: "og:title", content: "Central de criação de conteúdo" },
      { property: "og:description", content: "Crie conteúdo para Instagram e Facebook com a sua marca." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const draftFormat = mockDraft ? getFormat(mockDraft.format) : null;
  return (
    <div className="space-y-12">
      <header className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Central de criação</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">O que vamos criar hoje?</h1>
          <p className="mt-2 max-w-xl text-text-secondary">Escolha um formato e crie conteúdo para suas redes sociais em poucos minutos.</p>
        </div>
        <Button variant="outline" asChild><Link to="/conteudos">Ver meus conteúdos</Link></Button>
      </header>

      <section aria-label="Formatos de conteúdo"><FormatGrid /></section>

      {mockDraft && draftFormat && (
        <section aria-labelledby="draft-h" className="space-y-4">
          <SectionHeader id="draft-h" title="Continuar último rascunho" />
          <div className="grid gap-4 rounded-xl border border-border bg-surface p-4 shadow-soft sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-center">
            <Thumb aspect={draftFormat.aspect} label={draftFormat.aspectLabel} />
            <div className="min-w-0 space-y-2">
              <h3 className="font-semibold">{mockDraft.title}</h3>
              <p className="text-sm text-text-secondary">{draftFormat.name} · Editado em <time dateTime={mockDraft.updatedAt}>{formatDate(mockDraft.updatedAt)}</time></p>
              <div className="flex items-center gap-3">
                <StatusBadge status={mockDraft.status} />
                <Progress value={mockDraft.progress} className="h-2 max-w-40" aria-label="Progresso" />
                <span className="text-xs font-medium text-text-secondary">{mockDraft.progress}% concluído</span>
              </div>
            </div>
            <Button asChild><Link to="/criar/$formato" params={{ formato: mockDraft.format }}>Continuar edição <ArrowRight /></Link></Button>
          </div>
        </section>
      )}

      <div className="grid gap-12">
        <section aria-labelledby="lib-h" className="space-y-4">
          <SectionHeader id="lib-h" title="Seus conteúdos" description="Acesse, continue ou reutilize o que você já criou." action={<Button variant="ghost" size="sm" asChild><Link to="/conteudos">Ver todos</Link></Button>} />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockContents.map((c) => <li key={c.id}><ContentCard item={c} /></li>)}
          </ul>
        </section>

        <aside aria-labelledby="bk-h" className="h-fit rounded-xl border border-border bg-surface p-5 shadow-soft">
          <span aria-hidden className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-accent"><Palette className="h-5 w-5" /></span>
          <h2 id="bk-h" className="mt-4 text-lg font-bold">Kit de Marca</h2>
          <p className="mt-1 text-sm text-text-secondary">Configure logo, cores e tipografias para aplicar automaticamente aos novos conteúdos.</p>
          <Button variant="outline" className="mt-4 w-full" asChild><Link to="/kit-de-marca">Configurar Kit de Marca</Link></Button>
        </aside>
      </div>
    </div>
  );
}

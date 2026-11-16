import { createFileRoute } from "@tanstack/react-router";
import { ContentCard } from "@/components/app/ContentCard";
import { mockContents } from "@/data/mock-content";

export const Route = createFileRoute("/conteudos")({
  head: () => ({
    meta: [
      { title: "Meus conteúdos — Central de criação" },
      { name: "description", content: "Acesse, continue ou reutilize os conteúdos que você já criou." },
      { property: "og:title", content: "Meus conteúdos" },
      { property: "og:description", content: "Acesse, continue ou reutilize os conteúdos que você já criou." },
    ],
  }),
  component: () => (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Meus conteúdos</h1>
        <p className="mt-2 text-text-secondary">Acesse, continue ou reutilize o que você já criou.</p>
      </header>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockContents.map((c) => <li key={c.id}><ContentCard item={c} /></li>)}
      </ul>
    </div>
  ),
});

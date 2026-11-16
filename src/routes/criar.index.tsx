import { createFileRoute } from "@tanstack/react-router";
import { FormatGrid } from "@/components/app/FormatGrid";

export const Route = createFileRoute("/criar/")({
  head: () => ({
    meta: [
      { title: "Criar conteúdo — Central de criação" },
      { name: "description", content: "Escolha o formato do conteúdo que você quer criar." },
      { property: "og:title", content: "Criar conteúdo" },
      { property: "og:description", content: "Escolha o formato do conteúdo que você quer criar." },
    ],
  }),
  component: () => (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Criar conteúdo</h1>
        <p className="mt-2 text-text-secondary">Escolha um formato para começar.</p>
      </header>
      <FormatGrid />
    </div>
  ),
});

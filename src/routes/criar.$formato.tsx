import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFormat } from "@/data/formats";

export const Route = createFileRoute("/criar/$formato")({
  loader: ({ params }) => {
    const f = getFormat(params.formato);
    if (!f) throw notFound();
    return { name: f.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Criar ${loaderData.name} — Central de criação` : "Formato indisponível" },
      { name: "description", content: "Fluxo guiado de criação de conteúdo." },
      { property: "og:title", content: loaderData ? `Criar ${loaderData.name}` : "Formato indisponível" },
      { property: "og:description", content: "Fluxo guiado de criação de conteúdo." },
    ],
  }),
  component: CreatePlaceholder,
});

function CreatePlaceholder() {
  const { formato } = Route.useParams();
  const f = getFormat(formato)!;
  const Icon = f.icon;
  return (
    <div className="space-y-8">
      <Button variant="ghost" asChild className="-ml-3"><Link to="/criar"><ArrowLeft /> Voltar</Link></Button>
      <section className="rounded-xl border border-border bg-surface p-8 text-center shadow-soft sm:p-12">
        <span aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground"><Icon className="h-7 w-7" /></span>
        <h1 className="mt-5 text-3xl font-bold">{f.name}</h1>
        <p className="mx-auto mt-2 max-w-md text-text-secondary">O fluxo guiado de criação será configurado na próxima etapa.</p>
        <Button size="lg" className="mt-6" disabled>Começar criação</Button>
      </section>
    </div>
  );
}

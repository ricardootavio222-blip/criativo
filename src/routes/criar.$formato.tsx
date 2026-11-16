import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Image as ImageIcon, Save, CheckCircle2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFormat } from "@/data/formats";
import { useContents } from "@/hooks/use-contents";
import { useBrandKit } from "@/hooks/use-brand-kit";
import { z } from "zod";

const searchSchema = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/criar/$formato")({
  validateSearch: searchSchema,
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
  component: CreatePage,
});

const MAX_IMAGE_BYTES = 2_000_000; // ~2MB

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function CreatePage() {
  const { formato } = Route.useParams();
  const { id: editingId } = Route.useSearch();
  const navigate = useNavigate();
  const { items, create, update, getById } = useContents();
  const { kit } = useBrandKit();
  const f = getFormat(formato)!;
  const Icon = f.icon;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // When editing, hydrate the form once the content is available.
  useEffect(() => {
    if (!editingId) {
      setLoaded(true);
      return;
    }
    const existing = getById(editingId);
    if (existing) {
      setTitle(existing.title);
      setBody(existing.body ?? "");
      setCta(existing.cta ?? "");
      setImageDataUrl(existing.imageDataUrl ?? null);
      setLoaded(true);
    }
  }, [editingId, items, getById]);

  async function handleImage(file: File) {
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Imagem muito grande", { description: "Envie uma imagem de até 2MB." });
      return;
    }
    try {
      const url = await fileToDataUrl(file);
      setImageDataUrl(url);
    } catch {
      toast.error("Não foi possível carregar a imagem.");
    }
  }

  function save(status: "rascunho" | "pronto") {
    if (!title.trim()) {
      toast.error("Dá um título para o conteúdo antes de salvar.");
      return;
    }
    if (editingId) {
      update(editingId, { title: title.trim(), body, cta, imageDataUrl, status });
      toast.success(status === "pronto" ? "Conteúdo marcado como pronto!" : "Rascunho atualizado.");
    } else {
      create({ title: title.trim(), format: f.id, body, cta, imageDataUrl, status });
      toast.success(status === "pronto" ? "Conteúdo pronto salvo!" : "Rascunho salvo.");
    }
    navigate({ to: "/conteudos" });
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" asChild className="-ml-3">
        <Link to="/criar"><ArrowLeft /> Voltar</Link>
      </Button>

      <header className="flex items-center gap-4">
        <span aria-hidden className="grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{editingId ? `Editar ${f.name}` : `Criar ${f.name}`}</h1>
          <p className="text-sm text-text-secondary">{f.description}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
        {/* Form */}
        <section className="space-y-5 rounded-xl border border-border bg-surface p-5 shadow-soft">
          <div className="space-y-1.5">
            <Label htmlFor="c-title">Título</Label>
            <Input id="c-title" placeholder="Ex.: Promoção de inverno" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-body">Texto principal</Label>
            <Textarea id="c-body" rows={5} placeholder="O conteúdo que vai aparecer no post…" value={body} onChange={(e) => setBody(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-cta">Chamada de ação (CTA)</Label>
            <Input id="c-cta" placeholder="Ex.: Saiba mais" value={cta} onChange={(e) => setCta(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Imagem</Label>
            {imageDataUrl ? (
              <div className="flex items-center gap-3">
                <img src={imageDataUrl} alt="Pré-visualização" className="h-20 w-20 rounded-md border border-border object-cover" />
                <Button type="button" variant="outline" size="sm" onClick={() => setImageDataUrl(null)}>
                  <X className="h-4 w-4" /> Remover
                </Button>
              </div>
            ) : (
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                <ImageIcon className="h-4 w-4" /> Enviar imagem
              </Button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImage(file);
                e.target.value = "";
              }}
            />
            <p className="text-xs text-text-secondary">PNG, JPG ou WEBP, até 2MB.</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => save("rascunho")} disabled={!loaded}>
              <Save className="h-4 w-4" /> Salvar rascunho
            </Button>
            <Button variant="outline" onClick={() => save("pronto")} disabled={!loaded}>
              <CheckCircle2 className="h-4 w-4" /> Marcar como pronto
            </Button>
          </div>
        </section>

        {/* Live preview */}
        <aside className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Prévia</h2>
          <div className="rounded-xl border border-border bg-surface-muted p-4">
            <PreviewCard
              aspect={f.aspect}
              title={title}
              body={body}
              cta={cta}
              imageDataUrl={imageDataUrl}
              brandPrimary={kit.colors.primary}
              brandAccent={kit.colors.accent}
              brandLogoUrl={kit.logoUrl}
            />
            <p className="mt-3 text-center text-xs text-text-secondary">{f.aspectLabel} · {f.name}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PreviewCard({
  aspect, title, body, cta, imageDataUrl, brandPrimary, brandAccent, brandLogoUrl,
}: {
  aspect: string;
  title: string;
  body: string;
  cta: string;
  imageDataUrl: string | null;
  brandPrimary: string | null;
  brandAccent: string | null;
  brandLogoUrl: string | null;
}) {
  const bg = brandPrimary ?? "#1f2937";
  const accent = brandAccent ?? "#f59e0b";
  return (
    <div
      className="mx-auto overflow-hidden rounded-lg border border-border-strong/40 shadow-lift"
      style={{ aspectRatio: aspect, maxWidth: 360, backgroundColor: bg }}
    >
      <div className="relative flex h-full w-full flex-col justify-between p-4 text-white">
        {imageDataUrl && (
          <img src={imageDataUrl} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-60" />
        )}
        <div className="relative z-10 flex items-center gap-2">
          {brandLogoUrl ? (
            <img src={brandLogoUrl} alt="" className="h-8 w-8 rounded-md bg-white object-contain" />
          ) : (
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-md bg-white/90 text-xs font-bold" style={{ color: bg }}>
              M
            </span>
          )}
        </div>
        <div className="relative z-10 space-y-2">
          <h3 className="text-xl font-bold leading-tight drop-shadow-sm">{title || "Seu título aqui"}</h3>
          {body && <p className="text-sm leading-snug drop-shadow-sm line-clamp-4">{body}</p>}
          {cta && (
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-black" style={{ backgroundColor: accent }}>
              {cta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

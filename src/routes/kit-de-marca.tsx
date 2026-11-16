import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Image as ImageIcon, Palette, RotateCcw, ScrollText, Type, X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBrandKit } from "@/hooks/use-brand-kit";

export const Route = createFileRoute("/kit-de-marca")({
  head: () => ({
    meta: [
      { title: "Kit de Marca — Central de criação" },
      { name: "description", content: "Defina logo, cores e tipografias aplicadas aos conteúdos gerados." },
      { property: "og:title", content: "Kit de Marca" },
      { property: "og:description", content: "Defina logo, cores e tipografias aplicadas aos conteúdos gerados." },
    ],
  }),
  component: BrandKitPage,
});

const MAX_LOGO_BYTES = 1_000_000; // ~1MB
const TYPOGRAPHY_OPTIONS = [
  "Manrope",
  "Bricolage Grotesque",
  "Inter",
  "Montserrat",
  "Open Sans",
  "Poppins",
  "Roboto",
  "Playfair Display",
];

function Block({ icon: Icon, title, desc, children }: { icon: LucideIcon; title: string; desc: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-muted text-text-secondary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="text-sm text-text-secondary">{desc}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function BrandKitPage() {
  const { kit, save, reset } = useBrandKit();
  const [logoUrl, setLogoUrl] = useState<string | null>(kit.logoUrl);
  const [primary, setPrimary] = useState<string>(kit.colors.primary ?? "#1f2937");
  const [secondary, setSecondary] = useState<string>(kit.colors.secondary ?? "#f3f4f6");
  const [accent, setAccent] = useState<string>(kit.colors.accent ?? "#f59e0b");
  const [heading, setHeading] = useState<string>(kit.typography.heading ?? "");
  const [body, setBody] = useState<string>(kit.typography.body ?? "");
  const [guidelines, setGuidelines] = useState<string>(kit.guidelines);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleLogo(file: File) {
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("Logo muito grande", { description: "Envie uma imagem de até 1MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    save({
      status: "configured",
      logoUrl,
      colors: { primary, secondary, accent },
      typography: { heading: heading || null, body: body || null },
      guidelines,
    });
    toast.success("Kit de Marca salvo.");
  }

  function handleReset() {
    reset();
    setLogoUrl(null);
    setPrimary("#1f2937");
    setSecondary("#f3f4f6");
    setAccent("#f59e0b");
    setHeading("");
    setBody("");
    setGuidelines("");
    toast("Kit de Marca restaurado para o padrão.");
  }

  return (
    <div className="space-y-8">
      <header className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div>
          <h1 className="text-3xl font-bold">Kit de Marca</h1>
          <p className="mt-2 max-w-2xl text-text-secondary">
            Estas configurações são aplicadas apenas aos criativos gerados para suas redes sociais. Elas não alteram a aparência deste aplicativo.
          </p>
        </div>
        {kit.status === "configured" ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-sm font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Configurado
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-warning/30 bg-warning-soft px-3 py-1 text-sm font-semibold text-warning">
            <AlertCircle className="h-4 w-4" aria-hidden /> Não configurado
          </span>
        )}
      </header>

      {/* Mini preview */}
      <section aria-label="Prévia do Kit" className="rounded-xl border border-border bg-surface p-4 shadow-soft">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">Como seus criativos vão parecer</p>
        <div className="flex items-center gap-4 rounded-lg p-4" style={{ backgroundColor: primary, color: "#fff" }}>
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-12 w-12 rounded-md bg-white object-contain" />
          ) : (
            <span aria-hidden className="grid h-12 w-12 place-items-center rounded-md bg-white/90 text-base font-bold" style={{ color: primary }}>
              M
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold drop-shadow-sm" style={{ fontFamily: heading || undefined }}>Título do post</p>
            <p className="text-sm opacity-90" style={{ fontFamily: body || undefined }}>Texto principal usando suas fontes.</p>
          </div>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-black" style={{ backgroundColor: accent }}>
            Saiba mais
          </span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Block icon={ImageIcon} title="Logo" desc="Versão do logo usada nos criativos.">
          {logoUrl ? (
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo atual" className="h-20 w-20 rounded-md border border-border object-contain" />
              <Button type="button" variant="outline" size="sm" onClick={() => setLogoUrl(null)}>
                <X className="h-4 w-4" /> Remover
              </Button>
            </div>
          ) : (
            <>
              <div className="grid h-28 place-items-center rounded-lg border border-dashed border-border bg-surface-muted text-sm text-text-secondary">
                Nenhum logo enviado
              </div>
              <Button variant="outline" onClick={() => fileRef.current?.click()}>
                <ImageIcon className="h-4 w-4" /> Enviar logo
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogo(file);
                  e.target.value = "";
                }}
              />
            </>
          )}
        </Block>

        <Block icon={Palette} title="Cores" desc="Paleta aplicada às artes geradas.">
          {[
            { label: "Cor principal", value: primary, set: setPrimary },
            { label: "Cor secundária", value: secondary, set: setSecondary },
            { label: "Cor de destaque", value: accent, set: setAccent },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex items-center gap-3">
              <input
                aria-label={label}
                type="color"
                value={value}
                onChange={(e) => set(e.target.value)}
                className="h-9 w-9 cursor-pointer rounded-md border border-border bg-surface"
              />
              <Label className="flex-1 text-sm">{label}</Label>
              <span className="font-mono text-xs text-text-secondary">{value}</span>
            </div>
          ))}
        </Block>

        <Block icon={Type} title="Tipografia" desc="Fontes para títulos e textos dos criativos.">
          <div className="space-y-1.5">
            <Label htmlFor="bk-h">Fonte de títulos</Label>
            <select
              id="bk-h"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-surface px-3 text-sm outline-focus-ring"
            >
              <option value="">Padrão</option>
              {TYPOGRAPHY_OPTIONS.map((font) => <option key={font} value={font}>{font}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bk-b">Fonte de textos</Label>
            <select
              id="bk-b"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-surface px-3 text-sm outline-focus-ring"
            >
              <option value="">Padrão</option>
              {TYPOGRAPHY_OPTIONS.map((font) => <option key={font} value={font}>{font}</option>)}
            </select>
          </div>
        </Block>

        <Block icon={ScrollText} title="Diretrizes da marca" desc="Tom de voz e regras visuais.">
          <Label htmlFor="bk-g" className="sr-only">Diretrizes</Label>
          <Textarea
            id="bk-g"
            rows={4}
            placeholder="Ex.: Linguagem próxima e acolhedora, evitar gírias…"
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
          />
        </Block>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave}>Salvar Kit de Marca</Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" /> Restaurar padrão
        </Button>
      </div>
    </div>
  );
}

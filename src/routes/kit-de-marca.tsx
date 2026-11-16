import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Image, Info, Palette, ScrollText, Type, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emptyBrandKit } from "@/brand-kit/types";

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

function Block({ icon: Icon, title, desc, children }: { icon: LucideIcon; title: string; desc: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-muted text-text-secondary"><Icon className="h-5 w-5" /></span>
        <div><h2 className="font-bold">{title}</h2><p className="text-sm text-text-secondary">{desc}</p></div>
      </div>
      <fieldset disabled className="mt-4 space-y-3">{children}</fieldset>
    </section>
  );
}

function BrandKitPage() {
  const kit = emptyBrandKit;
  return (
    <div className="space-y-8">
      <header className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div>
          <h1 className="text-3xl font-bold">Kit de Marca</h1>
          <p className="mt-2 max-w-2xl text-text-secondary">Estas configurações são aplicadas apenas aos criativos gerados para suas redes sociais. Elas não alteram a aparência deste aplicativo.</p>
        </div>
        {kit.status === "not_configured" && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-warning/30 bg-warning-soft px-3 py-1 text-sm font-semibold text-warning">
            <AlertCircle className="h-4 w-4" aria-hidden /> Não configurado
          </span>
        )}
      </header>

      <div role="note" className="flex gap-3 rounded-xl border border-primary/20 bg-primary-soft p-4 text-sm">
        <Info className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p>A configuração completa e o versionamento do Kit de Marca serão adicionados em uma próxima etapa.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Block icon={Image} title="Logo" desc="Versões do logo usadas nos criativos.">
          <div className="grid h-28 place-items-center rounded-lg border border-dashed border-border bg-surface-muted text-sm text-text-secondary">Nenhum logo enviado</div>
          <Button variant="outline">Enviar logo</Button>
        </Block>
        <Block icon={Palette} title="Cores" desc="Paleta aplicada às artes geradas.">
          {["Cor principal", "Cor secundária", "Cor de destaque"].map((c) => (
            <div key={c} className="flex items-center gap-3">
              <span aria-hidden className="h-9 w-9 rounded-md border border-dashed border-border-strong bg-surface-muted" />
              <Label className="flex-1 text-sm">{c}</Label>
              <span className="text-xs text-text-secondary">Não definida</span>
            </div>
          ))}
        </Block>
        <Block icon={Type} title="Tipografia" desc="Fontes para títulos e textos dos criativos.">
          <div className="space-y-1.5"><Label htmlFor="bk-h">Fonte de títulos</Label><Input id="bk-h" placeholder="Ex.: Montserrat" /></div>
          <div className="space-y-1.5"><Label htmlFor="bk-b">Fonte de textos</Label><Input id="bk-b" placeholder="Ex.: Open Sans" /></div>
        </Block>
        <Block icon={ScrollText} title="Diretrizes da marca" desc="Tom de voz e regras visuais.">
          <Label htmlFor="bk-g" className="sr-only">Diretrizes</Label>
          <Textarea id="bk-g" rows={4} placeholder="Ex.: Linguagem próxima e acolhedora, evitar gírias…" />
        </Block>
      </div>
    </div>
  );
}

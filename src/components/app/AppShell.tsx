import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FolderOpen, Home, Menu, Palette, PlusCircle, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AgencyLogo } from "./primitives";

type NavDef = { to: "/" | "/criar" | "/conteudos" | "/kit-de-marca"; label: string; icon: LucideIcon; exact?: boolean; disabled?: boolean };
const nav: NavDef[] = [
  { to: "/", label: "Início", icon: Home, exact: true },
  { to: "/criar", label: "Criar conteúdo", icon: PlusCircle },
  { to: "/conteudos", label: "Meus conteúdos", icon: FolderOpen },
  { to: "/kit-de-marca", label: "Kit de Marca", icon: Palette },
];

const itemCls =
  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary active:bg-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-[status=active]:bg-primary-soft data-[status=active]:font-semibold data-[status=active]:text-primary aria-disabled:pointer-events-none aria-disabled:opacity-50";

export function NavItem({ item, onNavigate }: { item: NavDef; onNavigate?: (() => void) | undefined }) {
  const Icon = item.icon;
  return (
    <Link to={item.to} activeOptions={{ exact: !!item.exact }} className={itemCls} aria-disabled={item.disabled || undefined} onClick={onNavigate}>
      {({ isActive }) => (
        <>
          <Icon className="h-5 w-5 shrink-0" aria-hidden />
          <span>{item.label}</span>
          {isActive && <span className="sr-only">(página atual)</span>}
        </>
      )}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav aria-label="Navegação principal">
      <ul className="space-y-1">
        {nav.map((n) => <li key={n.to}><NavItem item={n} onNavigate={onNavigate} /></li>)}
      </ul>
    </nav>
  );
}

function Account() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-3">
      <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">CB</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">Café Bom Grão</p>
        <p className="truncate text-xs text-text-secondary">Conta da empresa</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2">Pular para o conteúdo</a>
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-surface p-4 lg:flex">
        <div className="px-2 py-2"><AgencyLogo /></div>
        <div className="mt-6 flex-1"><NavList /></div>
        <Account />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <AgencyLogo />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu"><Menu className="!size-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col bg-surface p-4">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="px-2 py-2"><AgencyLogo /></div>
            <div className="mt-6 flex-1"><NavList onNavigate={() => setOpen(false)} /></div>
            <Account />
          </SheetContent>
        </Sheet>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}

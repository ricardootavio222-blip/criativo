// Development mock data. Replace with database queries later.
import type { FormatId } from "./formats";

export type ContentStatus = "rascunho" | "revisao" | "pronto";

export type ContentItem = {
  id: string;
  title: string;
  format: FormatId;
  status: ContentStatus;
  updatedAt: string; // ISO
  progress?: number; // 0-100
  body?: string;
  cta?: string;
  imageDataUrl?: string | null;
};

export const mockDraft: ContentItem | null = {
  id: "d1",
  title: "Promoção de primavera — 20% em toda a loja",
  format: "carrossel",
  status: "rascunho",
  updatedAt: "2026-10-15T18:40:00Z",
  progress: 60,
};

export const mockContents: ContentItem[] = [
  { id: "c1", title: "Bastidores da produção", format: "story", status: "pronto", updatedAt: "2026-10-14T13:10:00Z" },
  { id: "c2", title: "5 dicas para cuidar do seu café", format: "carrossel", status: "revisao", updatedAt: "2026-10-13T09:25:00Z" },
  { id: "c3", title: "Lançamento do novo cardápio", format: "reel", status: "rascunho", updatedAt: "2026-10-12T16:00:00Z" },
  { id: "c4", title: "Horário especial de feriado", format: "facebook", status: "pronto", updatedAt: "2026-10-10T11:45:00Z" },
];

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date(iso));

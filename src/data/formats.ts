import { Clapperboard, GalleryHorizontal, Smartphone, Square, Facebook, Music2, Linkedin, type LucideIcon } from "lucide-react";

export type FormatId = "story" | "reel" | "carrossel" | "post" | "facebook" | "tiktok" | "linkedin";

export type ContentFormat = {
  id: FormatId;
  name: string;
  description: string;
  meta: string[];
  action: string;
  icon: LucideIcon;
  featured: boolean;
  aspect: string; // CSS aspect-ratio for thumbnails
  aspectLabel: string;
  status: "active" | "soon";
};

export const formats: ContentFormat[] = [
  { id: "story", name: "Story", description: "Crie uma sequência rápida e envolvente para seus Stories.", meta: ["9:16", "Instagram e Facebook"], action: "Criar Story", icon: Smartphone, featured: true, aspect: "9 / 16", aspectLabel: "9:16", status: "active" },
  { id: "reel", name: "Reel", description: "Transforme uma ideia em um roteiro para vídeo curto.", meta: ["9:16", "Vídeo curto"], action: "Criar Reel", icon: Clapperboard, featured: true, aspect: "9 / 16", aspectLabel: "9:16", status: "active" },
  { id: "carrossel", name: "Carrossel", description: "Explique, ensine ou apresente uma oferta em várias páginas.", meta: ["5 a 10 páginas", "Instagram"], action: "Criar carrossel", icon: GalleryHorizontal, featured: true, aspect: "4 / 5", aspectLabel: "4:5", status: "active" },
  { id: "post", name: "Post para feed", description: "Gere uma publicação visual para o feed da sua marca.", meta: ["1:1 ou 4:5", "Instagram"], action: "Criar post", icon: Square, featured: false, aspect: "1 / 1", aspectLabel: "1:1", status: "active" },
  { id: "facebook", name: "Publicação para Facebook", description: "Crie uma publicação adaptada ao público da sua página.", meta: ["Imagem e texto", "Facebook"], action: "Criar publicação", icon: Facebook, featured: false, aspect: "1.91 / 1", aspectLabel: "1.91:1", status: "active" },
  { id: "tiktok", name: "TikTok", description: "Crie um vídeo curto vertical para o TikTok.", meta: ["9:16", "Vídeo curto"], action: "Criar TikTok", icon: Music2, featured: false, aspect: "9 / 16", aspectLabel: "9:16", status: "active" },
  { id: "linkedin", name: "Post para LinkedIn", description: "Compartilhe uma publicação profissional no LinkedIn.", meta: ["1:1", "LinkedIn"], action: "Criar post", icon: Linkedin, featured: false, aspect: "1 / 1", aspectLabel: "1:1", status: "active" },
];

export const getFormat = (id: string) => formats.find((f) => f.id === id);

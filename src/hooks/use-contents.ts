import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { mockContents, type ContentItem, type ContentStatus } from "@/data/mock-content";
import type { FormatId } from "@/data/formats";

const STORAGE_KEY = "criativo:contents:v1";
const SEEDED_KEY = "criativo:contents:seeded:v1";

export type ContentDraft = {
  title: string;
  format: FormatId;
  body?: string;
  cta?: string;
  imageDataUrl?: string | null;
  status?: ContentStatus;
};

function loadInitial(): ContentItem[] {
  const stored = readStorage<ContentItem[] | null>(STORAGE_KEY, null);
  if (stored) return stored;
  // First visit: seed with the demo content so the app does not look empty.
  if (typeof window !== "undefined" && !readStorage<boolean>(SEEDED_KEY, false)) {
    writeStorage(STORAGE_KEY, mockContents);
    writeStorage(SEEDED_KEY, true);
    return mockContents;
  }
  return [];
}

export function useContents() {
  const [items, setItems] = useState<ContentItem[]>(() => loadInitial());

  // Re-sync once on mount in case SSR produced an empty list but the browser has data.
  useEffect(() => {
    const stored = readStorage<ContentItem[] | null>(STORAGE_KEY, null);
    if (stored) setItems(stored);
  }, []);

  const persist = useCallback((next: ContentItem[]) => {
    setItems(next);
    writeStorage(STORAGE_KEY, next);
  }, []);

  const create = useCallback(
    (draft: ContentDraft): ContentItem => {
      const item: ContentItem = {
        id: `u_${Date.now().toString(36)}`,
        title: draft.title,
        format: draft.format,
        status: draft.status ?? "rascunho",
        updatedAt: new Date().toISOString(),
        progress: draft.status === "pronto" ? 100 : 40,
        body: draft.body,
        cta: draft.cta,
        imageDataUrl: draft.imageDataUrl ?? null,
      };
      persist([item, ...items]);
      return item;
    },
    [items, persist],
  );

  const update = useCallback(
    (id: string, patch: Partial<ContentItem>): ContentItem | null => {
      let updated: ContentItem | null = null;
      const next = items.map((c) => {
        if (c.id !== id) return c;
        updated = { ...c, ...patch, updatedAt: new Date().toISOString() };
        return updated;
      });
      persist(next);
      return updated;
    },
    [items, persist],
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((c) => c.id !== id));
    },
    [items, persist],
  );

  const getById = useCallback((id: string) => items.find((c) => c.id === id) ?? null, [items]);

  return { items, create, update, remove, getById };
}

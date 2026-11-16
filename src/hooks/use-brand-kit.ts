import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { emptyBrandKit, type BrandKit } from "@/brand-kit/types";

const STORAGE_KEY = "criativo:brand-kit:v1";

function isConfigured(kit: BrandKit): boolean {
  const { logoUrl, colors, typography, guidelines } = kit;
  return Boolean(
    logoUrl ||
      colors.primary ||
      colors.secondary ||
      colors.accent ||
      typography.heading ||
      typography.body ||
      guidelines.trim(),
  );
}

export function useBrandKit() {
  const [kit, setKit] = useState<BrandKit>(() => readStorage<BrandKit>(STORAGE_KEY, emptyBrandKit));

  useEffect(() => {
    const stored = readStorage<BrandKit | null>(STORAGE_KEY, null);
    if (stored) setKit(stored);
  }, []);

  const save = useCallback((next: BrandKit) => {
    const withStatus: BrandKit = { ...next, status: isConfigured(next) ? "configured" : "not_configured" };
    setKit(withStatus);
    writeStorage(STORAGE_KEY, withStatus);
  }, []);

  const reset = useCallback(() => {
    setKit(emptyBrandKit);
    writeStorage(STORAGE_KEY, emptyBrandKit);
  }, []);

  return { kit, save, reset };
}

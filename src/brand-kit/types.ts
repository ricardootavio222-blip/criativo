// CLIENT BRAND KIT
// These values style ONLY generated social media creatives (renders/previews of posts).
// They must never be applied to the application interface.
export type BrandKit = {
  status: "not_configured" | "configured";
  logoUrl: string | null;
  colors: { primary: string | null; secondary: string | null; accent: string | null };
  typography: { heading: string | null; body: string | null };
  guidelines: string;
};

export const emptyBrandKit: BrandKit = {
  status: "not_configured",
  logoUrl: null,
  colors: { primary: null, secondary: null, accent: null },
  typography: { heading: null, body: null },
  guidelines: "",
};

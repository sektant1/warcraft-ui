let _assetsBaseUrl: string | null = null;

/**
 * Set where game assets (BLP/MDX/PNG) are served from, e.g.
 * `setAssetsBaseUrl("https://cdn.example.com/wc3-assets/")`.
 * Defaults to Vite's `BASE_URL`.
 */
export function setAssetsBaseUrl(url: string): void {
  _assetsBaseUrl = url;
}

/**
 * Resolve an asset path ("bars/x.blp", "./bars/x.blp" or "/bars/x.blp")
 * against the configured base URL. Absolute URLs (http:, https:, data:,
 * blob:) are returned unchanged.
 */
export function resolveAssetPath(path: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path;
  const base = _assetsBaseUrl ?? import.meta.env.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base : base + "/";
  const cleanPath = path.replace(/^(?:\.\/)+/, "").replace(/^\/+/, "");
  return cleanBase + cleanPath;
}

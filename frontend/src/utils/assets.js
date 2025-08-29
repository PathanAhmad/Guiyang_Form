export function assetUrl(path) {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || '/';
  // Normalize slashes
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}



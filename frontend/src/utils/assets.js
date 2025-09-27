let deliveryBase = '';
let defaultFolder = '';

export function setAssetConfig({ base, folder } = {}) {
  deliveryBase = base || '';
  defaultFolder = folder || '';
}

export function assetUrl(path) {
  if (!path) return '';
  if (!deliveryBase) return path;

  // If path already looks like an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;

  // Normalize local Images path like '/Images/Logo.png' or 'src/Images/..'
  const normalized = path.replace(/^\/*(frontend\/)?(src\/)?(public\/)?/i, '').replace(/^Images\//i, '');

  // Cloudinary public id without extension; for simplicity keep extension which Cloudinary supports
  const withFolder = defaultFolder ? `${defaultFolder}/${normalized}` : normalized;
  return `${deliveryBase}/${withFolder}`;
}


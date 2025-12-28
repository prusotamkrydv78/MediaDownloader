export type Platform = 'youtube' | 'instagram' | 'pinterest' | 'unknown';

export function detectPlatformFromUrl(url: string): Platform {
  if (!url || url.trim() === '') {
    return 'unknown';
  }

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube';
  }

  if (lowerUrl.includes('instagram.com')) {
    return 'instagram';
  }

  if (lowerUrl.includes('pinterest.com') || lowerUrl.includes('pin.it')) {
    return 'pinterest';
  }

  return 'unknown';
}

export function getPlatformName(platform: Platform): string {
  switch (platform) {
    case 'youtube':
      return 'YouTube';
    case 'instagram':
      return 'Instagram';
    case 'pinterest':
      return 'Pinterest';
    default:
      return 'Auto-detect';
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}


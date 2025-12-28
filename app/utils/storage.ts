// Simple in-memory storage for demo purposes
// In production, replace with AsyncStorage or expo-secure-store

let storage: Record<string, string> = {};

const STORAGE_KEYS = {
  RECENT_URLS: 'recent_urls',
  DOWNLOAD_STATS: 'download_stats',
  SETTINGS: 'app_settings',
};

export async function saveRecentUrl(url: string) {
  try {
    const recentUrls = await getRecentUrls();
    const updatedUrls = [url, ...recentUrls.filter((u) => u !== url)].slice(0, 10);
    storage[STORAGE_KEYS.RECENT_URLS] = JSON.stringify(updatedUrls);
  } catch (error) {
    console.error('Error saving recent URL:', error);
  }
}

export async function getRecentUrls(): Promise<string[]> {
  try {
    const data = storage[STORAGE_KEYS.RECENT_URLS];
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recent URLs:', error);
    return [];
  }
}

export async function clearRecentUrls() {
  try {
    delete storage[STORAGE_KEYS.RECENT_URLS];
  } catch (error) {
    console.error('Error clearing recent URLs:', error);
  }
}

export async function updateDownloadStats(type: 'success' | 'failed' | 'total') {
  try {
    const stats = await getDownloadStats();
    if (type === 'success') {
      stats.successful++;
      stats.total++;
    } else if (type === 'failed') {
      stats.failed++;
      stats.total++;
    } else {
      stats.total++;
    }
    storage[STORAGE_KEYS.DOWNLOAD_STATS] = JSON.stringify(stats);
  } catch (error) {
    console.error('Error updating download stats:', error);
  }
}

export async function getDownloadStats() {
  try {
    const data = storage[STORAGE_KEYS.DOWNLOAD_STATS];
    return data
      ? JSON.parse(data)
      : { successful: 0, failed: 0, total: 0 };
  } catch (error) {
    console.error('Error getting download stats:', error);
    return { successful: 0, failed: 0, total: 0 };
  }
}

export async function saveSettings(settings: any) {
  try {
    storage[STORAGE_KEYS.SETTINGS] = JSON.stringify(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export async function getSettings() {
  try {
    const data = storage[STORAGE_KEYS.SETTINGS];
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
}


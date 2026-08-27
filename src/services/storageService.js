const STORAGE_KEYS = {
  CUSTOM_SHEET_URL: 'japan_masjid_custom_sheet_url',
  CACHED_MASJIDS: 'japan_masjid_cached_data',
  ACTIVE_DATA_SOURCE: 'japan_masjid_data_source_type', // 'default' | 'google_sheet' | 'custom_csv'
  SAVED_FAVORITES: 'japan_masjid_favorites'
};

export const storageService = {
  getCustomSheetUrl() {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_SHEET_URL) || '';
  },

  setCustomSheetUrl(url) {
    if (url) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SHEET_URL, url);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_DATA_SOURCE, 'google_sheet');
    } else {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_SHEET_URL);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_DATA_SOURCE, 'default');
    }
  },

  getCachedMasjids() {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CACHED_MASJIDS);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  },

  setCachedMasjids(masjids, source = 'default') {
    try {
      localStorage.setItem(STORAGE_KEYS.CACHED_MASJIDS, JSON.stringify(masjids));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_DATA_SOURCE, source);
    } catch (e) {
      console.warn('LocalStorage limit reached for cached masjids', e);
    }
  },

  getActiveDataSource() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_DATA_SOURCE) || 'default';
  },

  clearCustomSource() {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_SHEET_URL);
    localStorage.removeItem(STORAGE_KEYS.CACHED_MASJIDS);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DATA_SOURCE, 'default');
  },

  getFavorites() {
    try {
      const favs = localStorage.getItem(STORAGE_KEYS.SAVED_FAVORITES);
      return favs ? JSON.parse(favs) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(id) {
    const favs = this.getFavorites();
    const index = favs.indexOf(id);
    let updated;
    if (index >= 0) {
      updated = favs.filter(item => item !== id);
    } else {
      updated = [...favs, id];
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_FAVORITES, JSON.stringify(updated));
    return updated;
  }
};

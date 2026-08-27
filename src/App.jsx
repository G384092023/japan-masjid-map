import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { JapanMap } from './components/JapanMap';
import { PrefectureView } from './components/PrefectureView';
import { MasjidCard } from './components/MasjidCard';
import { MasjidModal } from './components/MasjidModal';
import { DataSyncModal } from './components/DataSyncModal';
import { PREFECTURES, PREFECTURE_MAP, REGIONS } from './data/prefectures';
import { DEFAULT_MASJIDS } from './data/defaultMasjids';
import { fetchAndParseCsv } from './services/csvParser';
import { storageService } from './services/storageService';
import { Search, Filter, Sparkles, MapPin, Building2, Globe, Heart } from 'lucide-react';

// Cache key with versioning to prevent stale data
const CACHE_KEY = 'japan_masjid_data_v3';

export default function App() {
  const [masjids, setMasjids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSourceType, setDataSourceType] = useState('default');
  
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);
  const [selectedMasjid, setSelectedMasjid] = useState(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');
  
  const [theme, setTheme] = useState(() => localStorage.getItem('japan_masjid_theme') || 'dark');
  const [favorites, setFavorites] = useState(() => storageService.getFavorites());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'grid'

  // Apply theme attribute to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('japan_masjid_theme', theme);
  }, [theme]);

  // Initial Data Loading (Checks custom Sheet URL, or uses verified DEFAULT_MASJIDS)
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      const customSheetUrl = storageService.getCustomSheetUrl();

      try {
        if (customSheetUrl) {
          // Try loading from custom live Google Sheets
          const { masjids: loaded } = await fetchAndParseCsv(customSheetUrl);
          setMasjids(loaded);
          setDataSourceType('google_sheet');
          storageService.setCachedMasjids(loaded, 'google_sheet');
        } else {
          // Use verified default dataset with exact coordinates
          setMasjids(DEFAULT_MASJIDS);
          setDataSourceType('default');
          storageService.setCachedMasjids(DEFAULT_MASJIDS, 'default');
        }
      } catch (err) {
        console.error('Error fetching sheet, falling back to default dataset:', err);
        setMasjids(DEFAULT_MASJIDS);
        setDataSourceType('default');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleToggleFavorite = (id) => {
    const updated = storageService.toggleFavorite(id);
    setFavorites(updated);
  };

  const handleDataUpdated = (updatedMasjids, sourceType) => {
    setMasjids(updatedMasjids);
    setDataSourceType(sourceType);
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = './data/japan_masjids_starter.csv';
    link.download = 'japan_masjids_starter.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group masjids by prefecture ID
  const masjidsByPrefecture = useMemo(() => {
    const map = {};
    PREFECTURES.forEach(p => {
      map[p.id.toLowerCase()] = [];
    });

    masjids.forEach(m => {
      const prefKey = (m.prefecture || '').toLowerCase();
      if (!map[prefKey]) {
        map[prefKey] = [];
      }
      map[prefKey].push(m);
    });

    return map;
  }, [masjids]);

  // Count of covered prefectures
  const coveredPrefecturesCount = useMemo(() => {
    let count = 0;
    PREFECTURES.forEach(p => {
      if ((masjidsByPrefecture[p.id.toLowerCase()] || []).length > 0) {
        count++;
      }
    });
    return count;
  }, [masjidsByPrefecture]);

  // Global search filtering across Japan
  const searchResults = useMemo(() => {
    if (!globalSearch.trim() && !showFavoritesOnly && selectedRegionFilter === 'ALL') {
      return null;
    }

    return masjids.filter(m => {
      if (showFavoritesOnly && !favorites.includes(m.id)) {
        return false;
      }

      if (selectedRegionFilter !== 'ALL' && m.region.toLowerCase() !== selectedRegionFilter.toLowerCase()) {
        return false;
      }

      if (globalSearch.trim()) {
        const query = globalSearch.toLowerCase();
        return (
          m.name.toLowerCase().includes(query) ||
          (m.name_jp && m.name_jp.includes(query)) ||
          m.prefecture.toLowerCase().includes(query) ||
          (m.prefecture_jp && m.prefecture_jp.includes(query)) ||
          (m.address && m.address.toLowerCase().includes(query)) ||
          (m.contact_person && m.contact_person.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [masjids, globalSearch, showFavoritesOnly, favorites, selectedRegionFilter]);

  return (
    <div className="app-container">
      {/* Top Navigation Header */}
      <Header
        onOpenSync={() => setIsSyncModalOpen(true)}
        onDownloadTemplate={handleDownloadTemplate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        dataSourceType={dataSourceType}
        onResetView={() => {
          setSelectedPrefecture(null);
          setGlobalSearch('');
          setShowFavoritesOnly(false);
        }}
      />

      {/* Metrics Bar */}
      <StatsBar
        totalMasjids={masjids.length}
        coveredPrefecturesCount={coveredPrefecturesCount}
        dataSourceType={dataSourceType}
        onResetToDefault={() => setIsSyncModalOpen(true)}
        activePrefecture={selectedPrefecture}
      />

      {/* Search & Region Control Bar */}
      <div className="search-controls-wrapper glass-panel">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search masjids, city, prefecture (e.g. Tokyo, Kyoto, Camii, Kobe, halal)..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              if (selectedPrefecture && e.target.value.trim()) {
                // If user starts global search, allow searching across all
              }
            }}
          />
        </div>

        {/* Region Filter Pills */}
        <div className="filter-pills-row">
          <button
            className={`filter-pill ${selectedRegionFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedRegionFilter('ALL')}
          >
            All Regions (日本全国)
          </button>
          {REGIONS.map((region) => (
            <button
              key={region.id}
              className={`filter-pill ${selectedRegionFilter === region.name ? 'active' : ''}`}
              onClick={() => setSelectedRegionFilter(region.name)}
            >
              <span>{region.name}</span>
              <span className="jp-text" style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '4px' }}>
                {region.name_jp}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Tier Content Section */}
      {loading ? (
        <div className="empty-state-box glass-panel">
          <div className="stat-icon-wrap" style={{ width: '56px', height: '56px' }}>
            <Globe size={30} className="animate-spin" />
          </div>
          <h3 style={{ fontSize: '1.25rem' }}>Loading Japan Masjid Map...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Parsing prayer locations and prefecture boundaries
          </p>
        </div>
      ) : searchResults ? (
        /* Global Search Results List */
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {showFavoritesOnly ? 'Saved Prayer Spaces' : 'Search Results across Japan'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing {searchResults.length} matching locations
              </p>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                setGlobalSearch('');
                setShowFavoritesOnly(false);
                setSelectedRegionFilter('ALL');
              }}
            >
              Clear Search & Show Map
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {searchResults.length > 0 ? (
              searchResults.map((m) => (
                <MasjidCard
                  key={m.id}
                  masjid={m}
                  onSelect={setSelectedMasjid}
                  isFavorite={favorites.includes(m.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            ) : (
              <div className="empty-state-box glass-card" style={{ gridColumn: '1 / -1' }}>
                <Building2 size={40} style={{ color: 'var(--text-muted)' }} />
                <h4>No prayer spaces matched your criteria</h4>
                <p style={{ fontSize: '0.85rem' }}>Try searching by prefecture name or a different keyword.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Standard View: Interactive Map (Level 1) + Selected Prefecture Focus (Level 2) */
        <div className="main-view-grid">
          {/* Level 1: Japan Prefecture Map Component */}
          <JapanMap
            masjids={masjids}
            masjidsByPrefecture={masjidsByPrefecture}
            selectedPrefecture={selectedPrefecture}
            onSelectPrefecture={(prefId) => {
              setSelectedPrefecture(prefId);
            }}
            onSelectMasjid={setSelectedMasjid}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
          />

          {/* Level 2: Prefecture Focus View or Overview Sidebar */}
          {selectedPrefecture ? (
            <PrefectureView
              selectedPrefectureId={selectedPrefecture}
              masjids={masjids}
              onBackToMap={() => setSelectedPrefecture(null)}
              onSelectMasjid={setSelectedMasjid}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            /* Welcome / Overview Card when no prefecture is clicked yet */
            <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={22} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Explore Japan's Masjids</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Click any of the <strong>47 prefectures</strong> on the interactive map to inspect verified prayer spaces, contact persons, 1-click Google Maps navigation, and community donation channels.
              </p>

              {/* Popular Prefectures Quick-Pills */}
              <div style={{ marginTop: '0.5rem' }}>
                <div className="section-label" style={{ marginBottom: '0.6rem' }}>
                  <MapPin size={13} />
                  <span>Popular Regions & Metro Areas</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Tokyo', 'Osaka', 'Kyoto', 'Hyogo', 'Aichi', 'Fukuoka', 'Kanagawa', 'Hokkaido', 'Saitama', 'Chiba'].map(pName => {
                    const count = (masjidsByPrefecture[pName.toLowerCase()] || []).length;
                    return (
                      <button
                        key={pName}
                        className="pref-chip"
                        onClick={() => setSelectedPrefecture(pName)}
                      >
                        <span>{pName}</span>
                        <span className="pref-chip-badge highlight">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Highlights */}
              <div style={{ marginTop: '0.75rem' }}>
                <div className="section-label" style={{ marginBottom: '0.6rem' }}>
                  <Building2 size={13} />
                  <span>Featured Historical & Major Masjids</span>
                </div>
                <div className="masjid-cards-list" style={{ maxHeight: '360px' }}>
                  {masjids.slice(0, 4).map(m => (
                    <MasjidCard
                      key={m.id}
                      masjid={m}
                      onSelect={setSelectedMasjid}
                      isFavorite={favorites.includes(m.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Masjid Full Detail Modal */}
      {selectedMasjid && (
        <MasjidModal
          masjid={selectedMasjid}
          onClose={() => setSelectedMasjid(null)}
        />
      )}

      {/* Google Sheets / CSV Data Synchronization Modal */}
      <DataSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onDataUpdated={handleDataUpdated}
        currentSourceType={dataSourceType}
      />

      {/* Footer */}
      <footer className="footer-note">
        <div>
          Japan Masjid & Prayer Space Interactive Map • Free Web App Ready for Vercel / Render / GitHub Pages
        </div>
        <div style={{ opacity: 0.75 }}>
          Data can be updated via Google Sheets CSV synchronization or direct file upload.
        </div>
      </footer>
    </div>
  );
}

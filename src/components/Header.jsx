import React from 'react';
import { MapPin, Database, Download, Moon, Sun, Heart, Sparkles } from 'lucide-react';

export function Header({
  onOpenSync,
  onDownloadTemplate,
  theme,
  onToggleTheme,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  dataSourceType,
  onResetView
}) {
  return (
    <header className="header-wrapper glass-panel">
      <div className="brand-section" onClick={onResetView} title="Reset to All Japan Map">
        <div className="brand-logo-badge">
          <MapPin size={26} />
        </div>
        <div className="brand-title-group">
          <h1>
            Japan Masjid Map
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
              ★ 日本全国モスク
            </span>
          </h1>
          <p>Interactive 47 Prefectures Prayer Locations & Community Guide</p>
        </div>
      </div>

      <div className="header-actions">
        {favoritesCount > 0 && (
          <button
            className={`btn-secondary ${showFavoritesOnly ? 'active' : ''}`}
            onClick={onToggleFavoritesOnly}
            style={{
              borderColor: showFavoritesOnly ? 'var(--accent-amber)' : 'var(--border-glass)',
              color: showFavoritesOnly ? 'var(--accent-amber)' : 'var(--text-main)'
            }}
          >
            <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
            <span>Saved ({favoritesCount})</span>
          </button>
        )}

        <button className="btn-secondary" onClick={onDownloadTemplate} title="Download CSV Template to edit in Excel or Google Sheets">
          <Download size={16} />
          <span>CSV Template</span>
        </button>

        <button className="btn-primary" onClick={onOpenSync} title="Connect your Google Sheet or upload custom CSV">
          <Database size={16} />
          <span>
            {dataSourceType === 'google_sheet' ? 'Google Sheet Synced' : dataSourceType === 'custom_csv' ? 'Custom CSV Loaded' : 'Data & Sheets Sync'}
          </span>
        </button>

        <button className="btn-icon" onClick={onToggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}

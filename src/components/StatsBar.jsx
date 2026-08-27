import React from 'react';
import { Building2, Compass, Layers, CheckCircle2, RefreshCw } from 'lucide-react';

export function StatsBar({
  totalMasjids,
  coveredPrefecturesCount,
  dataSourceType,
  onResetToDefault,
  activePrefecture
}) {
  return (
    <div className="stats-bar-grid">
      <div className="stat-item glass-card">
        <div className="stat-icon-wrap">
          <Building2 size={22} />
        </div>
        <div className="stat-content">
          <div className="stat-num">{totalMasjids}</div>
          <div className="stat-label">Total Masjids & Musallas</div>
        </div>
      </div>

      <div className="stat-item glass-card">
        <div className="stat-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)' }}>
          <Compass size={22} />
        </div>
        <div className="stat-content">
          <div className="stat-num">{coveredPrefecturesCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 47</span></div>
          <div className="stat-label">Prefectures Covered</div>
        </div>
      </div>

      <div className="stat-item glass-card">
        <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)' }}>
          <Layers size={22} />
        </div>
        <div className="stat-content">
          <div className="stat-num">8</div>
          <div className="stat-label">Regions of Japan</div>
        </div>
      </div>

      <div className="stat-item glass-card" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary-400)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-num" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {dataSourceType === 'google_sheet' ? 'Google Sheet Live' : dataSourceType === 'custom_csv' ? 'Custom CSV File' : 'Verified Dataset'}
            </div>
            <div className="stat-label">Active Data Source</div>
          </div>
        </div>
        {dataSourceType !== 'default' && (
          <button
            className="btn-icon"
            onClick={onResetToDefault}
            title="Reset to default verified dataset"
            style={{ width: '32px', height: '32px' }}
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

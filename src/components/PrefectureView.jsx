import React, { useState, useMemo } from 'react';
import { PREFECTURE_MAP, PREFECTURES } from '../data/prefectures';
import { MasjidCard } from './MasjidCard';
import { ArrowLeft, Search, Filter, Building2, MapPin } from 'lucide-react';

export function PrefectureView({
  selectedPrefectureId,
  masjids,
  onBackToMap,
  onSelectMasjid,
  favorites,
  onToggleFavorite
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const prefMeta = useMemo(() => {
    return PREFECTURES.find(p => p.id.toLowerCase() === (selectedPrefectureId || '').toLowerCase()) || {
      id: selectedPrefectureId,
      name: selectedPrefectureId,
      name_jp: '',
      region: 'Japan'
    };
  }, [selectedPrefectureId]);

  const filteredMasjids = useMemo(() => {
    return masjids.filter(m => {
      // Prefecture match
      const matchesPref = m.prefecture.toLowerCase() === selectedPrefectureId.toLowerCase();
      if (!matchesPref) return false;

      // Category filter
      if (typeFilter !== 'ALL') {
        if (typeFilter === 'MASJID' && !m.type.toLowerCase().includes('masjid') && !m.type.toLowerCase().includes('mosque')) {
          return false;
        }
        if (typeFilter === 'MUSALLA' && !m.type.toLowerCase().includes('musalla')) {
          return false;
        }
        if (typeFilter === 'PRAYER_ROOM' && !m.type.toLowerCase().includes('prayer') && !m.type.toLowerCase().includes('room')) {
          return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          m.name.toLowerCase().includes(query) ||
          (m.name_jp && m.name_jp.includes(query)) ||
          (m.address && m.address.toLowerCase().includes(query)) ||
          (m.contact_person && m.contact_person.toLowerCase().includes(query)) ||
          (m.notes && m.notes.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [masjids, selectedPrefectureId, typeFilter, searchTerm]);

  return (
    <div className="prefecture-focus-panel">
      {/* Prefecture Header */}
      <div className="prefecture-hero-header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button className="btn-icon" onClick={onBackToMap} title="Back to All Japan Map">
            <ArrowLeft size={18} />
          </button>
          <div className="pref-hero-info">
            <h3>
              <span>{prefMeta.name}</span>
              <span className="jp-text" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                {prefMeta.name_jp}
              </span>
            </h3>
            <p>
              {prefMeta.region} Region • {filteredMasjids.length} {filteredMasjids.length === 1 ? 'Location' : 'Locations'} found
            </p>
          </div>
        </div>

        <button className="btn-secondary" onClick={onBackToMap}>
          <span>View All Prefectures</span>
        </button>
      </div>

      {/* Internal Filter & Search for Prefecture */}
      <div className="search-controls-wrapper glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder={`Search prayer spaces in ${prefMeta.name}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills-row">
          <button
            className={`filter-pill ${typeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setTypeFilter('ALL')}
          >
            All Types
          </button>
          <button
            className={`filter-pill ${typeFilter === 'MASJID' ? 'active' : ''}`}
            onClick={() => setTypeFilter('MASJID')}
          >
            Masjids / Mosques
          </button>
          <button
            className={`filter-pill ${typeFilter === 'MUSALLA' ? 'active' : ''}`}
            onClick={() => setTypeFilter('MUSALLA')}
          >
            Musallas
          </button>
          <button
            className={`filter-pill ${typeFilter === 'PRAYER_ROOM' ? 'active' : ''}`}
            onClick={() => setTypeFilter('PRAYER_ROOM')}
          >
            Prayer Rooms
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="masjid-cards-list">
        {filteredMasjids.length > 0 ? (
          filteredMasjids.map((masjid, idx) => (
            <MasjidCard
              key={masjid.id}
              masjid={masjid}
              index={idx}
              onSelect={onSelectMasjid}
              isFavorite={favorites.includes(masjid.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="empty-state-box glass-card">
            <Building2 size={40} style={{ color: 'var(--text-muted)' }} />
            <h4 style={{ color: 'var(--text-main)', fontWeight: 700 }}>No Prayer Locations Found</h4>
            <p style={{ fontSize: '0.85rem' }}>
              {searchTerm
                ? `No matching results for "${searchTerm}" in ${prefMeta.name}.`
                : `Currently no locations recorded for ${prefMeta.name}. You can add entries via the Data Sync modal.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { MapPin, Navigation, Phone, Heart, ChevronRight, User, CircleDollarSign } from 'lucide-react';

export function MasjidCard({
  masjid,
  index,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onMouseEnter,
  onMouseLeave
}) {
  const getTypeClass = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('masjid') || t.includes('mosque')) return 'masjid';
    if (t.includes('musalla')) return 'musalla';
    return 'prayer-room';
  };

  const handleGmapsClick = (e) => {
    e.stopPropagation();
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(masjid.id);
  };

  return (
    <div
      className="masjid-item-card glass-card"
      onClick={() => onSelect(masjid)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="masjid-card-top">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          {typeof index === 'number' && (
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--primary-600)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}
            >
              {index + 1}
            </div>
          )}
          <div className="masjid-name-group">
            <h4>{masjid.name}</h4>
            {masjid.name_jp && <div className="jp-name jp-text">{masjid.name_jp}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className={`type-pill ${getTypeClass(masjid.type)}`}>
            {masjid.type || 'Masjid'}
          </span>
          <button
            className="btn-icon"
            style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }}
            onClick={handleFavClick}
            title={isFavorite ? 'Remove from saved' : 'Save prayer space'}
          >
            <Heart
              size={16}
              fill={isFavorite ? '#f59e0b' : 'none'}
              color={isFavorite ? '#f59e0b' : 'var(--text-muted)'}
            />
          </button>
        </div>
      </div>

      {masjid.address && (
        <div className="masjid-address">
          <MapPin size={15} style={{ flexShrink: 0, color: 'var(--primary-400)' }} />
          <span>{masjid.address}</span>
        </div>
      )}

      {/* Highlights / Badges summary */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.775rem' }}>
        {masjid.contact_person && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
            <User size={13} />
            <span>{masjid.contact_person}</span>
          </span>
        )}
        {masjid.donation_info && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-amber)' }}>
            <CircleDollarSign size={13} />
            <span>Donation Info</span>
          </span>
        )}
      </div>

      <div className="masjid-card-actions">
        <a
          href={masjid.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gmaps-direct"
          onClick={handleGmapsClick}
          title="Open in Google Maps application or website"
        >
          <Navigation size={14} />
          <span>Google Maps</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {masjid.contact_phone && (
            <a
              href={`tel:${masjid.contact_phone}`}
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={handleGmapsClick}
              title={`Call ${masjid.contact_phone}`}
            >
              <Phone size={14} />
            </a>
          )}

          <button
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
            onClick={() => onSelect(masjid)}
          >
            <span>Details</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { JAPAN_REAL_GEO_PATHS } from '../data/japanRealGeoPaths.js';
import { INDIVIDUAL_PREFECTURES } from '../data/individualPrefectures.js';
import { PREFECTURES, REGIONS } from '../data/prefectures';
import { Map, Grid, Plus, Minus, RotateCcw, Navigation, Move, MapPin, Sparkles, ArrowLeft, ZoomIn, ExternalLink } from 'lucide-react';

export function JapanMap({
  masjids = [],
  masjidsByPrefecture = {},
  selectedPrefecture,
  onSelectPrefecture,
  onSelectMasjid,
  highlightedMasjidId,
  viewMode,
  onToggleViewMode
}) {
  const [hoveredPref, setHoveredPref] = useState(null);
  const [hoveredMasjid, setHoveredMasjid] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Pan & Zoom State for current active canvas
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0, moved: false });
  const svgContainerRef = useRef(null);

  // Active individual standalone prefecture data
  const standalonePref = useMemo(() => {
    if (!selectedPrefecture) return null;
    return INDIVIDUAL_PREFECTURES[selectedPrefecture.toLowerCase()] || null;
  }, [selectedPrefecture]);

  const activePrefMeta = useMemo(() => {
    if (!selectedPrefecture) return null;
    return PREFECTURES.find(p => p.id.toLowerCase() === selectedPrefecture.toLowerCase()) || standalonePref;
  }, [selectedPrefecture, standalonePref]);

  // Project masjids onto the dedicated standalone prefecture canvas (800 x 550)
  const standaloneMasjidPins = useMemo(() => {
    if (!standalonePref) return [];

    const prefMasjids = masjids.filter(
      m => (m.prefecture || '').toLowerCase() === standalonePref.id.toLowerCase()
    );

    return prefMasjids.map((m, idx) => {
      const latNum = typeof m.lat === 'number' ? m.lat : parseFloat(m.lat);
      const lngNum = typeof m.lng === 'number' ? m.lng : parseFloat(m.lng);

      let x = 400, y = 275; // Canvas center fallback

      if (!isNaN(lngNum) && !isNaN(latNum)) {
        x = standalonePref.offX + (lngNum - standalonePref.minLng) * standalonePref.scaleX;
        y = standalonePref.offY + (standalonePref.maxLat - latNum) * standalonePref.scaleY;
      } else {
        // Fallback staggered center
        x = 400 + ((idx % 3) - 1) * 35;
        y = 275 + (Math.floor(idx / 3) % 3 - 1) * 35;
      }

      return {
        ...m,
        canvasX: Math.round(x * 10) / 10,
        canvasY: Math.round(y * 10) / 10
      };
    });
  }, [masjids, standalonePref]);

  // Reset transform when switching between All-Japan and Individual Prefecture view
  useEffect(() => {
    setTransform({ k: 1, x: 0, y: 0 });
    setHoveredMasjid(null);
    setHoveredPref(null);
  }, [selectedPrefecture]);

  // Zoom Toolbar helpers
  const handleZoomIn = () => {
    setTransform(prev => {
      const nextK = Math.min(prev.k * 1.35, 6.0);
      const baseW = selectedPrefecture ? 800 : 940;
      const baseH = selectedPrefecture ? 550 : 850;
      return {
        ...prev,
        k: nextK,
        x: prev.x - (baseW * (nextK - prev.k)) / 2,
        y: prev.y - (baseH * (nextK - prev.k)) / 2
      };
    });
  };

  const handleZoomOut = () => {
    setTransform(prev => {
      const nextK = Math.max(prev.k / 1.35, 0.85);
      const baseW = selectedPrefecture ? 800 : 940;
      const baseH = selectedPrefecture ? 550 : 850;
      return {
        ...prev,
        k: nextK,
        x: prev.x - (baseW * (nextK - prev.k)) / 2,
        y: prev.y - (baseH * (nextK - prev.k)) / 2
      };
    });
  };

  const handleResetZoom = () => {
    setTransform({ k: 1, x: 0, y: 0 });
  };

  const handleBackToAllJapan = () => {
    onSelectPrefecture(null);
  };

  // Wheel Zoom (Native non-passive event capture)
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container || viewMode !== 'map') return;

    const onWheelNative = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;

      setTransform(prev => {
        const nextK = Math.min(Math.max(prev.k * zoomFactor, 0.85), 6.0);
        if (nextK === prev.k) return prev;

        const newX = cursorX - (cursorX - prev.x) * (nextK / prev.k);
        const newY = cursorY - (cursorY - prev.y) * (nextK / prev.k);

        return { k: nextK, x: newX, y: newY };
      });
    };

    container.addEventListener('wheel', onWheelNative, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheelNative);
    };
  }, [viewMode, selectedPrefecture]);

  // Drag / Pan Mouse Events
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: transform.x,
      startY: transform.y,
      moved: false
    };
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragStartRef.current.moved = true;
      }
      setTransform(prev => ({
        ...prev,
        x: dragStartRef.current.startX + dx,
        y: dragStartRef.current.startY + dy
      }));
    }

    if ((hoveredPref || hoveredMasjid) && svgContainerRef.current) {
      const parentRect = svgContainerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - parentRect.left,
        y: e.clientY - parentRect.top - 15
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrefectureClick = (prefId) => {
    if (dragStartRef.current.moved) return;
    onSelectPrefecture(prefId);
  };

  const handlePrefectureHover = (e, prefPath) => {
    if (isDragging || selectedPrefecture) return;
    const prefMeta = PREFECTURES.find(p => p.id.toLowerCase() === prefPath.id.toLowerCase()) || prefPath;
    const count = (masjidsByPrefecture[prefPath.id.toLowerCase()] || []).length;
    setHoveredPref({ ...prefMeta, count });
    setHoveredMasjid(null);

    if (svgContainerRef.current) {
      const parentRect = svgContainerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - parentRect.left,
        y: e.clientY - parentRect.top - 15
      });
    }
  };

  const handleMasjidPinClick = (e, masjid) => {
    e.stopPropagation();
    if (dragStartRef.current.moved) return;
    if (onSelectMasjid) {
      onSelectMasjid(masjid);
    }
  };

  const handleMasjidPinHover = (e, masjid) => {
    e.stopPropagation();
    if (isDragging) return;
    setHoveredMasjid(masjid);
    setHoveredPref(null);

    if (svgContainerRef.current) {
      const parentRect = svgContainerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - parentRect.left,
        y: e.clientY - parentRect.top - 15
      });
    }
  };

  return (
    <div className="map-canvas-card glass-panel" style={{ overflow: 'hidden' }}>
      <div className="map-card-header">
        <h2>
          <Map size={20} style={{ color: 'var(--primary-400)' }} />
          <span>
            {selectedPrefecture ? `${selectedPrefecture} Dedicated Prefecture Map` : 'Real Japan Geographic Map'}
          </span>
          {selectedPrefecture ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: 800, marginLeft: '6px' }}>
              ({activePrefMeta?.name_jp || ''}) • {standaloneMasjidPins.length} {standaloneMasjidPins.length === 1 ? 'Location' : 'Locations'}
            </span>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              (Click any prefecture to view its individual map)
            </span>
          )}
        </h2>

        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('map')}
          >
            <Map size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Geographic Map
          </button>
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('grid')}
          >
            <Grid size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Region Grid
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div
          ref={svgContainerRef}
          className="japan-svg-container"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none',
            overscrollBehavior: 'contain',
            position: 'relative',
            background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.55) 0%, rgba(15, 23, 42, 0.85) 100%)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            minHeight: '520px'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            setHoveredPref(null);
            setHoveredMasjid(null);
          }}
        >
          {/* Top-Left: Dedicated Back Button */}
          {selectedPrefecture && (
            <div
              style={{
                position: 'absolute',
                top: '0.85rem',
                left: '0.85rem',
                zIndex: 30,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <button
                className="btn-primary"
                onClick={handleBackToAllJapan}
                style={{
                  fontSize: '0.825rem',
                  padding: '0.45rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  background: 'var(--primary-600)'
                }}
              >
                <ArrowLeft size={16} />
                <span>All Japan Map</span>
              </button>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: 'var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>{selectedPrefecture}</span>
                <span className="jp-text" style={{ color: 'var(--text-secondary)' }}>
                  ({activePrefMeta?.name_jp})
                </span>
              </div>
            </div>
          )}

          {/* Floating Zoom Controls Toolbar */}
          <div
            style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              zIndex: 30,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={handleZoomIn}
              title="Zoom In (+)"
            >
              <Plus size={16} />
            </button>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={handleZoomOut}
              title="Zoom Out (-)"
            >
              <Minus size={16} />
            </button>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={handleResetZoom}
              title="Reset View"
            >
              <RotateCcw size={14} />
            </button>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                textAlign: 'center',
                color: 'var(--text-muted)',
                marginTop: '0.1rem'
              }}
            >
              {Math.round(transform.k * 100)}%
            </div>
          </div>

          {/* Quick Helper Banner */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: '0.85rem',
              zIndex: 20,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              pointerEvents: 'none'
            }}
          >
            <Move size={13} style={{ color: 'var(--primary-400)' }} />
            <span>
              {selectedPrefecture
                ? `Viewing isolated ${selectedPrefecture} map • Click any numbered pin for Google Maps & details`
                : 'Click any prefecture to view its isolated individual map'}
            </span>
          </div>

          {/* LEVEL 2: DEDICATED INDIVIDUAL PREFECTURE MAP CANVAS */}
          {selectedPrefecture && standalonePref ? (
            <svg
              className="japan-map-svg"
              viewBox="0 0 800 550"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', height: '100%', minHeight: '500px' }}
            >
              <defs>
                <filter id="single-pref-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(16, 185, 129, 0.3)" />
                </filter>
                <linearGradient id="single-pref-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#065f46" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>

              <g
                transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}
                style={{ transition: isDragging ? 'none' : 'transform 0.3s ease-out' }}
              >
                {/* Background Watermark Title */}
                <text
                  x="400"
                  y="280"
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.04)"
                  fontSize="48"
                  fontWeight="900"
                  letterSpacing="0.1em"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {standalonePref.name.toUpperCase()}
                </text>

                {/* Individual Standalone Prefecture Polygon */}
                <path
                  d={standalonePref.pathD}
                  fill="url(#single-pref-gradient)"
                  stroke="#34d399"
                  strokeWidth="2.5"
                  filter="url(#single-pref-glow)"
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* Standalone Masjid Pins (Spacious, Numbered, and Clear) */}
                {standaloneMasjidPins.map((masjid, index) => {
                  const isHovered = hoveredMasjid?.id === masjid.id;
                  const isHighlighted = highlightedMasjidId === masjid.id || isHovered;

                  const pinRadius = isHighlighted ? 18 : 15;
                  const fontSize = isHighlighted ? 13 : 11;
                  const shortName = masjid.name.length > 24 ? masjid.name.substring(0, 22) + '…' : masjid.name;

                  return (
                    <g
                      key={`standalone-pin-${masjid.id}`}
                      className="masjid-pin-group"
                      transform={`translate(${masjid.canvasX}, ${masjid.canvasY})`}
                      onClick={(e) => handleMasjidPinClick(e, masjid)}
                      onMouseEnter={(e) => handleMasjidPinHover(e, masjid)}
                      onMouseLeave={() => setHoveredMasjid(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Subtle Pulsing Beacon Halo */}
                      <circle
                        cx="0"
                        cy="0"
                        r={pinRadius * 1.5}
                        fill={isHighlighted ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.25)'}
                        style={{ animation: 'pinPulse 2.2s infinite ease-out' }}
                      />

                      {/* Numbered Outer Pin Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r={pinRadius}
                        fill={isHighlighted ? '#f59e0b' : '#10b981'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        style={{
                          filter: isHighlighted
                            ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.95))'
                            : 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      />

                      {/* Pin Index Number */}
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={fontSize}
                        fill="#ffffff"
                        fontWeight="800"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {index + 1}
                      </text>

                      {/* Floating Name Tag Below Pin (Shows only when hovered / highlighted) */}
                      {isHighlighted && (
                        <g transform={`translate(0, ${pinRadius + 14})`} style={{ pointerEvents: 'none' }}>
                          <rect
                            x={-(shortName.length * 4.2 + 10)}
                            y="-11"
                            width={shortName.length * 8.4 + 20}
                            height="22"
                            rx="11"
                            fill="rgba(15, 23, 42, 0.95)"
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.85))' }}
                          />
                          <text
                            x="0"
                            y="0"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="11"
                            fill="#ffffff"
                            fontWeight="700"
                            style={{ letterSpacing: '0.02em' }}
                          >
                            {shortName}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          ) : (
            /* LEVEL 1: ALL-JAPAN OVERVIEW MAP (Clean 47 Prefectures, No Pins by Default) */
            <svg
              className="japan-map-svg"
              viewBox="0 0 940 850"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="geo-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.4" />
                </filter>
              </defs>

              <g
                transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}
                style={{ transition: isDragging ? 'none' : 'transform 0.3s ease-out' }}
              >
                {/* Okinawa Inset Framing Box */}
                <g className="okinawa-inset-box">
                  <rect
                    x="660"
                    y="580"
                    width="245"
                    height="215"
                    rx="14"
                    fill="rgba(15, 23, 42, 0.6)"
                    stroke="var(--border-glass)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="675"
                    y="605"
                    fill="var(--text-muted)"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    OKINAWA (沖縄)
                  </text>
                </g>

                {/* Ocean Watermark Labels */}
                <g style={{ opacity: 0.12, pointerEvents: 'none' }}>
                  <text x="300" y="260" fill="var(--text-muted)" fontSize="18" fontWeight="800" letterSpacing="0.2em">
                    SEA OF JAPAN (日本海)
                  </text>
                  <text x="540" y="660" fill="var(--text-muted)" fontSize="18" fontWeight="800" letterSpacing="0.2em">
                    PACIFIC OCEAN (太平洋)
                  </text>
                </g>

                {/* 47 Real Coastline Prefecture Paths */}
                <g filter="url(#geo-shadow)">
                  {JAPAN_REAL_GEO_PATHS.map((pref) => {
                    const count = (masjidsByPrefecture[pref.id.toLowerCase()] || []).length;
                    const hasMasjids = count > 0;

                    return (
                      <path
                        key={pref.id}
                        d={pref.d}
                        className={`prefecture-path ${hasMasjids ? 'has-masjids' : ''}`}
                        onClick={() => handlePrefectureClick(pref.id)}
                        onMouseEnter={(e) => handlePrefectureHover(e, pref)}
                        onMouseLeave={() => setHoveredPref(null)}
                      />
                    );
                  })}
                </g>

                {/* Prefecture Labels & Location Count Badges */}
                {JAPAN_REAL_GEO_PATHS.map((pref) => {
                  const count = (masjidsByPrefecture[pref.id.toLowerCase()] || []).length;
                  if (!pref.labelX || !pref.labelY) return null;

                  return (
                    <g
                      key={`label-${pref.id}`}
                      style={{ pointerEvents: 'none' }}
                      transform={`translate(${pref.labelX}, ${pref.labelY})`}
                    >
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="var(--text-main)"
                        fontSize="9.5"
                        fontWeight="700"
                        style={{
                          textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9)',
                          userSelect: 'none'
                        }}
                      >
                        {pref.name}
                      </text>

                      {count > 0 && (
                        <g transform="translate(0, 11)">
                          <rect
                            x="-10"
                            y="-6"
                            width="20"
                            height="12"
                            rx="6"
                            fill="#10b981"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#ffffff"
                            fontSize="8.5"
                            fontWeight="800"
                          >
                            {count}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          )}

          {/* Floating Tooltip for Prefecture (Full map view) */}
          {hoveredPref && !hoveredMasjid && !selectedPrefecture && (
            <div
              className="map-hover-tooltip"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{hoveredPref.name}</span>
                <span className="jp-text" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>
                  ({hoveredPref.name_jp})
                </span>
              </div>
              <div style={{ color: 'var(--primary-400)', fontWeight: 600, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ZoomIn size={12} />
                <span>
                  {hoveredPref.count} {hoveredPref.count === 1 ? 'Location' : 'Locations'} (Click to Open Individual Map)
                </span>
              </div>
            </div>
          )}

          {/* Floating Tooltip for Hovered Masjid Pin */}
          {hoveredMasjid && (
            <div
              className="map-hover-tooltip"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`,
                border: '1px solid var(--accent-amber)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(245, 158, 11, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span className="type-pill masjid" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                  {hoveredMasjid.type || 'Masjid'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {hoveredMasjid.prefecture}
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {hoveredMasjid.name}
              </div>
              {hoveredMasjid.name_jp && (
                <div className="jp-text" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {hoveredMasjid.name_jp}
                </div>
              )}
              {hoveredMasjid.address && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', maxWidth: '240px', whiteSpace: 'normal' }}>
                  {hoveredMasjid.address}
                </div>
              )}
              <div style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.75rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ExternalLink size={12} />
                <span>Click pin for 1-click Google Maps & details</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Region Grid View */
        <div className="region-grid-container">
          {REGIONS.map((region) => {
            const regionPrefs = PREFECTURES.filter(p => p.region_id === region.id);
            const totalInRegion = regionPrefs.reduce((sum, p) => sum + (masjidsByPrefecture[p.id.toLowerCase()] || []).length, 0);

            return (
              <div key={region.id} className="region-group-box">
                <div className="region-group-header">
                  <div className="region-title">
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: region.color
                      }}
                    />
                    <span>{region.name}</span>
                    <span className="jp-text" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                      {region.name_jp}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {totalInRegion} {totalInRegion === 1 ? 'location' : 'locations'}
                  </span>
                </div>

                <div className="prefecture-chip-grid">
                  {regionPrefs.map((pref) => {
                    const count = (masjidsByPrefecture[pref.id.toLowerCase()] || []).length;
                    const isActive = selectedPrefecture && selectedPrefecture.toLowerCase() === pref.id.toLowerCase();

                    return (
                      <button
                        key={pref.id}
                        className={`pref-chip ${isActive ? 'active' : ''}`}
                        onClick={() => onSelectPrefecture(pref.id)}
                      >
                        <span>{pref.name}</span>
                        <span className="jp-text" style={{ opacity: 0.75, fontSize: '0.75rem' }}>
                          {pref.name_jp}
                        </span>
                        <span className={`pref-chip-badge ${count > 0 ? 'highlight' : ''}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

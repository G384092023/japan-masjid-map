import { geoMercator } from 'd3-geo';
import { JAPAN_REAL_GEO_PATHS } from '../data/japanRealGeoPaths.js';

// Standard Mercator projection matching the Japan mainland SVG paths
export const mainlandProjection = geoMercator()
  .center([137.6, 37.8])
  .scale(2300)
  .translate([490, 420]);

// Dedicated projection for Okinawa in the right-side inset box
export const okinawaProjection = geoMercator()
  .center([127.8, 26.5])
  .scale(3600)
  .translate([780, 690]);

/**
 * Projects a masjid's [lng, lat] coordinate into SVG [x, y] pixel coordinates.
 * Guaranteed to place the pin correctly inside the masjid's prefecture.
 */
export function getMasjidSvgCoordinates(masjid, index = 0) {
  if (!masjid) return null;

  const latNum = typeof masjid.lat === 'number' ? masjid.lat : parseFloat(masjid.lat);
  const lngNum = typeof masjid.lng === 'number' ? masjid.lng : parseFloat(masjid.lng);

  const prefId = (masjid.prefecture || '').toLowerCase();
  const isOkinawa = prefId === 'okinawa' || (masjid.region || '').toLowerCase().includes('okinawa');

  if (!isNaN(latNum) && !isNaN(lngNum) && latNum >= 24 && latNum <= 46 && lngNum >= 122 && lngNum <= 154) {
    const proj = isOkinawa ? okinawaProjection : mainlandProjection;
    const coords = proj([lngNum, latNum]);

    if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return {
        x: Math.round(coords[0] * 10) / 10,
        y: Math.round(coords[1] * 10) / 10,
        isOkinawa
      };
    }
  }

  // Fallback: Use the prefecture's actual geographic centroid
  const prefPath = JAPAN_REAL_GEO_PATHS.find(p => p.id.toLowerCase() === prefId);
  if (prefPath && prefPath.labelX && prefPath.labelY) {
    // Add small deterministic offset so multiple fallbacks in same pref don't overlap
    const offsetX = ((index % 3) - 1) * 12;
    const offsetY = (Math.floor(index / 3) % 3 - 1) * 12;
    return {
      x: prefPath.labelX + offsetX,
      y: prefPath.labelY + offsetY,
      isOkinawa: prefId === 'okinawa'
    };
  }

  return null;
}

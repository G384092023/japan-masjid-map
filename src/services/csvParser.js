import Papa from 'papaparse';
import { PREFECTURE_MAP, PREFECTURES } from '../data/prefectures';

/**
 * Standardizes raw CSV row keys and data types into structured Masjid objects.
 */
export function normalizeCsvRows(rawRows) {
  const normalized = [];
  const warnings = [];

  rawRows.forEach((row, index) => {
    // If entire row is empty, skip
    if (!row || Object.keys(row).length === 0) return;
    
    // Create a lowercase key-map for resilient column name matching
    const rowMap = {};
    Object.keys(row).forEach(key => {
      if (key) {
        rowMap[key.trim().toLowerCase().replace(/[\s_-]+/g, '')] = row[key];
      }
    });

    const getField = (...keys) => {
      for (const k of keys) {
        const cleaned = k.toLowerCase().replace(/[\s_-]+/g, '');
        if (rowMap[cleaned] !== undefined && rowMap[cleaned] !== null && String(rowMap[cleaned]).trim() !== '') {
          return String(rowMap[cleaned]).trim();
        }
      }
      return '';
    };

    const name = getField('name', 'masjidname', 'mosquename', 'title', 'place', 'location', 'nama');
    if (!name) {
      // Row might be a header duplicate or blank
      return;
    }

    const rawPrefecture = getField('prefecture', 'pref', 'state', 'province', 'ken', 'prefectureen', 'negeri');
    let matchedPref = null;

    if (rawPrefecture) {
      // Try lookup
      const searchKey = rawPrefecture.toLowerCase().replace(/(prefecture|ken|to|fu|県|府|都|道)/gi, '').trim();
      matchedPref = PREFECTURES.find(p => 
        p.id.toLowerCase() === searchKey ||
        p.name.toLowerCase() === searchKey ||
        p.name_jp.includes(rawPrefecture) ||
        p.kana.includes(rawPrefecture)
      );
    }

    // Fallback: search within address or name if prefecture column was missing or ambiguous
    if (!matchedPref) {
      const address = getField('address', 'fulladdress', 'location', 'alamat');
      matchedPref = PREFECTURES.find(p => 
        address.includes(p.name_jp) || 
        address.toLowerCase().includes(p.name.toLowerCase()) ||
        name.includes(p.name_jp) ||
        name.toLowerCase().includes(p.name.toLowerCase())
      );
    }

    const finalPrefId = matchedPref ? matchedPref.id : (rawPrefecture || 'Tokyo');
    const finalPrefJp = matchedPref ? matchedPref.name_jp : getField('prefecture_jp', 'prefecturejp', 'prefjp');
    const finalRegion = matchedPref ? matchedPref.region : (getField('region', 'area') || 'Kanto');

    const latStr = getField('lat', 'latitude', 'y');
    const lngStr = getField('lng', 'lon', 'longitude', 'x');

    let parsedLat = parseFloat(latStr);
    let parsedLng = parseFloat(lngStr);

    // Validate if within Japan coordinates (Lat 24-46, Lng 122-154)
    if (isNaN(parsedLat) || parsedLat < 24 || parsedLat > 46) {
      parsedLat = matchedPref ? matchedPref.lat : 35.6895;
      // Add slight spread if defaulting so pins don't overlap
      parsedLat += ((index % 5) - 2) * 0.012;
    }

    if (isNaN(parsedLng) || parsedLng < 122 || parsedLng > 154) {
      parsedLng = matchedPref ? matchedPref.lng : 139.6917;
      parsedLng += (((index + 2) % 5) - 2) * 0.012;
    }

    // Build or refine Google Maps URL
    let googleMapsUrl = getField('google_maps_url', 'googlemapsurl', 'mapsurl', 'mapurl', 'googlemaps', 'maps', 'gmap', 'link');
    if (!googleMapsUrl) {
      const address = getField('address', 'fulladdress', 'location', 'alamat');
      const query = encodeURIComponent(`${name} ${address || finalPrefId} Japan`);
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    const type = getField('type', 'category', 'kind') || 'Masjid';
    const id = getField('id') || `masjid-${index}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    normalized.push({
      id,
      name,
      name_jp: getField('name_jp', 'namejp', 'japanesename', 'kanji'),
      type,
      prefecture: finalPrefId,
      prefecture_jp: finalPrefJp,
      region: finalRegion,
      address: getField('address', 'fulladdress', 'location', 'alamat'),
      google_maps_url: googleMapsUrl,
      lat: parsedLat,
      lng: parsedLng,
      contact_person: getField('contact_person', 'contactperson', 'person', 'pic', 'contact', 'admin', 'imam'),
      contact_phone: getField('contact_phone', 'contactphone', 'phone', 'telephone', 'tel', 'mobile', 'hp'),
      contact_whatsapp: getField('contact_whatsapp', 'contactwhatsapp', 'whatsapp', 'wa'),
      contact_email: getField('contact_email', 'contactemail', 'email', 'mail'),
      donation_info: getField('donation_info', 'donationinfo', 'donation', 'bank', 'yucho', 'derma', 'infaq'),
      notes: getField('notes', 'note', 'description', 'info', 'jummah', 'remarks')
    });
  });

  return { masjids: normalized, warnings };
}

/**
 * Parses raw CSV string or URL into normalized masjids array.
 */
export async function parseMasjidCsv(csvContent) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: false,
      complete: (results) => {
        if (results.errors && results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(`CSV parse error: ${results.errors[0].message}`));
          return;
        }
        const { masjids, warnings } = normalizeCsvRows(results.data);
        resolve({ masjids, warnings, rowCount: masjids.length });
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * Fetches and parses CSV from a local path or external URL (e.g. published Google Sheets CSV).
 */
export async function fetchAndParseCsv(url) {
  let fetchUrl = url;

  // If user provided a standard Google Sheets edit link, convert it automatically to public CSV export URL
  if (url.includes('docs.google.com/spreadsheets') && !url.includes('output=csv') && !url.includes('pub?')) {
    const sheetIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetIdMatch && sheetIdMatch[1]) {
      const sheetId = sheetIdMatch[1];
      const gidMatch = url.match(/gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : '0';
      fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }
  }

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Failed to load CSV (${response.status}: ${response.statusText})`);
  }

  const csvText = await response.text();
  return parseMasjidCsv(csvText);
}

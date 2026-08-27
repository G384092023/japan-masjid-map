const fs = require('fs');
const path = require('path');
const d3Geo = require('d3-geo');

const geojsonPath = path.join(__dirname, '..', 'public', 'data', 'japan.geojson');
const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

const width = 940;
const height = 820;

// Optimized Mercator Projection for Japan mainland & major islands
const projection = d3Geo.geoMercator()
  .center([137.6, 37.8])
  .scale(2300)
  .translate([490, 420]);

// Dedicated clear inset projection for Okinawa placed on the RIGHT side
const okinawaProjection = d3Geo.geoMercator()
  .center([127.8, 26.5])
  .scale(3600)
  .translate([780, 690]);

const pathGenerator = d3Geo.geoPath().projection(projection);
const okinawaPathGenerator = d3Geo.geoPath().projection(okinawaProjection);

const prefMapping = [
  { code: 1, id: 'Hokkaido', name: 'Hokkaido', name_jp: '北海道', region: 'Hokkaido', region_id: 'hokkaido' },
  { code: 2, id: 'Aomori', name: 'Aomori', name_jp: '青森県', region: 'Tohoku', region_id: 'tohoku' },
  { code: 3, id: 'Iwate', name: 'Iwate', name_jp: '岩手県', region: 'Tohoku', region_id: 'tohoku' },
  { code: 4, id: 'Miyagi', name: 'Miyagi', name_jp: '宮城県', region: 'Tohoku', region_id: 'tohoku' },
  { code: 5, id: 'Akita', name: 'Akita', name_jp: '秋田県', region: 'Tohoku', region_id: 'tohoku' },
  { code: 6, id: 'Yamagata', name: 'Yamagata', name_jp: '山形県', region: 'Tohoku', region_id: 'tohoku' },
  { code: 7, id: 'Fukushima', name: 'Fukushima', name_jp: '福島県', region: 'Tohoku', region_id: 'tohoku' },
  { code: 8, id: 'Ibaraki', name: 'Ibaraki', name_jp: '茨城県', region: 'Kanto', region_id: 'kanto' },
  { code: 9, id: 'Tochigi', name: 'Tochigi', name_jp: '栃木県', region: 'Kanto', region_id: 'kanto' },
  { code: 10, id: 'Gunma', name: 'Gunma', name_jp: '群馬県', region: 'Kanto', region_id: 'kanto' },
  { code: 11, id: 'Saitama', name: 'Saitama', name_jp: '埼玉県', region: 'Kanto', region_id: 'kanto' },
  { code: 12, id: 'Chiba', name: 'Chiba', name_jp: '千葉県', region: 'Kanto', region_id: 'kanto' },
  { code: 13, id: 'Tokyo', name: 'Tokyo', name_jp: '東京都', region: 'Kanto', region_id: 'kanto' },
  { code: 14, id: 'Kanagawa', name: 'Kanagawa', name_jp: '神奈川県', region: 'Kanto', region_id: 'kanto' },
  { code: 15, id: 'Niigata', name: 'Niigata', name_jp: '新潟県', region: 'Chubu', region_id: 'chubu' },
  { code: 16, id: 'Toyama', name: 'Toyama', name_jp: '富山県', region: 'Chubu', region_id: 'chubu' },
  { code: 17, id: 'Ishikawa', name: 'Ishikawa', name_jp: '石川県', region: 'Chubu', region_id: 'chubu' },
  { code: 18, id: 'Fukui', name: 'Fukui', name_jp: '福井県', region: 'Chubu', region_id: 'chubu' },
  { code: 19, id: 'Yamanashi', name: 'Yamanashi', name_jp: '山梨県', region: 'Chubu', region_id: 'chubu' },
  { code: 20, id: 'Nagano', name: 'Nagano', name_jp: '長野県', region: 'Chubu', region_id: 'chubu' },
  { code: 21, id: 'Gifu', name: 'Gifu', name_jp: '岐阜県', region: 'Chubu', region_id: 'chubu' },
  { code: 22, id: 'Shizuoka', name: 'Shizuoka', name_jp: '静岡県', region: 'Chubu', region_id: 'chubu' },
  { code: 23, id: 'Aichi', name: 'Aichi', name_jp: '愛知県', region: 'Chubu', region_id: 'chubu' },
  { code: 24, id: 'Mie', name: 'Mie', name_jp: '三重県', region: 'Kansai', region_id: 'kansai' },
  { code: 25, id: 'Shiga', name: 'Shiga', name_jp: '滋賀県', region: 'Kansai', region_id: 'kansai' },
  { code: 26, id: 'Kyoto', name: 'Kyoto', name_jp: '京都府', region: 'Kansai', region_id: 'kansai' },
  { code: 27, id: 'Osaka', name: 'Osaka', name_jp: '大阪府', region: 'Kansai', region_id: 'kansai' },
  { code: 28, id: 'Hyogo', name: 'Hyogo', name_jp: '兵庫県', region: 'Kansai', region_id: 'kansai' },
  { code: 29, id: 'Nara', name: 'Nara', name_jp: '奈良県', region: 'Kansai', region_id: 'kansai' },
  { code: 30, id: 'Wakayama', name: 'Wakayama', name_jp: '和歌山県', region: 'Kansai', region_id: 'kansai' },
  { code: 31, id: 'Tottori', name: 'Tottori', name_jp: '鳥取県', region: 'Chugoku', region_id: 'chugoku' },
  { code: 32, id: 'Shimane', name: 'Shimane', name_jp: '島根県', region: 'Chugoku', region_id: 'chugoku' },
  { code: 33, id: 'Okayama', name: 'Okayama', name_jp: '岡山県', region: 'Chugoku', region_id: 'chugoku' },
  { code: 34, id: 'Hiroshima', name: 'Hiroshima', name_jp: '広島県', region: 'Chugoku', region_id: 'chugoku' },
  { code: 35, id: 'Yamaguchi', name: 'Yamaguchi', name_jp: '山口県', region: 'Chugoku', region_id: 'chugoku' },
  { code: 36, id: 'Tokushima', name: 'Tokushima', name_jp: '徳島県', region: 'Shikoku', region_id: 'shikoku' },
  { code: 37, id: 'Kagawa', name: 'Kagawa', name_jp: '香川県', region: 'Shikoku', region_id: 'shikoku' },
  { code: 38, id: 'Ehime', name: 'Ehime', name_jp: '愛媛県', region: 'Shikoku', region_id: 'shikoku' },
  { code: 39, id: 'Kochi', name: 'Kochi', name_jp: '高知県', region: 'Shikoku', region_id: 'shikoku' },
  { code: 40, id: 'Fukuoka', name: 'Fukuoka', name_jp: '福岡県', region: 'Kyushu & Okinawa', region_id: 'kyushu' },
  { code: 41, id: 'Saga', name: 'Saga', name_jp: '佐賀県', region: 'Kyushu & Okinawa', region_id: 'kyushu' },
  { code: 42, id: 'Nagasaki', name: 'Nagasaki', name_jp: '長崎県', region: 'Kyushu & Okinawa', region_id: 'kyushu' },
  { code: 43, id: 'Kumamoto', name: 'Kumamoto', name_jp: '熊本県', region: 'Kyushu & Okinawa', region_id: 'kyushu' },
  { code: 44, id: 'Oita', name: 'Oita', name_jp: '大分県', region: 'Kyushu & Okinawa', region_id: 'kyushu' },
  { code: 45, id: 'Miyazaki', name: 'Miyazaki', name_jp: '宮崎県', region: 'Kyushu & Okinawa', region_id: 'kyushu' },
  { code: 46, id: 'Kagoshima', name: 'Kagoshima', name_jp: '鹿児島県', region: 'Kyushu & Okinawa', region_id: 'kyushu' },
  { code: 47, id: 'Okinawa', name: 'Okinawa', name_jp: '沖縄県', region: 'Kyushu & Okinawa', region_id: 'kyushu' }
];

function filterFeatureGeometry(feature) {
  const prefId = feature.properties.id;
  if (feature.geometry.type === 'MultiPolygon') {
    const filteredPolys = feature.geometry.coordinates.filter(poly => {
      const pt = poly[0][0];
      const lng = pt[0], lat = pt[1];

      // Tokyo mainland filter (exclude remote Ogasawara / Izu archipelago far south)
      if (prefId === 13) return lat > 35.3;
      // Kagoshima filter (keep mainland + Tanegashima / Yakushima, exclude Tokara/Amami at lat < 30.0)
      if (prefId === 46) return lat > 30.0;
      // Hokkaido (exclude far eastern disputed islets)
      if (prefId === 1) return lng < 146.0;
      return true;
    });
    return {
      ...feature,
      geometry: {
        type: 'MultiPolygon',
        coordinates: filteredPolys
      }
    };
  }
  return feature;
}

const paths = [];

geojson.features.forEach(rawFeature => {
  const code = rawFeature.properties.id;
  const meta = prefMapping.find(m => m.code === code);
  if (!meta) return;

  const feature = filterFeatureGeometry(rawFeature);
  const isOkinawa = meta.id === 'Okinawa';
  const generator = isOkinawa ? okinawaPathGenerator : pathGenerator;
  
  const rawD = generator(feature);
  if (!rawD) return;

  const centroid = generator.centroid(feature);
  let labelX = Math.round(centroid[0]);
  let labelY = Math.round(centroid[1]);

  // Fine-tuned label positioning for compact urban areas
  if (meta.id === 'Tokyo') { labelX = 562; labelY = 512; }
  if (meta.id === 'Osaka') { labelX = 406; labelY = 548; }
  if (meta.id === 'Kanagawa') { labelX = 554; labelY = 538; }
  if (meta.id === 'Saitama') { labelX = 552; labelY = 488; }
  if (meta.id === 'Chiba') { labelX = 584; labelY = 525; }
  if (meta.id === 'Kyoto') { labelX = 412; labelY = 510; }
  if (meta.id === 'Aichi') { labelX = 478; labelY = 535; }
  if (meta.id === 'Fukuoka') { labelX = 222; labelY = 560; }
  if (meta.id === 'Kagawa') { labelX = 356; labelY = 562; }
  if (meta.id === 'Okinawa') { labelX = 780; labelY = 665; }

  paths.push({
    id: meta.id,
    code: meta.code,
    name: meta.name,
    name_jp: meta.name_jp,
    region: meta.region,
    region_id: meta.region_id,
    isInset: isOkinawa,
    d: rawD,
    labelX: isNaN(labelX) ? 0 : labelX,
    labelY: isNaN(labelY) ? 0 : labelY
  });
});

paths.sort((a, b) => a.code - b.code);

const targetPath = path.join(__dirname, '..', 'src', 'data', 'japanRealGeoPaths.js');
const outputJs = '// Authentic real geographic coastlines and contours for all 47 Japan Prefectures\n' +
  '// Generated via high-precision D3 Geo Mercator Projection of official GSI Japan GeoJSON\n' +
  'export const JAPAN_REAL_GEO_PATHS = ' + JSON.stringify(paths, null, 2) + ';\n';

fs.writeFileSync(targetPath, outputJs, 'utf8');

console.log('Successfully generated ' + paths.length + ' real prefecture shapes with Okinawa on the right!');

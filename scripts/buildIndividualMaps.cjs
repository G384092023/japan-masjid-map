const fs = require('fs');
const path = require('path');

const geojsonPath = path.join(__dirname, '..', 'public', 'data', 'japan.geojson');
const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

const prefMapping = [
  { code: 1, id: 'Hokkaido', name: 'Hokkaido', name_jp: '北海道', region: 'Hokkaido' },
  { code: 2, id: 'Aomori', name: 'Aomori', name_jp: '青森県', region: 'Tohoku' },
  { code: 3, id: 'Iwate', name: 'Iwate', name_jp: '岩手県', region: 'Tohoku' },
  { code: 4, id: 'Miyagi', name: 'Miyagi', name_jp: '宮城県', region: 'Tohoku' },
  { code: 5, id: 'Akita', name: 'Akita', name_jp: '秋田県', region: 'Tohoku' },
  { code: 6, id: 'Yamagata', name: 'Yamagata', name_jp: '山形県', region: 'Tohoku' },
  { code: 7, id: 'Fukushima', name: 'Fukushima', name_jp: '福島県', region: 'Tohoku' },
  { code: 8, id: 'Ibaraki', name: 'Ibaraki', name_jp: '茨城県', region: 'Kanto' },
  { code: 9, id: 'Tochigi', name: 'Tochigi', name_jp: '栃木県', region: 'Kanto' },
  { code: 10, id: 'Gunma', name: 'Gunma', name_jp: '群馬県', region: 'Kanto' },
  { code: 11, id: 'Saitama', name: 'Saitama', name_jp: '埼玉県', region: 'Kanto' },
  { code: 12, id: 'Chiba', name: 'Chiba', name_jp: '千葉県', region: 'Kanto' },
  { code: 13, id: 'Tokyo', name: 'Tokyo', name_jp: '東京都', region: 'Kanto' },
  { code: 14, id: 'Kanagawa', name: 'Kanagawa', name_jp: '神奈川県', region: 'Kanto' },
  { code: 15, id: 'Niigata', name: 'Niigata', name_jp: '新潟県', region: 'Chubu' },
  { code: 16, id: 'Toyama', name: 'Toyama', name_jp: '富山県', region: 'Chubu' },
  { code: 17, id: 'Ishikawa', name: 'Ishikawa', name_jp: '石川県', region: 'Chubu' },
  { code: 18, id: 'Fukui', name: 'Fukui', name_jp: '福井県', region: 'Chubu' },
  { code: 19, id: 'Yamanashi', name: 'Yamanashi', name_jp: '山梨県', region: 'Chubu' },
  { code: 20, id: 'Nagano', name: 'Nagano', name_jp: '長野県', region: 'Chubu' },
  { code: 21, id: 'Gifu', name: 'Gifu', name_jp: '岐阜県', region: 'Chubu' },
  { code: 22, id: 'Shizuoka', name: 'Shizuoka', name_jp: '静岡県', region: 'Chubu' },
  { code: 23, id: 'Aichi', name: 'Aichi', name_jp: '愛知県', region: 'Chubu' },
  { code: 24, id: 'Mie', name: 'Mie', name_jp: '三重県', region: 'Kansai' },
  { code: 25, id: 'Shiga', name: 'Shiga', name_jp: '滋賀県', region: 'Kansai' },
  { code: 26, id: 'Kyoto', name: 'Kyoto', name_jp: '京都府', region: 'Kansai' },
  { code: 27, id: 'Osaka', name: 'Osaka', name_jp: '大阪府', region: 'Kansai' },
  { code: 28, id: 'Hyogo', name: 'Hyogo', name_jp: '兵庫県', region: 'Kansai' },
  { code: 29, id: 'Nara', name: 'Nara', name_jp: '奈良県', region: 'Kansai' },
  { code: 30, id: 'Wakayama', name: 'Wakayama', name_jp: '和歌山県', region: 'Kansai' },
  { code: 31, id: 'Tottori', name: 'Tottori', name_jp: '鳥取県', region: 'Chugoku' },
  { code: 32, id: 'Shimane', name: 'Shimane', name_jp: '島根県', region: 'Chugoku' },
  { code: 33, id: 'Okayama', name: 'Okayama', name_jp: '岡山県', region: 'Chugoku' },
  { code: 34, id: 'Hiroshima', name: 'Hiroshima', name_jp: '広島県', region: 'Chugoku' },
  { code: 35, id: 'Yamaguchi', name: 'Yamaguchi', name_jp: '山口県', region: 'Chugoku' },
  { code: 36, id: 'Tokushima', name: 'Tokushima', name_jp: '徳島県', region: 'Shikoku' },
  { code: 37, id: 'Kagawa', name: 'Kagawa', name_jp: '香川県', region: 'Shikoku' },
  { code: 38, id: 'Ehime', name: 'Ehime', name_jp: '愛媛県', region: 'Shikoku' },
  { code: 39, id: 'Kochi', name: 'Kochi', name_jp: '高知県', region: 'Shikoku' },
  { code: 40, id: 'Fukuoka', name: 'Fukuoka', name_jp: '福岡県', region: 'Kyushu' },
  { code: 41, id: 'Saga', name: 'Saga', name_jp: '佐賀県', region: 'Kyushu' },
  { code: 42, id: 'Nagasaki', name: 'Nagasaki', name_jp: '長崎県', region: 'Kyushu' },
  { code: 43, id: 'Kumamoto', name: 'Kumamoto', name_jp: '熊本県', region: 'Kyushu' },
  { code: 44, id: 'Oita', name: 'Oita', name_jp: '大分県', region: 'Kyushu' },
  { code: 45, id: 'Miyazaki', name: 'Miyazaki', name_jp: '宮崎県', region: 'Kyushu' },
  { code: 46, id: 'Kagoshima', name: 'Kagoshima', name_jp: '鹿児島県', region: 'Kyushu' },
  { code: 47, id: 'Okinawa', name: 'Okinawa', name_jp: '沖縄県', region: 'Kyushu' }
];

const W = 800, H = 550, pad = 50;
const result = {};

geojson.features.forEach((feature) => {
  const code = feature.properties.id;
  const meta = prefMapping.find(m => m.code === code);
  if (!meta) return;

  let geom = feature.geometry;
  if (meta.id === 'Tokyo' && geom.type === 'MultiPolygon') {
    // Mainland Tokyo (lat >= 35.3)
    const mainlandPolys = geom.coordinates.filter(poly => {
      const firstPt = poly[0][0];
      return firstPt[1] >= 35.3;
    });
    geom = { type: 'MultiPolygon', coordinates: mainlandPolys };
  } else if (meta.id === 'Okinawa' && geom.type === 'MultiPolygon') {
    // Okinawa main island
    const okinawaMain = geom.coordinates.filter(poly => {
      const pt = poly[0][0];
      return pt[1] >= 25.8 && pt[1] <= 27.2 && pt[0] >= 127.4 && pt[0] <= 128.5;
    });
    if (okinawaMain.length > 0) geom = { type: 'MultiPolygon', coordinates: okinawaMain };
  }

  // Calculate lng/lat bounds
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  function scan(arr) {
    if (typeof arr[0] === 'number' && typeof arr[1] === 'number') {
      const [lng, lat] = arr;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else if (Array.isArray(arr)) {
      arr.forEach(scan);
    }
  }
  scan(geom.coordinates);

  const dLng = maxLng - minLng;
  const dLat = maxLat - minLat;
  const cosLat = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
  const geoAspect = (dLng * cosLat) / dLat;
  const canvasAspect = (W - 2 * pad) / (H - 2 * pad);

  let scaleX, scaleY, offX, offY;
  if (geoAspect > canvasAspect) {
    scaleX = (W - 2 * pad) / dLng;
    scaleY = scaleX / cosLat;
    offX = pad;
    offY = (H - dLat * scaleY) / 2;
  } else {
    scaleY = (H - 2 * pad) / dLat;
    scaleX = scaleY * cosLat;
    offX = (W - dLng * scaleX) / 2;
    offY = pad;
  }

  // Generate SVG path directly using projected coordinates
  const project = (pt) => {
    const x = offX + (pt[0] - minLng) * scaleX;
    const y = offY + (maxLat - pt[1]) * scaleY;
    return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
  };

  let pathD = '';
  if (geom.type === 'Polygon') {
    pathD = geom.coordinates.map(ring => 'M' + ring.map(project).join('L') + 'Z').join(' ');
  } else if (geom.type === 'MultiPolygon') {
    pathD = geom.coordinates.map(poly => poly.map(ring => 'M' + ring.map(project).join('L') + 'Z').join(' ')).join(' ');
  }

  result[meta.id.toLowerCase()] = {
    id: meta.id,
    name: meta.name,
    name_jp: meta.name_jp,
    region: meta.region,
    pathD,
    minLng,
    maxLng,
    minLat,
    maxLat,
    scaleX,
    scaleY,
    offX,
    offY
  };
});

const outputPath = path.join(__dirname, '..', 'src', 'data', 'individualPrefectures.js');
fs.writeFileSync(outputPath, 'export const INDIVIDUAL_PREFECTURES = ' + JSON.stringify(result, null, 2) + ';\n');
console.log('Successfully generated INDIVIDUAL_PREFECTURES for all 47 prefectures!');

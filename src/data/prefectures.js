export const REGIONS = [
  { id: 'hokkaido', name: 'Hokkaido', name_jp: '北海道', color: '#38bdf8', bgGradient: 'linear-gradient(135deg, #0284c7, #0369a1)' },
  { id: 'tohoku', name: 'Tohoku', name_jp: '東北', color: '#34d399', bgGradient: 'linear-gradient(135deg, #059669, #047857)' },
  { id: 'kanto', name: 'Kanto', name_jp: '関東', color: '#10b981', bgGradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'chubu', name: 'Chubu', name_jp: '中部', color: '#f59e0b', bgGradient: 'linear-gradient(135deg, #d97706, #b45309)' },
  { id: 'kansai', name: 'Kansai', name_jp: '関西', color: '#ec4899', bgGradient: 'linear-gradient(135deg, #db2777, #be185d)' },
  { id: 'chugoku', name: 'Chugoku', name_jp: '中国', color: '#8b5cf6', bgGradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)' },
  { id: 'shikoku', name: 'Shikoku', name_jp: '四国', color: '#06b6d4', bgGradient: 'linear-gradient(135deg, #0891b2, #0e7490)' },
  { id: 'kyushu', name: 'Kyushu & Okinawa', name_jp: '九州・沖縄', color: '#f97316', bgGradient: 'linear-gradient(135deg, #ea580c, #c2410c)' }
];

export const PREFECTURES = [
  // Hokkaido
  { id: 'Hokkaido', name: 'Hokkaido', name_jp: '北海道', kana: 'ほっかいどう', region: 'Hokkaido', region_id: 'hokkaido', code: 1, lat: 43.0642, lng: 141.3469 },
  
  // Tohoku
  { id: 'Aomori', name: 'Aomori', name_jp: '青森県', kana: 'あおもり', region: 'Tohoku', region_id: 'tohoku', code: 2, lat: 40.8244, lng: 140.7400 },
  { id: 'Iwate', name: 'Iwate', name_jp: '岩手県', kana: 'いわて', region: 'Tohoku', region_id: 'tohoku', code: 3, lat: 39.7036, lng: 141.1527 },
  { id: 'Miyagi', name: 'Miyagi', name_jp: '宮城県', kana: 'みやぎ', region: 'Tohoku', region_id: 'tohoku', code: 4, lat: 38.2688, lng: 140.8721 },
  { id: 'Akita', name: 'Akita', name_jp: '秋田県', kana: 'あきた', region: 'Tohoku', region_id: 'tohoku', code: 5, lat: 39.7186, lng: 140.1024 },
  { id: 'Yamagata', name: 'Yamagata', name_jp: '山形県', kana: 'やまがた', region: 'Tohoku', region_id: 'tohoku', code: 6, lat: 38.2404, lng: 140.3636 },
  { id: 'Fukushima', name: 'Fukushima', name_jp: '福島県', kana: 'ふくしま', region: 'Tohoku', region_id: 'tohoku', code: 7, lat: 37.7503, lng: 140.4678 },
  
  // Kanto
  { id: 'Ibaraki', name: 'Ibaraki', name_jp: '茨城県', kana: 'いばらき', region: 'Kanto', region_id: 'kanto', code: 8, lat: 36.3418, lng: 140.4468 },
  { id: 'Tochigi', name: 'Tochigi', name_jp: '栃木県', kana: 'とちぎ', region: 'Kanto', region_id: 'kanto', code: 9, lat: 36.5657, lng: 139.8836 },
  { id: 'Gunma', name: 'Gunma', name_jp: '群馬県', kana: 'ぐんま', region: 'Kanto', region_id: 'kanto', code: 10, lat: 36.3912, lng: 139.0608 },
  { id: 'Saitama', name: 'Saitama', name_jp: '埼玉県', kana: 'さいたま', region: 'Kanto', region_id: 'kanto', code: 11, lat: 35.8570, lng: 139.6489 },
  { id: 'Chiba', name: 'Chiba', name_jp: '千葉県', kana: 'ちば', region: 'Kanto', region_id: 'kanto', code: 12, lat: 35.6051, lng: 140.1233 },
  { id: 'Tokyo', name: 'Tokyo', name_jp: '東京都', kana: 'とうきょう', region: 'Kanto', region_id: 'kanto', code: 13, lat: 35.6895, lng: 139.6917 },
  { id: 'Kanagawa', name: 'Kanagawa', name_jp: '神奈川県', kana: 'かながわ', region: 'Kanto', region_id: 'kanto', code: 14, lat: 35.4475, lng: 139.6423 },
  
  // Chubu
  { id: 'Niigata', name: 'Niigata', name_jp: '新潟県', kana: 'にいがた', region: 'Chubu', region_id: 'chubu', code: 15, lat: 37.9026, lng: 139.0232 },
  { id: 'Toyama', name: 'Toyama', name_jp: '富山県', kana: 'とやま', region: 'Chubu', region_id: 'chubu', code: 16, lat: 36.6953, lng: 137.2113 },
  { id: 'Ishikawa', name: 'Ishikawa', name_jp: '石川県', kana: 'いしかわ', region: 'Chubu', region_id: 'chubu', code: 17, lat: 36.5947, lng: 136.6256 },
  { id: 'Fukui', name: 'Fukui', name_jp: '福井県', kana: 'ふくい', region: 'Chubu', region_id: 'chubu', code: 18, lat: 36.0652, lng: 136.2216 },
  { id: 'Yamanashi', name: 'Yamanashi', name_jp: '山梨県', kana: 'やまなし', region: 'Chubu', region_id: 'chubu', code: 19, lat: 35.6639, lng: 138.5684 },
  { id: 'Nagano', name: 'Nagano', name_jp: '長野県', kana: 'ながの', region: 'Chubu', region_id: 'chubu', code: 20, lat: 36.6513, lng: 138.1810 },
  { id: 'Gifu', name: 'Gifu', name_jp: '岐阜県', kana: 'ぎふ', region: 'Chubu', region_id: 'chubu', code: 21, lat: 35.3912, lng: 136.7223 },
  { id: 'Shizuoka', name: 'Shizuoka', name_jp: '静岡県', kana: 'しずおか', region: 'Chubu', region_id: 'chubu', code: 22, lat: 34.9770, lng: 138.3831 },
  { id: 'Aichi', name: 'Aichi', name_jp: '愛知県', kana: 'あいち', region: 'Chubu', region_id: 'chubu', code: 23, lat: 35.1802, lng: 136.9066 },
  
  // Kansai
  { id: 'Mie', name: 'Mie', name_jp: '三重県', kana: 'みえ', region: 'Kansai', region_id: 'kansai', code: 24, lat: 34.7303, lng: 136.5086 },
  { id: 'Shiga', name: 'Shiga', name_jp: '滋賀県', kana: 'しが', region: 'Kansai', region_id: 'kansai', code: 25, lat: 35.0045, lng: 135.8686 },
  { id: 'Kyoto', name: 'Kyoto', name_jp: '京都府', kana: 'きょうと', region: 'Kansai', region_id: 'kansai', code: 26, lat: 35.0211, lng: 135.7556 },
  { id: 'Osaka', name: 'Osaka', name_jp: '大阪府', kana: 'おおさか', region: 'Kansai', region_id: 'kansai', code: 27, lat: 34.6863, lng: 135.5200 },
  { id: 'Hyogo', name: 'Hyogo', name_jp: '兵庫県', kana: 'ひょうご', region: 'Kansai', region_id: 'kansai', code: 28, lat: 34.6913, lng: 135.1830 },
  { id: 'Nara', name: 'Nara', name_jp: '奈良県', kana: 'なら', region: 'Kansai', region_id: 'kansai', code: 29, lat: 34.6853, lng: 135.8327 },
  { id: 'Wakayama', name: 'Wakayama', name_jp: '和歌山県', kana: 'わかやま', region: 'Kansai', region_id: 'kansai', code: 30, lat: 34.2260, lng: 135.1675 },
  
  // Chugoku
  { id: 'Tottori', name: 'Tottori', name_jp: '鳥取県', kana: 'とっとり', region: 'Chugoku', region_id: 'chugoku', code: 31, lat: 35.5039, lng: 134.2381 },
  { id: 'Shimane', name: 'Shimane', name_jp: '島根県', kana: 'しまね', region: 'Chugoku', region_id: 'chugoku', code: 32, lat: 35.4723, lng: 133.0505 },
  { id: 'Okayama', name: 'Okayama', name_jp: '岡山県', kana: 'おかやま', region: 'Chugoku', region_id: 'chugoku', code: 33, lat: 34.6618, lng: 133.9344 },
  { id: 'Hiroshima', name: 'Hiroshima', name_jp: '広島県', kana: 'ひろしま', region: 'Chugoku', region_id: 'chugoku', code: 34, lat: 34.3966, lng: 132.4596 },
  { id: 'Yamaguchi', name: 'Yamaguchi', name_jp: '山口県', kana: 'やまぐち', region: 'Chugoku', region_id: 'chugoku', code: 35, lat: 34.1861, lng: 131.4705 },
  
  // Shikoku
  { id: 'Tokushima', name: 'Tokushima', name_jp: '徳島県', kana: 'とくしま', region: 'Shikoku', region_id: 'shikoku', code: 36, lat: 34.0658, lng: 134.5593 },
  { id: 'Kagawa', name: 'Kagawa', name_jp: '香川県', kana: 'かがわ', region: 'Shikoku', region_id: 'shikoku', code: 37, lat: 34.3401, lng: 134.0434 },
  { id: 'Ehime', name: 'Ehime', name_jp: '愛媛県', kana: 'えひめ', region: 'Shikoku', region_id: 'shikoku', code: 38, lat: 33.8417, lng: 132.7661 },
  { id: 'Kochi', name: 'Kochi', name_jp: '高知県', kana: 'こうち', region: 'Shikoku', region_id: 'shikoku', code: 39, lat: 33.5597, lng: 133.5311 },
  
  // Kyushu & Okinawa
  { id: 'Fukuoka', name: 'Fukuoka', name_jp: '福岡県', kana: 'ふくおか', region: 'Kyushu & Okinawa', region_id: 'kyushu', code: 40, lat: 33.6068, lng: 130.4181 },
  { id: 'Saga', name: 'Saga', name_jp: '佐賀県', kana: 'さが', region: 'Kyushu & Okinawa', region_id: 'kyushu', code: 41, lat: 33.2494, lng: 130.2988 },
  { id: 'Nagasaki', name: 'Nagasaki', name_jp: '長崎県', kana: 'ながさき', region: 'Kyushu & Okinawa', region_id: 'kyushu', code: 42, lat: 32.7448, lng: 129.8737 },
  { id: 'Kumamoto', name: 'Kumamoto', name_jp: '熊本県', kana: 'くまもと', region: 'Kyushu & Okinawa', region_id: 'kyushu', code: 43, lat: 32.7898, lng: 130.7417 },
  { id: 'Oita', name: 'Oita', name_jp: '大分県', kana: 'おおいた', region: 'Kyushu & Okinawa', region_id: 'kyushu', code: 44, lat: 33.2382, lng: 131.6126 },
  { id: 'Miyazaki', name: 'Miyazaki', name_jp: '宮崎県', kana: 'みやざき', region: 'Kyushu & Okinawa', region_id: 'kyushu', code: 45, lat: 31.9111, lng: 131.4239 },
  { id: 'Kagoshima', name: 'Kagoshima', name_jp: '鹿児島県', kana: 'かごしま', region: 'Kyushu & Okinawa', region_id: 'kyushu', code: 46, lat: 31.5602, lng: 130.5581 },
  { id: 'Okinawa', name: 'Okinawa', name_jp: '沖縄県', kana: 'おきなわ', region: 'Kyushu & Okinawa', region_id: 'kyushu', code: 47, lat: 26.2124, lng: 127.6809 }
];

export const PREFECTURE_MAP = PREFECTURES.reduce((acc, pref) => {
  acc[pref.id.toLowerCase()] = pref;
  acc[pref.name.toLowerCase()] = pref;
  acc[pref.name_jp] = pref;
  return acc;
}, {});

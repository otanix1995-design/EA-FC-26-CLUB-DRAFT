export interface PrimaryLeague {
  name: string;
  aliases: string[];
  logoUrl: string;
  country: string;
  division: string;
}

export const PRIMARY_KNOWN_LEAGUES: PrimaryLeague[] = [
  {
    name: 'LaLiga EA Sports',
    aliases: ['laliga ea sports', 'laliga', 'la liga', 'liga ea sports'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LALIGA_EA_SPORTS_2023_Horizontal_Logo.svg',
    country: 'Espanha',
    division: '1ª Divisão',
  },
  {
    name: 'LaLiga Hypermotion',
    aliases: ['laliga hypermotion', 'laliga 2', 'la liga 2'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/LALIGA_HYPERMOTION_2023_Logo.svg',
    country: 'Espanha',
    division: '2ª Divisão',
  },
  {
    name: 'Premier League',
    aliases: ['premier league'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    country: 'Inglaterra',
    division: '1ª Divisão',
  },
  {
    name: 'EFL Championship',
    aliases: ['efl championship', 'championship'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0d/EFL_Championship_logo.svg',
    country: 'Inglaterra',
    division: '2ª Divisão',
  },
  {
    name: 'Serie A Enilive',
    aliases: ['serie a', 'serie a enilive'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2019.svg',
    country: 'Itália',
    division: '1ª Divisão',
  },
  {
    name: 'Serie BKT',
    aliases: ['serie b', 'serie bkt'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/86/Serie_B_logo_2018.svg',
    country: 'Itália',
    division: '2ª Divisão',
  },
  {
    name: 'Bundesliga',
    aliases: ['bundesliga', '1. bundesliga'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg',
    country: 'Alemanha',
    division: '1ª Divisão',
  },
  {
    name: '2. Bundesliga',
    aliases: ['2. bundesliga', '2 bundesliga'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/18/2._Bundesliga_logo.svg',
    country: 'Alemanha',
    division: '2ª Divisão',
  },
  {
    name: 'Ligue 1 McDonald\'s',
    aliases: ['ligue 1', 'ligue 1 mcdonald\'s'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Ligue_1_logo_2024.svg',
    country: 'França',
    division: '1ª Divisão',
  },
  {
    name: 'Ligue 2 BKT',
    aliases: ['ligue 2', 'ligue 2 bkt'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Ligue_2_BKT_logo.svg',
    country: 'França',
    division: '2ª Divisão',
  },
  {
    name: 'Liga Portugal Betclic',
    aliases: ['liga portugal', 'liga portugal betclic', 'primeira liga'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Liga_Portugal_2023.svg',
    country: 'Portugal',
    division: '1ª Divisão',
  },
  {
    name: 'Roshn Saudi League',
    aliases: ['saudi pro league', 'roshn saudi league', 'liga saudita'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/90/Saudi_Pro_League_logo.svg',
    country: 'Arábia Saudita',
    division: '1ª Divisão',
  },
  {
    name: 'Major League Soccer',
    aliases: ['mls', 'major league soccer'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/MLS_crest_logo_%282015%29.svg',
    country: 'Estados Unidos',
    division: '1ª Divisão',
  },
  {
    name: 'Eredivisie',
    aliases: ['eredivisie'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Eredivisie_logo.svg',
    country: 'Holanda',
    division: '1ª Divisão',
  },
  {
    name: 'Trendyol Süper Lig',
    aliases: ['süper lig', 'trendyol süper lig', 'super lig'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Trendyol_S%C3%BCper_Lig_logo.svg',
    country: 'Turquia',
    division: '1ª Divisão',
  },
  {
    name: 'Liga Profesional Argentina',
    aliases: ['liga profesional argentina', 'liga profesional'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Liga_Profesional_de_F%C3%Batbol_Argentino_%28logo%29.svg',
    country: 'Argentina',
    division: '1ª Divisão',
  },
  {
    name: 'Liga MX',
    aliases: ['liga mx'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Liga_MX.svg',
    country: 'México',
    division: '1ª Divisão',
  },
  {
    name: 'Scottish Premiership',
    aliases: ['scottish premiership'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/23/Scottish_Premiership.svg',
    country: 'Escócia',
    division: '1ª Divisão',
  },
  {
    name: 'UEFA Champions League',
    aliases: ['uefa champions league', 'champions league'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2021.svg',
    country: 'Europa',
    division: 'Torneio Continental',
  },
  {
    name: 'UEFA Europa League',
    aliases: ['uefa europa league', 'europa league'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/03/UEFA_Europa_League_logo_2021.svg',
    country: 'Europa',
    division: 'Torneio Continental',
  },
  {
    name: 'CONMEBOL Libertadores',
    aliases: ['conmebol libertadores', 'libertadores'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Copa_Libertadores_logo.svg',
    country: 'América do Sul',
    division: 'Torneio Continental',
  },
  {
    name: 'LIGA CLÁSICA',
    aliases: ['liga clásica', 'liga clasica', 'classic xi', 'classic xi team', 'clasica'],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/EA_Sports_logo_2020.svg',
    country: 'Resto do Mundo',
    division: '1ª Divisão',
  },
  {
    name: 'RDM masculina',
    aliases: [
      'rdm masculina',
      'rdm',
      'resto do mundo',
      'rest of world',
      'liga clásica e rdm masculina',
      'liga clasica e rdm masculina',
    ],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/EA_Sports_logo_2020.svg',
    country: 'Resto do Mundo',
    division: '1ª Divisão',
  },
];

export const KNOWN_LEAGUE_LOGOS: Record<string, string> = {};
export const KNOWN_LEAGUE_INFO: Record<string, { country: string; division: string }> = {};

PRIMARY_KNOWN_LEAGUES.forEach((primary) => {
  const info = { country: primary.country, division: primary.division };

  KNOWN_LEAGUE_LOGOS[primary.name.toLowerCase()] = primary.logoUrl;
  KNOWN_LEAGUE_INFO[primary.name.toLowerCase()] = info;

  primary.aliases.forEach((alias) => {
    const lowerAlias = alias.toLowerCase();
    KNOWN_LEAGUE_LOGOS[lowerAlias] = primary.logoUrl;
    KNOWN_LEAGUE_INFO[lowerAlias] = info;
  });
});

const CUSTOM_LEAGUE_LOGOS_KEY = 'eafc26_custom_league_logos_v1';

let memoryCustomLeagueLogosMap: Record<string, string> | null = null;

// Lightweight IndexedDB helper
function saveToIDB(key: string, value: any): void {
  try {
    if (!window.indexedDB) return;
    const req = window.indexedDB.open('EAFC26_Draft_DB', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('app_data')) {
        db.createObjectStore('app_data');
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      try {
        const tx = db.transaction('app_data', 'readwrite');
        tx.objectStore('app_data').put(value, key);
      } catch (e) {
        console.warn('IDB put error:', e);
      }
    };
  } catch (err) {
    console.warn('IDB open error:', err);
  }
}

function loadFromIDB(key: string, callback: (val: any) => void): void {
  try {
    if (!window.indexedDB) return;
    const req = window.indexedDB.open('EAFC26_Draft_DB', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('app_data')) {
        db.createObjectStore('app_data');
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      try {
        const tx = db.transaction('app_data', 'readonly');
        const getReq = tx.objectStore('app_data').get(key);
        getReq.onsuccess = () => {
          if (getReq.result) {
            callback(getReq.result);
          }
        };
      } catch (e) {
        console.warn('IDB get error:', e);
      }
    };
  } catch (err) {
    console.warn('IDB load error:', err);
  }
}

// Immediately asynchronously load from IndexedDB into memory
loadFromIDB(CUSTOM_LEAGUE_LOGOS_KEY, (idbMap) => {
  if (idbMap && typeof idbMap === 'object') {
    memoryCustomLeagueLogosMap = {
      ...(memoryCustomLeagueLogosMap || {}),
      ...idbMap,
    };
  }
});

export function getCustomLeagueLogosMap(): Record<string, string> {
  if (memoryCustomLeagueLogosMap !== null) {
    return memoryCustomLeagueLogosMap;
  }

  try {
    const data = localStorage.getItem(CUSTOM_LEAGUE_LOGOS_KEY);
    if (data) {
      memoryCustomLeagueLogosMap = JSON.parse(data);
      return memoryCustomLeagueLogosMap || {};
    }
  } catch {
    // Ignore localStorage read errors
  }

  memoryCustomLeagueLogosMap = {};
  return memoryCustomLeagueLogosMap;
}

export function saveCustomLeagueLogosMap(map: Record<string, string>): void {
  memoryCustomLeagueLogosMap = { ...map };
  
  // 1. Try saving to localStorage
  try {
    localStorage.setItem(CUSTOM_LEAGUE_LOGOS_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Erro ao salvar logos customizados no localStorage:', err);
  }

  // 2. Always save to IndexedDB as robust long-term backup
  saveToIDB(CUSTOM_LEAGUE_LOGOS_KEY, map);
}


export function getRelatedLeagueNames(leagueName: string): string[] {
  if (!leagueName) return [];
  const lower = leagueName.toLowerCase().trim();
  const set = new Set<string>([leagueName.trim()]);

  PRIMARY_KNOWN_LEAGUES.forEach((primary) => {
    const pNameLower = primary.name.toLowerCase();
    const aliasLowers = primary.aliases.map((a) => a.toLowerCase());

    if (
      pNameLower === lower ||
      aliasLowers.includes(lower) ||
      (lower.length > 3 && (pNameLower.includes(lower) || lower.includes(pNameLower)))
    ) {
      set.add(primary.name);
      primary.aliases.forEach((a) => set.add(a));
    }
  });

  return Array.from(set);
}

export function setCustomLeagueLogo(leagueName: string, logoUrl: string): void {
  if (!leagueName) return;
  const map = getCustomLeagueLogosMap();
  const relatedNames = getRelatedLeagueNames(leagueName);

  if (logoUrl.trim()) {
    relatedNames.forEach((name) => {
      map[name] = logoUrl.trim();
    });
  } else {
    relatedNames.forEach((name) => {
      delete map[name];
    });
  }
  saveCustomLeagueLogosMap(map);
}

export function getLeagueLogo(leagueName: string): string | undefined {
  if (!leagueName) return undefined;
  const rawKey = leagueName.trim();
  const lowerKey = rawKey.toLowerCase();

  // 1. Check user custom mappings first (exact case or lower case)
  const customMap = getCustomLeagueLogosMap();
  if (customMap[rawKey]) return customMap[rawKey];
  for (const [key, url] of Object.entries(customMap)) {
    if (key.toLowerCase() === lowerKey) return url;
  }

  // 2. Check related alias names in customMap
  const related = getRelatedLeagueNames(rawKey);
  for (const rel of related) {
    if (customMap[rel]) return customMap[rel];
    const relLower = rel.toLowerCase();
    for (const [key, url] of Object.entries(customMap)) {
      if (key.toLowerCase() === relLower) return url;
    }
  }

  // 3. Check KNOWN_LEAGUE_LOGOS exact match
  if (KNOWN_LEAGUE_LOGOS[lowerKey]) {
    return KNOWN_LEAGUE_LOGOS[lowerKey];
  }

  // 4. Substring fuzzy match in KNOWN_LEAGUE_LOGOS
  for (const [name, url] of Object.entries(KNOWN_LEAGUE_LOGOS)) {
    if (lowerKey.includes(name) || name.includes(lowerKey)) {
      return url;
    }
  }

  return undefined;
}

export function resetAllLeagueLogos(): void {
  localStorage.removeItem(CUSTOM_LEAGUE_LOGOS_KEY);
}

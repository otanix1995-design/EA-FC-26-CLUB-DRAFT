import * as XLSX from 'xlsx';
import { Club, Series, Settings, StatisticsData } from '../types';
import { DEFAULT_CLUBS } from '../data/defaultClubs';
import { getKnownClubLogo } from './clubLogos';

const CLUBS_KEY = 'eafc26_clubs_v1';
const HISTORY_KEY = 'eafc26_series_history_v1';
const SETTINGS_KEY = 'eafc26_settings_v1';

let memoryClubsCache: Club[] | null = null;

function saveClubsToIDB(key: string, value: any): void {
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

function loadClubsFromIDB(key: string, callback: (val: any) => void): void {
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

// Asynchronously hydrate memory cache from IDB
loadClubsFromIDB(CLUBS_KEY, (idbClubs) => {
  if (Array.isArray(idbClubs) && idbClubs.length > 0) {
    memoryClubsCache = idbClubs;
  }
});

export const defaultSettings: Settings = {
  darkMode: true,
  soundEnabled: true,
  vibrationEnabled: true,
  rouletteTime: 8,
  language: 'pt',
  excludedDivisions: [],
  excludedLeagues: [],
  excludedCountries: [],
};

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const OFFICIAL_COUNTRIES_FC26 = new Set([
  'alemanha',
  'germany',
  'argentina',
  'arabia saudita',
  'saudi arabia',
  'australia',
  'belgica',
  'belgium',
  'china',
  'coreia do sul',
  'coréia do sul',
  'coreia',
  'korea',
  'south korea',
  'dinamarca',
  'denmark',
  'escocia',
  'scotland',
  'espanha',
  'spain',
  'estados unidos',
  'eua',
  'usa',
  'united states',
  'franca',
  'france',
  'inglaterra',
  'england',
  'reino unido',
  'uk',
  'irlanda',
  'ireland',
  'rep. da irlanda',
  'republic of ireland',
  'italia',
  'italy',
  'noruega',
  'norway',
  'paises baixos',
  'holanda',
  'netherlands',
  'polonia',
  'poland',
  'portugal',
  'romenia',
  'romania',
  'suecia',
  'sweden',
  'suica',
  'switzerland',
  'turquia',
  'turkey',
  'austria',
  'india',
]);

export function isOfficialFcCountry(countryStr: string): boolean {
  if (!countryStr) return false;
  const normalized = removeAccents(countryStr.trim().toLowerCase());
  return OFFICIAL_COUNTRIES_FC26.has(normalized);
}

export function sanitizeClub(c: Club): Club {
  let nome = (c.nome || '').trim();
  let pais = (c.pais || '').trim();
  let liga = (c.liga || '').trim();
  let divisao = (c.divisao || '').trim();

  const isDiv = (s: string) => {
    if (!s) return false;
    const str = s.trim().toLowerCase();
    return (
      /^\d+[ªa]?\s*div/i.test(str) ||
      /^\d+[ªa]?\s*d/i.test(str) ||
      /^s[eé]rie/i.test(str) ||
      str.includes('divisã') ||
      str.includes('divisa') ||
      str.includes('division') ||
      str === '1ª' ||
      str === '2ª' ||
      str === '3ª' ||
      str === '4ª'
    );
  };

  // Case 1: Old import order where pais = Liga ("Premier League"), liga = Divisao ("1ª Divisão"), divisao = Pais ("Inglaterra")
  if (isDiv(liga) && !isDiv(divisao)) {
    const realLiga = pais;
    const realDivisao = liga;
    const realPais = divisao;
    pais = realPais;
    liga = realLiga;
    divisao = realDivisao;
  }
  // Case 2: Inverted pais and divisao (pais contains Division string e.g. "1ª Divisão", divisao contains Country e.g. "Alemanha")
  else if (isDiv(pais) && !isDiv(divisao)) {
    const realDivisao = pais;
    const realPais = divisao;
    pais = realPais;
    divisao = realDivisao;
  }

  nome = nome || 'Clube';
  divisao = divisao || '1ª Divisão';

  // Apply EA FC 26 Resto do Mundo rule:
  // If the country is not one of the 25 official countries with licensed leagues,
  // classify country as "Resto do Mundo", division as "1ª Divisão",
  // and split league into either "LIGA CLÁSICA" or "RDM masculina"
  if (!pais || !isOfficialFcCountry(pais)) {
    pais = 'Resto do Mundo';
    divisao = '1ª Divisão';
    const lowerLiga = (liga || '').toLowerCase();
    if (lowerLiga.includes('clasica') || lowerLiga.includes('clásica') || lowerLiga.includes('classic')) {
      liga = 'LIGA CLÁSICA';
    } else {
      liga = 'RDM masculina';
    }
  } else {
    liga = liga || 'Liga Geral';
  }

  return {
    ...c,
    nome,
    pais,
    liga,
    divisao,
    rating: typeof c.rating === 'number' && !isNaN(c.rating) && c.rating >= 10 && c.rating <= 99 ? c.rating : (c.rating ? parseInt(String(c.rating).replace(/[^\d]/g, ''), 10) || 80 : 80),
    logoUrl: c.logoUrl || getKnownClubLogo(nome),
  };
}

export function findClubMatchIndex(clubs: Club[], targetName: string): number {
  if (!targetName || !clubs || clubs.length === 0) return -1;

  const rawTarget = targetName.trim();
  const cleanTarget = removeAccents(rawTarget.toLowerCase()).replace(/[^a-z0-9]/g, '');
  if (!cleanTarget) return -1;

  // Pass 1: Exact Clean String Match (e.g. "realmadrid" === "realmadrid")
  let idx = clubs.findIndex((c) => {
    const cleanC = removeAccents((c.nome || '').trim().toLowerCase()).replace(/[^a-z0-9]/g, '');
    return cleanC === cleanTarget;
  });
  if (idx !== -1) return idx;

  // Pass 2: Normalized match stripping common football noise (e.g. "1. FC Kaiserslautern" vs "Kaiserslautern")
  const stripNoise = (str: string) => {
    let s = removeAccents((str || '').trim().toLowerCase()).replace(/[^a-z0-9]/g, ' ');
    s = s.replace(/\b\d+\b/g, ' ');
    s = s.replace(/\b(fc|cf|sc|sv|vfb|vfl|ac|as|ca|cd|ud|sd|spvgg|tsv|club|clube|de)\b/g, ' ');
    return s.split(/\s+/).filter(Boolean).join('');
  };

  const normTarget = stripNoise(rawTarget);
  if (normTarget.length >= 3) {
    idx = clubs.findIndex((c) => {
      const normC = stripNoise(c.nome);
      return normC === normTarget;
    });
    if (idx !== -1) return idx;
  }

  // Pass 3: Substring containment match for distinct names (length >= 5)
  if (cleanTarget.length >= 5) {
    idx = clubs.findIndex((c) => {
      const cleanC = removeAccents((c.nome || '').trim().toLowerCase()).replace(/[^a-z0-9]/g, '');
      if (cleanC.length >= 5) {
        if (cleanC.includes(cleanTarget) || cleanTarget.includes(cleanC)) {
          return true;
        }
      }
      return false;
    });
    if (idx !== -1) return idx;
  }

  return -1;
}

export function disambiguateLeagues(clubs: Club[]): { clubs: Club[]; mutated: boolean } {
  const leagueCountriesMap = new Map<string, Set<string>>();

  const multiCountryExemptions = new Set([
    'mls',
    'major league soccer',
    'uefa champions league',
    'champions league',
    'uefa europa league',
    'europa league',
    'conmebol libertadores',
    'libertadores',
    'copa libertadores',
    'a-league',
    'a-league men',
    'rest of world',
    'resto do mundo',
    'rdm masculina',
    'liga clásica',
    'liga clasica',
    'liga clásica e rdm masculina',
  ]);

  clubs.forEach((c) => {
    const l = (c.liga || '').trim();
    const p = (c.pais || '').trim();
    if (!l || !p) return;
    const lowerL = l.toLowerCase();
    if (multiCountryExemptions.has(lowerL)) return;

    if (!leagueCountriesMap.has(lowerL)) {
      leagueCountriesMap.set(lowerL, new Set());
    }
    leagueCountriesMap.get(lowerL)!.add(p);
  });

  let mutated = false;
  const updatedClubs = clubs.map((c) => {
    const l = (c.liga || '').trim();
    const p = (c.pais || '').trim();
    if (!l || !p) return c;

    const lowerL = l.toLowerCase();
    const countries = leagueCountriesMap.get(lowerL);

    if (countries && countries.size > 1 && !multiCountryExemptions.has(lowerL)) {
      const hasCountryInName = l.toLowerCase().includes(`(${p.toLowerCase()})`);
      if (!hasCountryInName) {
        mutated = true;
        return {
          ...c,
          liga: `${l} (${p})`,
        };
      }
    }
    return c;
  });

  return { clubs: updatedClubs, mutated };
}

class DatabaseService {
  // --- CLUBS ---
  public getClubs(): Club[] {
    if (memoryClubsCache && memoryClubsCache.length > 0) {
      return memoryClubsCache;
    }
    try {
      const data = localStorage.getItem(CLUBS_KEY);
      if (!data) {
        this.saveClubs(DEFAULT_CLUBS);
        return DEFAULT_CLUBS.map(sanitizeClub);
      }
      const parsed: Club[] = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveClubs(DEFAULT_CLUBS);
        return DEFAULT_CLUBS.map(sanitizeClub);
      }

      let mutated = false;
      const sanitized = parsed.map((c) => {
        const s = sanitizeClub(c);
        if (s.pais !== c.pais || s.divisao !== c.divisao || s.liga !== c.liga) {
          mutated = true;
        }
        return s;
      });

      // Disambiguate leagues with same name in different countries (e.g. División Profesional in Bolivia vs Paraguay)
      const { clubs: disambiguatedClubs, mutated: disMutated } = disambiguateLeagues(sanitized);
      if (disMutated) {
        mutated = true;
      }

      // Filter out any leftover Brazilian clubs from earlier default seeds
      const filtered = disambiguatedClubs.filter(
        (c) => c.pais.trim().toLowerCase() !== 'brasil' && !c.liga.trim().toLowerCase().includes('brasileir')
      );
      if (filtered.length !== disambiguatedClubs.length) {
        mutated = true;
      }

      if (mutated) {
        this.saveClubs(filtered);
      } else {
        memoryClubsCache = filtered;
      }

      return filtered;
    } catch {
      return DEFAULT_CLUBS.map(sanitizeClub);
    }
  }

  public saveClubs(clubs: Club[]): void {
    try {
      // Disambiguate leagues with same generic name in different countries
      const { clubs: disambiguated } = disambiguateLeagues(clubs.map(sanitizeClub));

      // Remove duplicates based on lowercased club name & league
      const uniqueMap = new Map<string, Club>();
      disambiguated.forEach((c) => {
        const key = `${c.nome.trim().toLowerCase()}_${c.liga.trim().toLowerCase()}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, {
            ...c,
            id: c.id || `club_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            nome: c.nome.trim(),
            pais: c.pais.trim(),
            liga: c.liga.trim(),
            divisao: c.divisao.trim(),
          });
        }
      });

      const uniqueList = Array.from(uniqueMap.values());
      memoryClubsCache = uniqueList;

      try {
        localStorage.setItem(CLUBS_KEY, JSON.stringify(uniqueList));
      } catch (e) {
        console.warn('LocalStorage saveClubs quota warning:', e);
      }

      saveClubsToIDB(CLUBS_KEY, uniqueList);
    } catch (err) {
      console.error('Erro ao salvar clubes:', err);
    }
  }

  public addClub(newClub: Omit<Club, 'id'> | Club): Club[] {
    const clubs = this.getClubs();
    const created: Club = {
      ...newClub,
      id: 'id' in newClub && newClub.id ? newClub.id : `user_club_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nome: newClub.nome.trim(),
      pais: newClub.pais.trim() || 'Internacional',
      liga: newClub.liga.trim() || 'Liga Geral',
      divisao: newClub.divisao.trim() || '1ª Divisão',
      badgeColor: newClub.badgeColor || '#00FF85',
      rating: newClub.rating || 80,
    };

    // Prepend to top of the list so newly added clubs appear first
    const updated = [created, ...clubs];
    this.saveClubs(updated);
    return updated;
  }

  public deleteClub(id: string): Club[] {
    const clubs = this.getClubs().filter((c) => c.id !== id);
    this.saveClubs(clubs);
    return clubs;
  }

  public updateClub(updatedClub: Club): Club[] {
    const clubs = this.getClubs().map((c) => (c.id === updatedClub.id ? updatedClub : c));
    this.saveClubs(clubs);
    return clubs;
  }

  public restoreDefaultClubs(): Club[] {
    this.saveClubs(DEFAULT_CLUBS);
    return DEFAULT_CLUBS;
  }

  // --- EXCEL IMPORT ---
  public async importClubsFromExcel(
    file: File,
    mode: 'merge' | 'replace' = 'merge'
  ): Promise<{
    clubs: Club[];
    totalClubs: number;
    totalCountries: number;
    totalLeagues: number;
    totalDivisions: number;
    updatedRatingsCount: number;
    newClubsAddedCount: number;
    modeUsed: 'merge' | 'replace';
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          if (!buffer) throw new Error('Não foi possível ler o arquivo.');

          // Use array type to correctly support UTF-[#] / UTF-8 accents and non-ASCII chars
          const workbook = XLSX.read(buffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];

          // Read raw 2D array first to inspect rows & headers
          const rawRows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' });

          if (!rawRows || rawRows.length === 0) {
            throw new Error('A planilha está vazia ou sem dados reconhecíveis.');
          }

          const normalize = (str: string): string =>
            String(str || '')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .trim();

          // Search for header row in the first 10 rows using score-based matching
          let bestHeaderRowIndex = -1;
          let maxScore = 0;
          let bestNameCol = -1;
          let bestCountryCol = -1;
          let bestLeagueCol = -1;
          let bestDivisionCol = -1;
          let bestRatingCol = -1;

          for (let r = 0; r < Math.min(rawRows.length, 10); r++) {
            const row = rawRows[r];
            if (!Array.isArray(row) || row.length === 0) continue;

            let foundName = -1;
            let foundCountry = -1;
            let foundLeague = -1;
            let foundDivision = -1;
            let foundRating = -1;

            row.forEach((cellVal, cIdx) => {
              const cellRaw = String(cellVal || '').trim();
              if (!cellRaw || cellRaw.length > 35) return; // Skip title banner merged cells

              const cellStr = normalize(cellRaw);

              if (
                foundName === -1 &&
                (cellStr === 'clube' || cellStr === 'club' || cellStr === 'time' || cellStr === 'equipe' || cellStr === 'nome' || cellStr === 'team' || cellStr === 'name')
              ) {
                foundName = cIdx;
              } else if (
                foundLeague === -1 &&
                (cellStr === 'liga' || cellStr === 'league' || cellStr === 'campeonato' || cellStr === 'comp' || cellStr === 'torneio')
              ) {
                foundLeague = cIdx;
              } else if (
                foundDivision === -1 &&
                (cellStr === 'divisao' || cellStr === 'division' || cellStr === 'div' || cellStr === 'serie' || cellStr === 'tier' || cellStr === 'nivel' || cellStr === 'categoria')
              ) {
                foundDivision = cIdx;
              } else if (
                foundCountry === -1 &&
                (cellStr === 'pais' || cellStr === 'country' || cellStr === 'nacao' || cellStr === 'nation' || cellStr === 'nacionalidade' || cellStr === 'estado')
              ) {
                foundCountry = cIdx;
              } else if (
                foundRating === -1 &&
                (
                  cellStr === 'ger' ||
                  cellStr === 'geral' ||
                  cellStr === 'ovr' ||
                  cellStr === 'overall' ||
                  cellStr === 'rating' ||
                  cellStr === 'nota' ||
                  cellStr === 'forca' ||
                  cellStr === 'over' ||
                  cellStr === 'power' ||
                  cellStr.startsWith('ger') ||
                  cellStr.includes('ger') ||
                  cellStr.includes('ovr') ||
                  cellStr.includes('rating') ||
                  cellStr.includes('overall') ||
                  cellStr.includes('forca')
                )
              ) {
                foundRating = cIdx;
              }
            });

            // Count how many header types were found in this row
            let score = 0;
            if (foundName !== -1) score++;
            if (foundLeague !== -1) score++;
            if (foundDivision !== -1) score++;
            if (foundCountry !== -1) score++;
            if (foundRating !== -1) score++;

            if (score > maxScore) {
              maxScore = score;
              bestHeaderRowIndex = r;
              bestNameCol = foundName;
              bestLeagueCol = foundLeague;
              bestDivisionCol = foundDivision;
              bestCountryCol = foundCountry;
              bestRatingCol = foundRating;
            }
          }

          let headerRowIndex = bestHeaderRowIndex;
          let nameCol = bestNameCol;
          let leagueCol = bestLeagueCol;
          let divisionCol = bestDivisionCol;
          let countryCol = bestCountryCol;
          let ratingCol = bestRatingCol;

          // If no row had >= 2 matches, fallback to default EA FC order: A=Clube, B=Liga, C=Divisão, D=País, E=GER
          if (maxScore < 2) {
            if (nameCol === -1) nameCol = 0;
            if (leagueCol === -1) leagueCol = 1;
            if (divisionCol === -1) divisionCol = 2;
            if (countryCol === -1) countryCol = 3;
            if (ratingCol === -1) ratingCol = 4;

            // Check if row 0 or 1 is a title row
            if (headerRowIndex === -1) {
              headerRowIndex = 0;
              // If rawRows[0] looks like a title (e.g. single long string), set headerRowIndex to 1 or data start row
              const row0Str = Array.isArray(rawRows[0]) ? String(rawRows[0][0] || '') : '';
              if (row0Str.length > 25 || normalize(row0Str).includes('clubes masculinos')) {
                headerRowIndex = 1; // row 1 is header (0-indexed 1) or row 2 is data
              }
            }
          } else if (ratingCol === -1) {
            // If header was found but GER column wasn't explicitly named, fallback to column 4 (Col E) if available
            ratingCol = 4;
          }

          const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;
          const importedClubs: Club[] = [];

          for (let i = startRow; i < rawRows.length; i++) {
            let row = rawRows[i];
            if (!row || !Array.isArray(row) || row.length === 0) continue;

            // Handle single cell delimited strings (e.g. "Real Madrid; Espanha; LALIGA; 1ª Divisão; 83")
            if (row.length === 1 && typeof row[0] === 'string' && (row[0].includes(';') || row[0].includes(',') || row[0].includes('|') || row[0].includes('\t'))) {
              const delimiter = row[0].includes(';') ? ';' : row[0].includes('\t') ? '\t' : row[0].includes('|') ? '|' : ',';
              row = row[0].split(delimiter).map((s: string) => s.trim());
            }

            const getCell = (colIdx: number): string => {
              if (colIdx >= 0 && colIdx < row.length) {
                return String(row[colIdx] || '').trim();
              }
              return '';
            };

            const nome = getCell(nameCol);
            const pais = getCell(countryCol);
            const liga = getCell(leagueCol);
            const divisao = getCell(divisionCol);
            const gerRaw = getCell(ratingCol);

            // Skip header repeat rows or empty names
            if (!nome || normalize(nome) === 'clube' || normalize(nome) === 'club' || normalize(nome) === 'nome') {
              continue;
            }

            let parsedRating = parseInt(String(gerRaw).replace(/[^\d]/g, ''), 10);

            // If ratingCol didn't produce a valid rating (between 40 and 99), fallback to searching all cells in the row
            if (isNaN(parsedRating) || parsedRating < 40 || parsedRating > 99) {
              for (let colIdx = row.length - 1; colIdx >= 0; colIdx--) {
                if (colIdx === nameCol || colIdx === leagueCol || colIdx === countryCol || colIdx === divisionCol) {
                  continue;
                }
                const cellVal = row[colIdx];
                if (typeof cellVal === 'number' && cellVal >= 40 && cellVal <= 99) {
                  parsedRating = Math.round(cellVal);
                  break;
                }
                const num = parseInt(String(cellVal || '').replace(/[^\d]/g, ''), 10);
                if (!isNaN(num) && num >= 40 && num <= 99) {
                  parsedRating = num;
                  break;
                }
              }
            }

            if (isNaN(parsedRating) || parsedRating < 40 || parsedRating > 99) {
              parsedRating = 80;
            }

            importedClubs.push({
              id: `excel_${i}_${Date.now()}_${Math.random()}`,
              nome: nome,
              pais: pais || 'Internacional',
              liga: liga || 'Liga Geral',
              divisao: divisao || '1ª Divisão',
              badgeColor: this.generateRandomColor(nome),
              rating: parsedRating,
            });
          }

          if (importedClubs.length === 0) {
            throw new Error('Nenhum clube válido encontrado. Certifique-se de que a planilha possui as colunas: Clube | País | Liga | Divisão | GER');
          }

          let finalClubs: Club[] = [];
          let updatedRatingsCount = 0;
          let newClubsAddedCount = 0;

          if (mode === 'replace') {
            finalClubs = importedClubs.map(sanitizeClub);
            newClubsAddedCount = finalClubs.length;
          } else {
            // MERGE MODE: Preserves user's custom edits (leagues, divisions, countries, logos) and updates GER rating!
            const currentClubs = this.getClubs().map(sanitizeClub);
            const mergedList: Club[] = [...currentClubs];

            importedClubs.forEach((imp) => {
              const existingIndex = findClubMatchIndex(mergedList, imp.nome);

              if (existingIndex !== -1) {
                // Update GER rating while preserving user custom edits (liga, divisao, pais, logoUrl)
                const existing = mergedList[existingIndex];
                if (existing.rating !== imp.rating) {
                  updatedRatingsCount++;
                }
                mergedList[existingIndex] = {
                  ...existing,
                  rating: imp.rating, // UPDATE GER
                };
              } else {
                // Add new club from spreadsheet
                const newClub = sanitizeClub(imp);
                mergedList.push(newClub);
                newClubsAddedCount++;
              }
            });

            finalClubs = mergedList;
          }

          this.saveClubs(finalClubs);

          const savedList = this.getClubs();
          const countriesSet = new Set(savedList.map((c) => c.pais));
          const leaguesSet = new Set(savedList.map((c) => c.liga));
          const divisionsSet = new Set(savedList.map((c) => c.divisao));

          resolve({
            clubs: savedList,
            totalClubs: savedList.length,
            totalCountries: countriesSet.size,
            totalLeagues: leaguesSet.size,
            totalDivisions: divisionsSet.size,
            updatedRatingsCount,
            newClubsAddedCount,
            modeUsed: mode,
          });
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Erro ao processar planilha Excel.'));
        }
      };

      reader.onerror = () => reject(new Error('Erro de leitura do arquivo.'));
      reader.readAsArrayBuffer(file);
    });
  }

  public syncDefaultRatings(): { updatedCount: number; totalClubs: number } {
    const currentClubs = this.getClubs();
    let updatedCount = 0;
    const updatedClubs = [...currentClubs];

    DEFAULT_CLUBS.forEach((dc) => {
      if (!dc.rating) return;
      const matchIdx = findClubMatchIndex(updatedClubs, dc.nome);
      if (matchIdx !== -1) {
        if (updatedClubs[matchIdx].rating !== dc.rating) {
          updatedCount++;
          updatedClubs[matchIdx] = {
            ...updatedClubs[matchIdx],
            rating: dc.rating,
          };
        }
      }
    });

    if (updatedCount > 0) {
      this.saveClubs(updatedClubs);
    }

    return { updatedCount, totalClubs: updatedClubs.length };
  }

  public downloadTemplateExcel(): void {
    const sampleData = [
      { Clube: '1. FC Kaiserslautern', Liga: '2. Bundesliga', Divisão: '2ª Divisão', País: 'Alemanha', GER: 69 },
      { Clube: 'Real Madrid', Liga: 'LALIGA EA SPORTS', Divisão: '1ª Divisão', País: 'Espanha', GER: 86 },
      { Clube: 'Liverpool', Liga: 'Premier League', Divisão: '1ª Divisão', País: 'Inglaterra', GER: 85 },
      { Clube: 'Flamengo', Liga: 'Brasileirão Série A', Divisão: 'Série A', País: 'Brasil', GER: 79 },
      { Clube: 'Bayern München', Liga: 'Bundesliga', Divisão: '1ª Divisão', País: 'Alemanha', GER: 86 },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clubes EA FC 26');

    XLSX.writeFile(workbook, 'EA_FC_26_Clubes_Modelo.xlsx');
  }

  // --- HISTORY / SERIES ---
  public getHistory(): Series[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public saveSeries(series: Series): void {
    const history = this.getHistory();
    const existingIndex = history.findIndex((s) => s.id === series.id);
    if (existingIndex >= 0) {
      history[existingIndex] = series;
    } else {
      history.unshift(series);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  public deleteSeries(id: string): Series[] {
    const history = this.getHistory().filter((s) => s.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  }

  public clearAllHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  }

  // --- SETTINGS ---
  public getSettings(): Settings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch {
      return defaultSettings;
    }
  }

  public saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  public clearDatabase(): void {
    localStorage.removeItem(CLUBS_KEY);
    localStorage.removeItem(HISTORY_KEY);
    this.saveClubs(DEFAULT_CLUBS);
  }

  // --- STATISTICS ENGINE ---
  public getStatistics(): StatisticsData {
    const history = this.getHistory();

    let totalMatches = 0;
    const totalSeries = history.length;

    const clubDrawsMap = new Map<string, { count: number; pais: string }>();
    const leagueDrawsMap = new Map<string, number>();
    const countryDrawsMap = new Map<string, number>();
    const playerWinsMap = new Map<string, number>();
    const playerStreaksMap = new Map<string, number>();
    const playerCurrentStreakMap = new Map<string, number>();

    let totalDraws = 0;
    let p1WinsTotal = 0;
    let p2WinsTotal = 0;

    let maxBlowoutDiff = -1;
    let biggestBlowout: { match: string; score: string; diff: number } | null = null;

    history.forEach((series) => {
      series.matches.forEach((m) => {
        totalMatches++;

        // Track drawn clubs
        [m.player1Club, m.player2Club].forEach((club) => {
          if (!club) return;
          const cData = clubDrawsMap.get(club.nome) || { count: 0, pais: club.pais };
          clubDrawsMap.set(club.nome, { count: cData.count + 1, pais: club.pais });

          if (club.liga) {
            leagueDrawsMap.set(club.liga, (leagueDrawsMap.get(club.liga) || 0) + 1);
          }
          if (club.pais) {
            countryDrawsMap.set(club.pais, (countryDrawsMap.get(club.pais) || 0) + 1);
          }
        });

        // Blowout math
        const diff = Math.abs(m.player1Goals - m.player2Goals);
        if (diff > maxBlowoutDiff && diff > 0) {
          maxBlowoutDiff = diff;
          const winner = m.player1Goals > m.player2Goals ? series.player1Name : series.player2Name;
          const loser = m.player1Goals > m.player2Goals ? series.player2Name : series.player1Name;
          const maxG = Math.max(m.player1Goals, m.player2Goals);
          const minG = Math.min(m.player1Goals, m.player2Goals);
          biggestBlowout = {
            match: `${winner} vs ${loser}`,
            score: `${maxG} - ${minG}`,
            diff: diff,
          };
        }

        if (m.winnerPlayer === 0) {
          totalDraws++;
          // Reset streaks on draw
          playerCurrentStreakMap.set(series.player1Name, 0);
          playerCurrentStreakMap.set(series.player2Name, 0);
        } else if (m.winnerPlayer === 1) {
          p1WinsTotal++;
          const p1 = series.player1Name;
          const p2 = series.player2Name;

          playerWinsMap.set(p1, (playerWinsMap.get(p1) || 0) + 1);

          const curS = (playerCurrentStreakMap.get(p1) || 0) + 1;
          playerCurrentStreakMap.set(p1, curS);
          playerCurrentStreakMap.set(p2, 0);

          const maxS = playerStreaksMap.get(p1) || 0;
          if (curS > maxS) playerStreaksMap.set(p1, curS);
        } else if (m.winnerPlayer === 2) {
          p2WinsTotal++;
          const p1 = series.player1Name;
          const p2 = series.player2Name;

          playerWinsMap.set(p2, (playerWinsMap.get(p2) || 0) + 1);

          const curS = (playerCurrentStreakMap.get(p2) || 0) + 1;
          playerCurrentStreakMap.set(p2, curS);
          playerCurrentStreakMap.set(p1, 0);

          const maxS = playerStreaksMap.get(p2) || 0;
          if (curS > maxS) playerStreaksMap.set(p2, curS);
        }
      });
    });

    // Find most drawn club
    let mostDrawnClub: { club: string; count: number } | null = null;
    let maxClubCount = 0;
    clubDrawsMap.forEach((val, name) => {
      if (val.count > maxClubCount) {
        maxClubCount = val.count;
        mostDrawnClub = { club: name, count: val.count };
      }
    });

    // Find most drawn league
    let mostDrawnLeague: { league: string; count: number } | null = null;
    let maxLeagueCount = 0;
    leagueDrawsMap.forEach((count, league) => {
      if (count > maxLeagueCount) {
        maxLeagueCount = count;
        mostDrawnLeague = { league, count };
      }
    });

    // Find most drawn country
    let mostDrawnCountry: { country: string; count: number } | null = null;
    let maxCountryCount = 0;
    countryDrawsMap.forEach((count, country) => {
      if (count > maxCountryCount) {
        maxCountryCount = count;
        mostDrawnCountry = { country, count };
      }
    });

    // Longest streak
    let longestWinStreak = { player: 'Nenhum', streak: 0 };
    playerStreaksMap.forEach((streak, player) => {
      if (streak > longestWinStreak.streak) {
        longestWinStreak = { player, streak };
      }
    });

    // Player with most wins
    let playerWithMostWins = { player: 'Nenhum', wins: 0 };
    playerWinsMap.forEach((wins, player) => {
      if (wins > playerWithMostWins.wins) {
        playerWithMostWins = { player, wins };
      }
    });

    // Rankings
    const topClubsRanking = Array.from(clubDrawsMap.entries())
      .map(([name, val]) => ({ name, count: val.count, pais: val.pais }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topCountriesRanking = Array.from(countryDrawsMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topLeaguesRanking = Array.from(leagueDrawsMap.entries())
      .map(([league, count]) => ({ league, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const decisiveMatches = totalMatches - totalDraws;
    const winRateP1 = decisiveMatches > 0 ? Math.round((p1WinsTotal / totalMatches) * 100) : 0;

    return {
      totalMatches,
      totalSeries,
      mostDrawnClub,
      mostDrawnLeague,
      mostDrawnCountry,
      longestWinStreak,
      playerWithMostWins,
      biggestBlowout,
      totalDraws,
      winRateP1,
      topClubsRanking,
      topCountriesRanking,
      topLeaguesRanking,
    };
  }

  private generateRandomColor(name: string): string {
    const colors = ['#C8102E', '#00529F', '#007A33', '#8E1F2F', '#000000', '#241F20', '#DC052D', '#004D98', '#6CABDD'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}

export const db = new DatabaseService();

import React, { useState, useMemo } from 'react';
import { Club, Settings } from '../types';
import { getTranslation } from '../services/i18n';
import { CountryFlag } from './CountryFlag';
import { resizeImage } from '../services/imageUtils';
import {
  getLeagueLogo,
  setCustomLeagueLogo,
  resetAllLeagueLogos,
  KNOWN_LEAGUE_LOGOS,
  KNOWN_LEAGUE_INFO,
  PRIMARY_KNOWN_LEAGUES,
  getCustomLeagueLogosMap,
  saveCustomLeagueLogosMap,
} from '../services/leagueLogos';
import {
  Trophy,
  X,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  Search,
  Check,
  Image as ImageIcon,
  FileCode,
  Globe,
  TrendingUp,
  Shield,
  CheckCircle2,
} from 'lucide-react';

interface LeagueLogosModalProps {
  settings: Settings;
  clubs: Club[];
  onClose: () => void;
  onUpdate: () => void;
}

export const LeagueLogosModal: React.FC<LeagueLogosModalProps> = ({
  settings,
  clubs,
  onClose,
  onUpdate,
}) => {
  const lang = settings.language || 'pt';

  const [searchTerm, setSearchTerm] = useState('');
  const [editingLeague, setEditingLeague] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Extract metadata for each league
  const leaguesMetadata = useMemo(() => {
    const map = new Map<
      string,
      {
        leagueName: string;
        countries: string[];
        divisions: string[];
        clubCount: number;
        sampleClubs: string[];
      }
    >();

    // 1. Group clubs by league name
    clubs.forEach((club) => {
      if (!club.liga || !club.liga.trim()) return;
      const key = club.liga.trim();

      if (!map.has(key)) {
        map.set(key, {
          leagueName: key,
          countries: [],
          divisions: [],
          clubCount: 0,
          sampleClubs: [],
        });
      }

      const item = map.get(key)!;
      item.clubCount += 1;

      if (club.pais && !item.countries.includes(club.pais)) {
        item.countries.push(club.pais);
      }
      if (club.divisao && !item.divisions.includes(club.divisao)) {
        item.divisions.push(club.divisao);
      }
      if (item.sampleClubs.length < 3) {
        item.sampleClubs.push(club.nome);
      }
    });

    // 2. Add primary known leagues if not already matched in map (preventing duplicate rows)
    PRIMARY_KNOWN_LEAGUES.forEach((primary) => {
      const primaryLower = primary.name.toLowerCase();
      const allAliasesLower = [primaryLower, ...primary.aliases.map((a) => a.toLowerCase())];

      // Check if map already has an entry matching primary name, any alias, or same logo URL
      let matchedKey: string | undefined = undefined;
      for (const k of map.keys()) {
        const kLower = k.toLowerCase();
        if (allAliasesLower.includes(kLower)) {
          matchedKey = k;
          break;
        }
        const existingLogo = getLeagueLogo(k);
        if (existingLogo && existingLogo === primary.logoUrl) {
          matchedKey = k;
          break;
        }
      }

      if (matchedKey) {
        // Enrich existing entry if country/division is missing
        const item = map.get(matchedKey)!;
        if (item.countries.length === 0 && primary.country) {
          item.countries.push(primary.country);
        }
        if (item.divisions.length === 0 && primary.division) {
          item.divisions.push(primary.division);
        }
      } else {
        // Add single row for primary league
        map.set(primary.name, {
          leagueName: primary.name,
          countries: primary.country ? [primary.country] : [],
          divisions: primary.division ? [primary.division] : [],
          clubCount: 0,
          sampleClubs: [],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.leagueName.localeCompare(b.leagueName));
  }, [clubs]);

  // Filtered leagues based on search term (searches in League Name, Country, Division, or Sample Clubs)
  const filteredLeagues = useMemo(() => {
    if (!searchTerm.trim()) return leaguesMetadata;
    const term = searchTerm.toLowerCase().trim();

    return leaguesMetadata.filter((item) => {
      const matchName = item.leagueName.toLowerCase().includes(term);
      const matchCountry = item.countries.some((c) => c.toLowerCase().includes(term));
      const matchDiv = item.divisions.some((d) => d.toLowerCase().includes(term));
      const matchClub = item.sampleClubs.some((c) => c.toLowerCase().includes(term));
      return matchName || matchCountry || matchDiv || matchClub;
    });
  }, [leaguesMetadata, searchTerm]);

  const handleOpenEdit = (leagueName: string) => {
    setEditingLeague(leagueName);
    setInputUrl(getLeagueLogo(leagueName) || '');
    setErrorMsg('');
  };

  const handleSaveLogo = async (leagueName: string, url: string) => {
    try {
      let finalUrl = url.trim();
      if (finalUrl && finalUrl.startsWith('data:image')) {
        finalUrl = await resizeImage(finalUrl, 200);
      }
      setCustomLeagueLogo(leagueName, finalUrl);
      setSuccessMsg(`Logo da liga "${leagueName}" salva com sucesso!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      onUpdate();
      setEditingLeague(null);
    } catch (err) {
      console.error('Erro ao salvar logo da liga:', err);
      setErrorMsg('Erro ao salvar logo da liga. Tente usar uma URL externa.');
    }
  };

  const handleFileUpload = async (leagueName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecione um arquivo de imagem válido (PNG, SVG, JPG, WebP).');
      return;
    }

    try {
      const resizedDataUrl = await resizeImage(file, 200);
      await handleSaveLogo(leagueName, resizedDataUrl);
    } catch (err) {
      setErrorMsg('Erro ao processar imagem.');
    }
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Arquivo JSON inválido. Formato esperado: { "Nome da Liga": "URL da Logo" }');
        }

        const currentMap = getCustomLeagueLogosMap();
        let count = 0;
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim()) {
            currentMap[key.trim()] = value.trim();
            count++;
          }
        });

        saveCustomLeagueLogosMap(currentMap);
        setSuccessMsg(`Importadas ${count} logos de ligas com sucesso!`);
        setTimeout(() => setSuccessMsg(''), 4000);
        onUpdate();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetAllLeagueLogos();
    setSuccessMsg('Logos de ligas restauradas para os padrões oficiais.');
    setTimeout(() => setSuccessMsg(''), 3000);
    onUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-[#12151c] border-2 border-[#00FF85]/40 rounded-3xl p-6 w-full max-w-3xl shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 bg-[#00FF85]/10 text-[#00FF85] rounded-2xl border border-[#00FF85]/30 shadow-lg shadow-[#00FF85]/10">
            <Trophy className="w-7 h-7 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {getTranslation(lang, 'leagueLogosTitle')}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {getTranslation(lang, 'leagueLogosDesc')}
            </p>
          </div>
        </div>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#00FF85]/10 border border-[#00FF85]/40 text-xs font-bold text-[#00FF85] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs font-bold text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Actions Bar (Search + Import JSON + Reset) */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por liga, país (ex: Espanha), divisão (ex: 1ª Divisão)..."
              className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-gray-500 outline-none font-medium shadow-inner"
            />
          </div>

          {/* Import JSON Button */}
          <label className="px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-gray-700 transition-colors shrink-0">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Importar JSON</span>
            <input type="file" accept=".json" onChange={handleJsonImport} className="hidden" />
          </label>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-gray-700 transition-colors shrink-0"
            title="Restaurar logos oficiais padrão"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Restaurar</span>
          </button>
        </div>

        {/* Leagues List */}
        <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {filteredLeagues.map((item) => {
            const { leagueName, countries, divisions, clubCount, sampleClubs } = item;
            const currentLogo = getLeagueLogo(leagueName);
            const isEditing = editingLeague === leagueName;

            const primaryCountry = countries[0] || 'Internacional';
            const primaryDivision = divisions[0] || '1ª Divisão';

            return (
              <div
                key={leagueName}
                className="bg-[#0a0b0e] border border-gray-800/90 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-gray-700 shadow-lg"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {/* Logo Display Box */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200/90 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-md">
                    {currentLogo ? (
                      <img
                        src={currentLogo}
                        alt={leagueName}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Trophy className="w-7 h-7 text-amber-500" />
                    )}
                  </div>

                  {/* Info: Name + Badges (Country & Division) */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-base text-white tracking-wide truncate">
                        {leagueName}
                      </h4>
                      {currentLogo && (
                        <span className="px-2 py-0.5 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/30 text-[10px] font-extrabold text-[#00FF85]">
                          ✓ Logo Ativa
                        </span>
                      )}
                    </div>

                    {/* Metadata Badges: País, Divisão, Clubes */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {/* Country Badge */}
                      <span className="px-2.5 py-0.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-200 font-bold flex items-center gap-1.5">
                        <CountryFlag country={primaryCountry} imageClassName="w-4 h-2.5 object-cover rounded-2xs inline-block shrink-0" />
                        <span>{countries.join(', ') || 'Internacional'}</span>
                      </span>

                      {/* Division Badge */}
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-300 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-blue-400" />
                        <span>{divisions.join(', ') || '1ª Divisão'}</span>
                      </span>

                      {/* Club Count Badge */}
                      {clubCount > 0 && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-950/50 border border-amber-800/50 text-amber-300 font-semibold text-[11px] flex items-center gap-1">
                          <Shield className="w-3 h-3 text-amber-400" />
                          <span>{clubCount} {clubCount === 1 ? 'clube' : 'clubes'}</span>
                        </span>
                      )}
                    </div>

                    {/* Sample Clubs text if available */}
                    {sampleClubs.length > 0 && (
                      <p className="text-[11px] text-gray-500 truncate">
                        <span className="font-semibold text-gray-400">Clubes: </span>
                        {sampleClubs.join(', ')}
                        {clubCount > 3 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit options or trigger */}
                {isEditing ? (
                  <div className="w-full sm:w-80 space-y-2.5 bg-[#12151c] p-3 rounded-2xl border border-gray-800 shrink-0">
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Cole a URL da logo (https://...)"
                        className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] rounded-xl pl-8 pr-2 py-1.5 text-xs text-white placeholder-gray-600 outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <label className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00FF85] hover:underline cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Enviar arquivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(leagueName, e)}
                          className="hidden"
                        />
                      </label>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingLeague(null)}
                          className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 font-bold cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveLogo(leagueName, inputUrl)}
                          className="px-3.5 py-1 rounded-lg bg-[#00FF85] text-black font-black text-xs uppercase shadow cursor-pointer"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(leagueName)}
                    className="px-3.5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-bold text-gray-300 hover:text-white border border-gray-800 transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#00FF85]" />
                    <span>{currentLogo ? 'Alterar Logo' : 'Adicionar Logo'}</span>
                  </button>
                )}
              </div>
            );
          })}

          {filteredLeagues.length === 0 && (
            <div className="p-8 text-center bg-[#0a0b0e] border border-gray-800 rounded-2xl text-gray-400 text-xs">
              Nenhuma liga encontrada com os termos de busca.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Mostrando {filteredLeagues.length} ligas
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};


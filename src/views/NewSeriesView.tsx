import React, { useState, useMemo } from 'react';
import { Settings, SeriesFormat, Club } from '../types';
import { getTranslation } from '../services/i18n';
import { getCountryFlag } from '../components/RouletteWheel';
import { getLeagueLogo } from '../services/leagueLogos';
import { User, Swords, ShieldCheck, Play, Filter, Check, Shield, Trophy, Globe } from 'lucide-react';

interface NewSeriesViewProps {
  settings: Settings;
  clubs: Club[];
  onStartSeries: (
    p1Name: string,
    p2Name: string,
    format: SeriesFormat,
    excludedDivisions?: string[],
    excludedLeagues?: string[],
    excludedCountries?: string[]
  ) => void;
  onCancel: () => void;
}

export const NewSeriesView: React.FC<NewSeriesViewProps> = ({
  settings,
  clubs,
  onStartSeries,
}) => {
  const [p1Name, setP1Name] = useState('Jogador 1');
  const [p2Name, setP2Name] = useState('Jogador 2');
  const [format, setFormat] = useState<SeriesFormat>(3);
  const [activeFilterTab, setActiveFilterTab] = useState<'leagues' | 'countries' | 'divisions'>('leagues');

  const lang = settings.language || 'pt';

  // Extract unique metadata from available clubs
  const allDivisions = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (c.divisao) set.add(c.divisao);
    });
    return Array.from(set).sort();
  }, [clubs]);

  const allLeagues = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (c.liga && c.liga.trim()) set.add(c.liga.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [clubs]);

  const allCountries = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (c.pais && c.pais.trim()) set.add(c.pais.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [clubs]);

  // Selected filters states (defaults: all available minus those in settings.excluded*)
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(() => {
    const excluded = settings.excludedDivisions || [];
    return allDivisions.filter((d) => !excluded.includes(d));
  });

  const [selectedLeagues, setSelectedLeagues] = useState<string[]>(() => {
    const excluded = settings.excludedLeagues || [];
    return allLeagues.filter((l) => !excluded.includes(l));
  });

  const [selectedCountries, setSelectedCountries] = useState<string[]>(() => {
    const excluded = settings.excludedCountries || [];
    return allCountries.filter((c) => !excluded.includes(c));
  });

  // Calculate active eligible clubs
  const activeClubsCount = useMemo(() => {
    return clubs.filter((c) => {
      const isDivOk = selectedDivisions.includes(c.divisao || '1ª Divisão');
      const isLeagueOk = selectedLeagues.includes(c.liga);
      const isCountryOk = selectedCountries.includes(c.pais);
      return isDivOk && isLeagueOk && isCountryOk;
    }).length;
  }, [clubs, selectedDivisions, selectedLeagues, selectedCountries]);

  const toggleDivision = (divName: string) => {
    if (selectedDivisions.includes(divName)) {
      setSelectedDivisions(selectedDivisions.filter((d) => d !== divName));
    } else {
      setSelectedDivisions([...selectedDivisions, divName]);
    }
  };

  const toggleLeague = (leagueName: string) => {
    if (selectedLeagues.includes(leagueName)) {
      setSelectedLeagues(selectedLeagues.filter((l) => l !== leagueName));
    } else {
      setSelectedLeagues([...selectedLeagues, leagueName]);
    }
  };

  const toggleCountry = (countryName: string) => {
    if (selectedCountries.includes(countryName)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== countryName));
    } else {
      setSelectedCountries([...selectedCountries, countryName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeClubsCount === 0) return;

    const finalP1 = p1Name.trim() || 'Jogador 1';
    const finalP2 = p2Name.trim() || 'Jogador 2';

    const excludedDivisions = allDivisions.filter((d) => !selectedDivisions.includes(d));
    const excludedLeagues = allLeagues.filter((l) => !selectedLeagues.includes(l));
    const excludedCountries = allCountries.filter((c) => !selectedCountries.includes(c));

    onStartSeries(finalP1, finalP2, format, excludedDivisions, excludedLeagues, excludedCountries);
  };

  const formatOptions: { value: SeriesFormat; labelKey: 'bestOf1' | 'bestOf3' | 'bestOf5' | 'bestOf7'; wins: number }[] = [
    { value: 1, labelKey: 'bestOf1', wins: 1 },
    { value: 3, labelKey: 'bestOf3', wins: 2 },
    { value: 5, labelKey: 'bestOf5', wins: 3 },
    { value: 7, labelKey: 'bestOf7', wins: 4 },
  ];

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      <div className="bg-[#12151c] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Title Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <div className="p-3 bg-[#00FF85]/10 text-[#00FF85] rounded-2xl border border-[#00FF85]/30">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              {getTranslation(lang, 'newSeries')}
            </h2>
            <p className="text-xs text-gray-400">Configure os jogadores, formato e filtros de divisões</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Player Inputs */}
          <div className="flex flex-col gap-4">
            {/* Player 1 */}
            <div>
              <label className="block text-xs font-bold text-[#00FF85] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {getTranslation(lang, 'player1')}
              </label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Ex: Pedro"
                maxLength={20}
                required
                className="w-full bg-[#0a0b0e] border border-gray-700 focus:border-[#00FF85] text-white rounded-xl py-3.5 px-4 font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#00FF85]/30 transition-all"
              />
            </div>

            {/* Player 2 */}
            <div>
              <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {getTranslation(lang, 'player2')}
              </label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="Ex: Lucas"
                maxLength={20}
                required
                className="w-full bg-[#0a0b0e] border border-gray-700 focus:border-cyan-400 text-white rounded-xl py-3.5 px-4 font-bold text-base focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all"
              />
            </div>
          </div>

          {/* Dispute Format Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              {getTranslation(lang, 'disputeFormat')}
            </label>

            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((opt) => {
                const isSelected = format === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormat(opt.value)}
                    className={`py-3.5 px-4 rounded-xl border font-bold text-sm flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00FF85]/15 border-[#00FF85] text-[#00FF85] shadow-lg shadow-[#00FF85]/20 scale-[1.02]'
                        : 'bg-[#0a0b0e] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    <span>{getTranslation(lang, opt.labelKey)}</span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                      (Vence {opt.wins})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multi-Tab Filter Section (Ligas, Países, Divisões) */}
          <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-4 h-4" />
                Filtros do Sorteio
              </span>

              {/* Tabs selector */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveFilterTab('leagues')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeFilterTab === 'leagues'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ligas ({selectedLeagues.length}/{allLeagues.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('countries')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeFilterTab === 'countries'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Países ({selectedCountries.length}/{allCountries.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('divisions')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeFilterTab === 'divisions'
                      ? 'bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 text-[#00FF85]" />
                  <span>Divisões ({selectedDivisions.length}/{allDivisions.length})</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Leagues */}
            {activeFilterTab === 'leagues' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] text-gray-400">
                    Selecione as ligas que poderão participar do sorteio:
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedLeagues([...allLeagues])}
                      className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer"
                    >
                      Marcar Todas
                    </button>
                    <span className="text-gray-600">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLeagues([])}
                      className="text-[11px] font-bold text-gray-400 hover:text-white hover:underline cursor-pointer"
                    >
                      Desmarcar Todas
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {allLeagues.map((leagueName) => {
                    const isSelected = selectedLeagues.includes(leagueName);
                    const logo = getLeagueLogo(leagueName);

                    return (
                      <button
                        key={leagueName}
                        type="button"
                        onClick={() => toggleLeague(leagueName)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                            : 'bg-[#12151c] text-gray-500 border-gray-800 hover:border-gray-700 hover:text-gray-300'
                        }`}
                      >
                        {logo ? (
                          <span className="w-4 h-4 rounded-xs bg-slate-100 p-0.5 inline-flex items-center justify-center shrink-0">
                            <img src={logo} alt={leagueName} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </span>
                        ) : null}
                        <span>{leagueName}</span>
                        {isSelected ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Countries */}
            {activeFilterTab === 'countries' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] text-gray-400">
                    Selecione os países que poderão participar do sorteio:
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedCountries([...allCountries])}
                      className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      Marcar Todos
                    </button>
                    <span className="text-gray-600">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCountries([])}
                      className="text-[11px] font-bold text-gray-400 hover:text-white hover:underline cursor-pointer"
                    >
                      Desmarcar Todos
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {allCountries.map((countryName) => {
                    const isSelected = selectedCountries.includes(countryName);
                    const flag = getCountryFlag(countryName);

                    return (
                      <button
                        key={countryName}
                        type="button"
                        onClick={() => toggleCountry(countryName)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                            : 'bg-[#12151c] text-gray-500 border-gray-800 hover:border-gray-700 hover:text-gray-300'
                        }`}
                      >
                        <span>{flag}</span>
                        <span>{countryName}</span>
                        {isSelected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Divisions */}
            {activeFilterTab === 'divisions' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] text-gray-400">
                    Selecione as divisões que poderão participar do sorteio:
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedDivisions([...allDivisions])}
                      className="text-[11px] font-bold text-[#00FF85] hover:underline cursor-pointer"
                    >
                      Marcar Todas
                    </button>
                    <span className="text-gray-600">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDivisions([])}
                      className="text-[11px] font-bold text-gray-400 hover:text-white hover:underline cursor-pointer"
                    >
                      Desmarcar Todas
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {allDivisions.map((divName) => {
                    const isSelected = selectedDivisions.includes(divName);

                    return (
                      <button
                        key={divName}
                        type="button"
                        onClick={() => toggleDivision(divName)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                          isSelected
                            ? 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/60 shadow-md shadow-[#00FF85]/10'
                            : 'bg-[#12151c] text-gray-500 border-gray-800 hover:border-gray-700 hover:text-gray-300'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5 text-[#00FF85]" /> : null}
                        <span>{divName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Clubs Summary */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-800/80">
              <span className="text-gray-400 flex items-center gap-1 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#00FF85]" />
                {getTranslation(lang, 'availableClubsCount')}
              </span>
              <span className="font-mono font-black text-[#00FF85] text-sm">
                {activeClubsCount} / {clubs.length}
              </span>
            </div>

            {activeClubsCount === 0 && (
              <div className="mt-2 text-xs font-bold text-red-400 text-center bg-red-950/40 p-2.5 rounded-xl border border-red-800/50">
                Nenhum clube atende aos filtros selecionados! Por favor, ative pelo menos uma opção.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="start-series-submit-btn"
            type="submit"
            disabled={activeClubsCount === 0}
            className={`w-full mt-2 py-4 px-6 rounded-2xl font-black text-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/40 ${
              activeClubsCount > 0
                ? 'bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] shadow-xl shadow-[#00FF85]/30 hover:shadow-[#00FF85]/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
            }`}
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{getTranslation(lang, 'startSeries')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

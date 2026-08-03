import React, { useState, useMemo } from 'react';
import { Club, Series, Settings } from '../types';
import { RouletteWheel } from '../components/RouletteWheel';
import { ClubCard } from '../components/ClubCard';
import { getTranslation } from '../services/i18n';
import { getLeagueLogo } from '../services/leagueLogos';
import { CountryFlag } from '../components/CountryFlag';
import { Swords, CheckCircle2, Play, Sparkles, Filter, ChevronDown, ChevronUp, Check, Shield, RefreshCw, Trophy, Globe } from 'lucide-react';

interface DraftViewProps {
  series: Series;
  clubs: Club[];
  settings: Settings;
  onConfirmDraftP1: (club: Club) => void;
  onConfirmDraftP2: (club: Club) => void;
  onStartMatch: () => void;
  onUpdateSeriesFilters?: (filters: {
    excludedDivisions?: string[];
    excludedLeagues?: string[];
    excludedCountries?: string[];
  }) => void;
  onUpdateExcludedDivisions?: (newExcluded: string[]) => void;
}

export const DraftView: React.FC<DraftViewProps> = ({
  series,
  clubs,
  settings,
  onConfirmDraftP1,
  onConfirmDraftP2,
  onStartMatch,
  onUpdateSeriesFilters,
  onUpdateExcludedDivisions,
}) => {
  const [draftedP1Club, setDraftedP1Club] = useState<Club | null>(series.currentP1Club || null);
  const [draftedP2Club, setDraftedP2Club] = useState<Club | null>(series.currentP2Club || null);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'leagues' | 'countries' | 'divisions'>('leagues');

  const [rejectedP1ClubIds, setRejectedP1ClubIds] = useState<string[]>([]);
  const [rejectedP2ClubIds, setRejectedP2ClubIds] = useState<string[]>([]);

  const [step, setStep] = useState<'spin_p1' | 'result_p1' | 'spin_p2' | 'result_p2' | 'vs_ready'>(
    series.status === 'drafting_p1' && !series.currentP1Club
      ? 'spin_p1'
      : series.status === 'drafting_p1' && series.currentP1Club
      ? 'result_p1'
      : series.status === 'drafting_p2' && !series.currentP2Club
      ? 'spin_p2'
      : series.status === 'drafting_p2' && series.currentP2Club
      ? 'result_p2'
      : 'vs_ready'
  );

  const lang = settings.language || 'pt';

  // Extract unique metadata from all clubs
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

  // Filter eligible clubs based on excluded Divisions, Leagues, and Countries
  const eligibleClubs = useMemo(() => {
    const excludedDivs = series.excludedDivisions || [];
    const excludedLegs = series.excludedLeagues || [];
    const excludedCouns = series.excludedCountries || [];

    let filtered = clubs;
    if (excludedDivs.length > 0) {
      filtered = filtered.filter((c) => !excludedDivs.includes(c.divisao || '1ª Divisão'));
    }
    if (excludedLegs.length > 0) {
      filtered = filtered.filter((c) => !excludedLegs.includes(c.liga));
    }
    if (excludedCouns.length > 0) {
      filtered = filtered.filter((c) => !excludedCouns.includes(c.pais));
    }

    return filtered.length > 0 ? filtered : clubs;
  }, [clubs, series.excludedDivisions, series.excludedLeagues, series.excludedCountries]);

  const updateFilters = (newDivs?: string[], newLegs?: string[], newCouns?: string[]) => {
    const nextDivs = newDivs !== undefined ? newDivs : (series.excludedDivisions || []);
    const nextLegs = newLegs !== undefined ? newLegs : (series.excludedLeagues || []);
    const nextCouns = newCouns !== undefined ? newCouns : (series.excludedCountries || []);

    if (onUpdateSeriesFilters) {
      onUpdateSeriesFilters({
        excludedDivisions: nextDivs,
        excludedLeagues: nextLegs,
        excludedCountries: nextCouns,
      });
    } else if (onUpdateExcludedDivisions) {
      onUpdateExcludedDivisions(nextDivs);
    }
  };

  const toggleDivisionFilter = (divName: string) => {
    const currentExcluded = series.excludedDivisions || [];
    let updated: string[];
    if (currentExcluded.includes(divName)) {
      updated = currentExcluded.filter((d) => d !== divName);
    } else {
      if (currentExcluded.length >= allDivisions.length - 1) return;
      updated = [...currentExcluded, divName];
    }
    updateFilters(updated, undefined, undefined);
  };

  const toggleLeagueFilter = (leagueName: string) => {
    const currentExcluded = series.excludedLeagues || [];
    let updated: string[];
    if (currentExcluded.includes(leagueName)) {
      updated = currentExcluded.filter((l) => l !== leagueName);
    } else {
      updated = [...currentExcluded, leagueName];
    }
    updateFilters(undefined, updated, undefined);
  };

  const toggleCountryFilter = (countryName: string) => {
    const currentExcluded = series.excludedCountries || [];
    let updated: string[];
    if (currentExcluded.includes(countryName)) {
      updated = currentExcluded.filter((c) => c !== countryName);
    } else {
      updated = [...currentExcluded, countryName];
    }
    updateFilters(undefined, undefined, updated);
  };

  // Excluded clubs in current match/series (including rejected missing clubs)
  const excludedForP1 = useMemo(
    () => [...(series.drawnClubIds || []), ...rejectedP1ClubIds],
    [series.drawnClubIds, rejectedP1ClubIds]
  );

  const excludedForP2 = useMemo(
    () => [
      ...(series.drawnClubIds || []),
      ...(draftedP1Club ? [draftedP1Club.id] : []),
      ...rejectedP2ClubIds,
    ],
    [series.drawnClubIds, draftedP1Club, rejectedP2ClubIds]
  );

  // Handle spin completions
  const handleP1SpinDone = (club: Club) => {
    setDraftedP1Club(club);
    setStep('result_p1');
  };

  const handleP2SpinDone = (club: Club) => {
    setDraftedP2Club(club);
    setStep('result_p2');
  };

  const handleRespinP1 = () => {
    if (draftedP1Club) {
      setRejectedP1ClubIds((prev) => [...prev, draftedP1Club.id]);
    }
    setDraftedP1Club(null);
    setStep('spin_p1');
  };

  const handleRespinP2 = () => {
    if (draftedP2Club) {
      setRejectedP2ClubIds((prev) => [...prev, draftedP2Club.id]);
    }
    setDraftedP2Club(null);
    setStep('spin_p2');
  };

  const confirmP1 = () => {
    if (draftedP1Club) {
      onConfirmDraftP1(draftedP1Club);
      setStep('spin_p2');
    }
  };

  const confirmP2 = () => {
    if (draftedP2Club) {
      onConfirmDraftP2(draftedP2Club);
      setStep('vs_ready');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Series Match Number Indicator */}
      <div className="text-center mb-4 flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2 bg-[#12151c] border border-[#00FF85]/30 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-gray-300">
          <span>SÉRIE: {series.player1Name} ({series.player1Wins}) vs {series.player2Name} ({series.player2Wins})</span>
          <span className="text-[#00FF85]">• Jogo {series.currentMatchIndex + 1} de {series.format}</span>
        </div>

        {/* Filter Quick Bar (Only shown during spin steps) */}
        {(step === 'spin_p1' || step === 'spin_p2') && (
          <div className="w-full max-w-xl mt-1">
            <button
              type="button"
              onClick={() => setShowFilterBar(!showFilterBar)}
              className="mx-auto py-1.5 px-3.5 rounded-xl bg-[#12151c] border border-gray-800 hover:border-[#00FF85]/40 text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Filtros do Sorteio: <strong className="text-[#00FF85]">{eligibleClubs.length} clubes elegíveis</strong>
              </span>
              {showFilterBar ? <ChevronUp className="w-3.5 h-3.5 text-[#00FF85]" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Expanded Multi-Tab Filter Bar */}
            {showFilterBar && (
              <div className="mt-2.5 p-3.5 bg-[#0a0b0e] border border-gray-800 rounded-2xl animate-fadeIn shadow-2xl text-left space-y-3">
                {/* Tabs */}
                <div className="flex items-center gap-1.5 border-b border-gray-800 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveFilterTab('leagues')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeFilterTab === 'leagues'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ligas ({allLeagues.length - (series.excludedLeagues?.length || 0)})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilterTab('countries')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeFilterTab === 'countries'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Países ({allCountries.length - (series.excludedCountries?.length || 0)})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilterTab('divisions')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeFilterTab === 'divisions'
                        ? 'bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/50'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5 text-[#00FF85]" />
                    <span>Divisões ({allDivisions.length - (series.excludedDivisions?.length || 0)})</span>
                  </button>
                </div>

                {/* Tab Content: Leagues */}
                {activeFilterTab === 'leagues' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase text-gray-400">
                        Ativar ou desativar ligas no sorteio:
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateFilters(undefined, [], undefined)}
                          className="text-[10px] font-bold text-cyan-400 hover:underline cursor-pointer"
                        >
                          Ativar Todas
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFilters(undefined, allLeagues, undefined)}
                          className="text-[10px] font-bold text-gray-500 hover:underline cursor-pointer"
                        >
                          Desativar Todas
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                      {allLeagues.map((leagueName) => {
                        const isExcluded = (series.excludedLeagues || []).includes(leagueName);
                        const isEnabled = !isExcluded;
                        const logo = getLeagueLogo(leagueName);

                        return (
                          <button
                            key={leagueName}
                            type="button"
                            onClick={() => toggleLeagueFilter(leagueName)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                              isEnabled
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50'
                                : 'bg-[#12151c] text-gray-500 border-gray-800 line-through opacity-50'
                            }`}
                          >
                            {logo ? (
                              <img src={logo} alt={leagueName} className="w-3.5 h-3.5 object-contain" referrerPolicy="no-referrer" />
                            ) : null}
                            <span>{leagueName}</span>
                            {isEnabled ? <Check className="w-3 h-3 text-cyan-400" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab Content: Countries */}
                {activeFilterTab === 'countries' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase text-gray-400">
                        Ativar ou desativar países no sorteio:
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateFilters(undefined, undefined, [])}
                          className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
                        >
                          Ativar Todos
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFilters(undefined, undefined, allCountries)}
                          className="text-[10px] font-bold text-gray-500 hover:underline cursor-pointer"
                        >
                          Desativar Todos
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                      {allCountries.map((countryName) => {
                        const isExcluded = (series.excludedCountries || []).includes(countryName);
                        const isEnabled = !isExcluded;

                        return (
                          <button
                            key={countryName}
                            type="button"
                            onClick={() => toggleCountryFilter(countryName)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                              isEnabled
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50'
                                : 'bg-[#12151c] text-gray-500 border-gray-800 line-through opacity-50'
                            }`}
                          >
                            <CountryFlag country={countryName} imageClassName="w-4 h-2.5 object-cover rounded-2xs inline-block shrink-0" />
                            <span>{countryName}</span>
                            {isEnabled ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab Content: Divisions */}
                {activeFilterTab === 'divisions' && (
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
                      Ativar ou desativar divisões no sorteio:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {allDivisions.map((divName) => {
                        const isExcluded = (series.excludedDivisions || []).includes(divName);
                        const isEnabled = !isExcluded;

                        return (
                          <button
                            key={divName}
                            type="button"
                            onClick={() => toggleDivisionFilter(divName)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                              isEnabled
                                ? 'bg-[#00FF85]/15 text-[#00FF85] border-[#00FF85]/50'
                                : 'bg-[#12151c] text-gray-500 border-gray-800 line-through opacity-60'
                            }`}
                          >
                            {isEnabled ? <Check className="w-3 h-3 text-[#00FF85]" /> : null}
                            <span>{divName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* STEP 1: SPIN FOR PLAYER 1 */}
      {step === 'spin_p1' && (
        <RouletteWheel
          clubs={eligibleClubs}
          excludedClubIds={excludedForP1}
          durationSeconds={settings.rouletteTime || 8}
          playerName={series.player1Name}
          settings={settings}
          onSpinComplete={handleP1SpinDone}
        />
      )}

      {/* STEP 2: RESULT CARD FOR PLAYER 1 */}
      {step === 'result_p1' && draftedP1Club && (
        <div className="flex flex-col items-center gap-6 animate-fadeIn">
          <div className="text-center">
            <h3 className="text-2xl font-black text-[#00FF85] uppercase tracking-wider flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Clube Sorteado!
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Confira o clube do {series.player1Name}
            </p>
          </div>

          <ClubCard club={draftedP1Club} playerTitle={series.player1Name} size="large" />

          {/* Actions: Confirm or Respin */}
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <button
                id="confirm-p1-club-btn"
                onClick={confirmP1}
                className="flex-1 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-lg uppercase tracking-wider shadow-xl shadow-[#00FF85]/30 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/40"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>{getTranslation(lang, 'confirmClub')}</span>
              </button>

              <button
                type="button"
                onClick={handleRespinP1}
                className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <span>{getTranslation(lang, 'respin')}</span>
              </button>
            </div>

            <p className="text-xs text-amber-400/90 font-medium text-center">
              💡 {getTranslation(lang, 'clubNotInGame')}
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: SPIN FOR PLAYER 2 */}
      {step === 'spin_p2' && (
        <RouletteWheel
          clubs={eligibleClubs}
          excludedClubIds={excludedForP2}
          durationSeconds={settings.rouletteTime || 8}
          playerName={series.player2Name}
          settings={settings}
          onSpinComplete={handleP2SpinDone}
        />
      )}

      {/* STEP 4: RESULT CARD FOR PLAYER 2 */}
      {step === 'result_p2' && draftedP2Club && (
        <div className="flex flex-col items-center gap-6 animate-fadeIn">
          <div className="text-center">
            <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-wider flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Clube Sorteado!
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Confira o clube do {series.player2Name}
            </p>
          </div>

          <ClubCard club={draftedP2Club} playerTitle={series.player2Name} size="large" />

          {/* Actions: Confirm or Respin */}
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <button
                id="confirm-p2-club-btn"
                onClick={confirmP2}
                className="flex-1 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 text-[#0a0b0e] font-black text-lg uppercase tracking-wider shadow-xl shadow-cyan-400/30 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/40"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>{getTranslation(lang, 'confirmClub')}</span>
              </button>

              <button
                type="button"
                onClick={handleRespinP2}
                className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <span>{getTranslation(lang, 'respin')}</span>
              </button>
            </div>

            <p className="text-xs text-amber-400/90 font-medium text-center">
              💡 {getTranslation(lang, 'clubNotInGame')}
            </p>
          </div>
        </div>
      )}

      {/* STEP 5: TELA VS (READY TO MATCH) */}
      {step === 'vs_ready' && draftedP1Club && draftedP2Club && (
        <div className="flex flex-col items-center gap-8 my-4 animate-fadeIn">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              CONFRONTO DEFINIDO
            </h2>
            <p className="text-gray-400 text-sm">Preparados para o apito inicial?</p>
          </div>

          {/* VS Side by Side Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative">
            {/* Player 1 Card */}
            <div className="flex flex-col items-center">
              <ClubCard club={draftedP1Club} playerTitle={series.player1Name} size="normal" />
              <button
                type="button"
                onClick={handleRespinP1}
                className="mt-3 py-2 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Roletar de novo ({series.player1Name})</span>
              </button>
            </div>

            {/* Neon VS Badge floating in center */}
            <div className="md:absolute left-1/2 top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-30 my-2 md:my-0 flex justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FF85] via-amber-400 to-cyan-400 p-[3px] shadow-2xl shadow-[#00FF85]/50 animate-bounce">
                <div className="w-full h-full bg-[#0a0b0e] rounded-full flex items-center justify-center font-black text-2xl text-white tracking-tighter border border-white/20">
                  VS
                </div>
              </div>
            </div>

            {/* Player 2 Card */}
            <div className="flex flex-col items-center">
              <ClubCard club={draftedP2Club} playerTitle={series.player2Name} size="normal" />
              <button
                type="button"
                onClick={handleRespinP2}
                className="mt-3 py-2 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Roletar de novo ({series.player2Name})</span>
              </button>
            </div>
          </div>

          {/* Start Match Button */}
          <button
            id="start-match-btn"
            onClick={onStartMatch}
            className="w-full max-w-md py-5 px-8 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-2xl uppercase tracking-wider shadow-2xl shadow-[#00FF85]/40 hover:shadow-[#00FF85]/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border-2 border-white/50"
          >
            <Swords className="w-8 h-8" />
            <span>{getTranslation(lang, 'startMatch')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

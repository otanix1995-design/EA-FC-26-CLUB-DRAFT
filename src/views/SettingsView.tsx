import React, { useState, useMemo } from 'react';
import { Settings, Language, Club } from '../types';
import { db } from '../services/db';
import { audio } from '../services/audio';
import { getTranslation } from '../services/i18n';
import { getCountryFlag } from '../components/RouletteWheel';
import { getLeagueLogo } from '../services/leagueLogos';
import { LeagueLogosModal } from '../components/LeagueLogosModal';
import { Settings as SettingsIcon, Moon, Sun, Volume2, VolumeX, Smartphone, Timer, Globe, Trash2, AlertTriangle, Filter, Check, Trophy } from 'lucide-react';

interface SettingsViewProps {
  settings: Settings;
  clubs?: Club[];
  onUpdateSettings: (settings: Settings) => void;
  onResetDatabase: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  clubs = [],
  onUpdateSettings,
  onResetDatabase,
}) => {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showLeagueLogosModal, setShowLeagueLogosModal] = useState(false);
  const lang = settings.language || 'pt';

  // Extract unique divisions, leagues and countries from clubs
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

  const toggleDivisionDefault = (divName: string) => {
    const currentExcluded = settings.excludedDivisions || [];
    let updated: string[];
    if (currentExcluded.includes(divName)) {
      updated = currentExcluded.filter((d) => d !== divName);
    } else {
      updated = [...currentExcluded, divName];
    }
    onUpdateSettings({ ...settings, excludedDivisions: updated });
  };

  const toggleLeagueDefault = (leagueName: string) => {
    const currentExcluded = settings.excludedLeagues || [];
    let updated: string[];
    if (currentExcluded.includes(leagueName)) {
      updated = currentExcluded.filter((l) => l !== leagueName);
    } else {
      updated = [...currentExcluded, leagueName];
    }
    onUpdateSettings({ ...settings, excludedLeagues: updated });
  };

  const toggleCountryDefault = (countryName: string) => {
    const currentExcluded = settings.excludedCountries || [];
    let updated: string[];
    if (currentExcluded.includes(countryName)) {
      updated = currentExcluded.filter((c) => c !== countryName);
    } else {
      updated = [...currentExcluded, countryName];
    }
    onUpdateSettings({ ...settings, excludedCountries: updated });
  };

  const enableAllLeagues = () => {
    onUpdateSettings({ ...settings, excludedLeagues: [] });
  };

  const disableAllLeagues = () => {
    onUpdateSettings({ ...settings, excludedLeagues: allLeagues });
  };

  const enableAllCountries = () => {
    onUpdateSettings({ ...settings, excludedCountries: [] });
  };

  const disableAllCountries = () => {
    onUpdateSettings({ ...settings, excludedCountries: allCountries });
  };

  const handleSoundToggle = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    audio.setSoundEnabled(updated.soundEnabled);
    onUpdateSettings(updated);
  };

  const handleVibrationToggle = () => {
    onUpdateSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled });
  };

  const handleDarkModeToggle = () => {
    onUpdateSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const handleTimeSelect = (time: 5 | 8 | 10) => {
    onUpdateSettings({ ...settings, rouletteTime: time });
  };

  const handleLanguageSelect = (newLang: Language) => {
    onUpdateSettings({ ...settings, language: newLang });
  };

  const confirmClearDatabase = () => {
    db.clearDatabase();
    onResetDatabase();
    setShowClearModal(false);
    alert('Banco de dados redefinido com sucesso!');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-[#12151c] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <div className="p-3 bg-gray-800 text-gray-200 rounded-2xl border border-gray-700">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              {getTranslation(lang, 'settings')}
            </h2>
            <p className="text-xs text-gray-400">Preferências visuais, sonoras e tempo da roleta</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Mode Dark / Light */}
          <div className="flex items-center justify-between p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl">
            <div className="flex items-center gap-3">
              {settings.darkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <span className="block font-bold text-sm text-white">{getTranslation(lang, 'darkMode')}</span>
                <span className="text-xs text-gray-500">Alternar tema da interface</span>
              </div>
            </div>

            <button
              id="settings-theme-toggle"
              onClick={handleDarkModeToggle}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                settings.darkMode ? 'bg-[#00FF85] justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#0a0b0e] shadow-md" />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-[#00FF85]" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
              <div>
                <span className="block font-bold text-sm text-white">{getTranslation(lang, 'rouletteSound')}</span>
                <span className="text-xs text-gray-500">Efeitos sonoros e fanfarras</span>
              </div>
            </div>

            <button
              id="settings-sound-toggle"
              onClick={handleSoundToggle}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                settings.soundEnabled ? 'bg-[#00FF85] justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#0a0b0e] shadow-md" />
            </button>
          </div>

          {/* Vibration Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <Smartphone className={`w-5 h-5 ${settings.vibrationEnabled ? 'text-cyan-400' : 'text-gray-500'}`} />
              <div>
                <span className="block font-bold text-sm text-white">{getTranslation(lang, 'vibration')}</span>
                <span className="text-xs text-gray-500">Feedback tátil do celular ao girar</span>
              </div>
            </div>

            <button
              id="settings-vibration-toggle"
              onClick={handleVibrationToggle}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                settings.vibrationEnabled ? 'bg-[#00FF85] justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#0a0b0e] shadow-md" />
            </button>
          </div>

          {/* Roulette Duration Time Selector (5s, 8s, 10s) */}
          <div className="p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm text-white">{getTranslation(lang, 'rouletteTime')}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[5, 8, 10].map((t) => {
                const isSel = settings.rouletteTime === t;
                return (
                  <button
                    key={t}
                    onClick={() => handleTimeSelect(t as 5 | 8 | 10)}
                    className={`py-3 px-3 rounded-xl border font-black text-sm flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#00FF85]/15 border-[#00FF85] text-[#00FF85] shadow-lg shadow-[#00FF85]/10'
                        : 'bg-[#12151c] border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span>{t}</span>
                    <span className="text-[10px] uppercase">{getTranslation(lang, 'seconds')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector (PT, EN, ES) */}
          <div className="p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-sm text-white">{getTranslation(lang, 'language')}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'pt', name: 'Português', flag: '🇧🇷' },
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'es', name: 'Español', flag: '🇪🇸' },
              ].map((l) => {
                const isSel = settings.language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageSelect(l.code as Language)}
                    className={`py-3 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#00FF85]/15 border-[#00FF85] text-[#00FF85] shadow-lg shadow-[#00FF85]/10'
                        : 'bg-[#12151c] border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Default Division Filter Settings */}
          {allDivisions.length > 0 && (
            <div className="p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Filter className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-white">
                  {getTranslation(lang, 'filterDivisions')} (Padrão)
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Divisões desativadas aqui não aparecerão por padrão em novas séries.
              </p>

              <div className="flex flex-wrap gap-2">
                {allDivisions.map((divName) => {
                  const isExcluded = (settings.excludedDivisions || []).includes(divName);
                  const isEnabled = !isExcluded;

                  return (
                    <button
                      key={divName}
                      type="button"
                      onClick={() => toggleDivisionDefault(divName)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                        isEnabled
                          ? 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/60 shadow-md shadow-[#00FF85]/10'
                          : 'bg-[#12151c] text-gray-500 border-gray-800 line-through opacity-60'
                      }`}
                    >
                      {isEnabled ? <Check className="w-3.5 h-3.5 text-[#00FF85]" /> : null}
                      <span>{divName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Default League Filter Settings */}
          {allLeagues.length > 0 && (
            <div className="p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-sm text-white">Filtro de Ligas no Sorteio</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Desative ligas do sorteio sem apagar os clubes do banco de dados (ex: se uma liga sair do jogo, pode ser ocultada temporariamente).
                  </p>
                </div>

                {/* Bulk Enable / Disable */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={enableAllLeagues}
                    className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-bold text-emerald-400 border border-gray-700 transition-colors cursor-pointer"
                  >
                    Ativar Todas
                  </button>
                  <button
                    type="button"
                    onClick={disableAllLeagues}
                    className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-bold text-gray-400 border border-gray-700 transition-colors cursor-pointer"
                  >
                    Desativar Todas
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pt-1 pr-1 custom-scrollbar">
                {allLeagues.map((leagueName) => {
                  const isExcluded = (settings.excludedLeagues || []).includes(leagueName);
                  const isEnabled = !isExcluded;
                  const logo = getLeagueLogo(leagueName);

                  return (
                    <button
                      key={leagueName}
                      type="button"
                      onClick={() => toggleLeagueDefault(leagueName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                        isEnabled
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-sm'
                          : 'bg-[#12151c] text-gray-500 border-gray-800 line-through opacity-50'
                      }`}
                    >
                      {logo ? (
                        <img src={logo} alt={leagueName} className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />
                      ) : null}
                      <span>{leagueName}</span>
                      {isEnabled ? <Check className="w-3 h-3 text-cyan-400 ml-0.5" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Default Country Filter Settings */}
          {allCountries.length > 0 && (
            <div className="p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-white">Filtro de Países no Sorteio</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Ative ou desative países específicos do sorteio aleatório sem excluir seus clubes.
                  </p>
                </div>

                {/* Bulk Enable / Disable */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={enableAllCountries}
                    className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-bold text-emerald-400 border border-gray-700 transition-colors cursor-pointer"
                  >
                    Ativar Todos
                  </button>
                  <button
                    type="button"
                    onClick={disableAllCountries}
                    className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-bold text-gray-400 border border-gray-700 transition-colors cursor-pointer"
                  >
                    Desativar Todos
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pt-1 pr-1 custom-scrollbar">
                {allCountries.map((countryName) => {
                  const isExcluded = (settings.excludedCountries || []).includes(countryName);
                  const isEnabled = !isExcluded;
                  const flag = getCountryFlag(countryName);

                  return (
                    <button
                      key={countryName}
                      type="button"
                      onClick={() => toggleCountryDefault(countryName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                        isEnabled
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-[#12151c] text-gray-500 border-gray-800 line-through opacity-50'
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{countryName}</span>
                      {isEnabled ? <Check className="w-3 h-3 text-emerald-400 ml-0.5" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* League Logos Management Card */}
          <div className="p-4 bg-[#0a0b0e] border border-gray-800 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-sm text-white truncate">Logos Oficiais das Ligas</span>
                <span className="text-xs text-gray-500 truncate block">Personalizar, enviar imagens ou importar mapeamentos JSON</span>
              </div>
            </div>

            <button
              type="button"
              id="settings-manage-league-logos-btn"
              onClick={() => setShowLeagueLogosModal(true)}
              className="py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
            >
              Gerenciar
            </button>
          </div>

          {/* Clear Database Danger Button */}
          <div className="pt-4 border-t border-gray-800">
            <button
              id="settings-clear-database-btn"
              onClick={() => setShowClearModal(true)}
              className="w-full py-4 px-6 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
              <span>{getTranslation(lang, 'clearDatabase')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Database */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12151c] border-2 border-red-500 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <h3 className="text-xl font-black uppercase tracking-tight">
                Atenção Crítica
              </h3>
            </div>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {getTranslation(lang, 'clearDatabaseConfirm')}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="py-2.5 px-5 rounded-xl bg-gray-800 text-gray-300 font-bold text-xs hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {getTranslation(lang, 'cancel')}
              </button>

              <button
                id="confirm-clear-db-btn"
                onClick={confirmClearDatabase}
                className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase transition-colors cursor-pointer"
              >
                {getTranslation(lang, 'yesClear')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for League Logos */}
      {showLeagueLogosModal && (
        <LeagueLogosModal
          settings={settings}
          clubs={clubs}
          onClose={() => setShowLeagueLogosModal(false)}
          onUpdate={() => {}}
        />
      )}
    </div>
  );
};

import React from 'react';
import { Settings, Language } from '../types';
import { getTranslation } from '../services/i18n';
import { Dices, History, BarChart3, FileSpreadsheet, Settings as SettingsIcon, Trophy, Sparkles, Shield } from 'lucide-react';

interface HomeViewProps {
  settings: Settings;
  onNavigate: (view: 'new_series' | 'history' | 'stats' | 'import' | 'settings' | 'clubs') => void;
  clubsCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ settings, onNavigate, clubsCount }) => {
  const lang = settings.language || 'pt';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Big EA FC 26 Logo Hero Section */}
      <div className="text-center my-6 relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#00FF85]/20 via-[#00E5FF]/20 to-[#FFD700]/20 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />

        <div className="relative inline-flex items-center justify-center p-4 bg-[#0a0b0e] border-2 border-[#00FF85] rounded-3xl shadow-2xl shadow-[#00FF85]/30 mb-4">
          <Trophy className="w-16 h-16 text-[#00FF85] drop-shadow-[0_0_15px_rgba(0,255,133,0.6)]" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans uppercase drop-shadow-md">
          EA FC 26 <span className="text-[#00FF85]">CLUB DRAFT</span>
        </h1>
        <p className="text-gray-400 font-medium text-sm sm:text-base mt-2 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00FF85]" />
          <span>Sorteador Oficial de Clubes Masculinos</span>
          <span className="bg-[#00FF85]/10 text-[#00FF85] text-xs px-2 py-0.5 rounded-full font-mono border border-[#00FF85]/30">
            {clubsCount} Clubes
          </span>
        </p>
      </div>

      {/* Main Menu Grid Buttons */}
      <div className="w-full max-w-md flex flex-col gap-4 mt-6">
        {/* Nova Série - Hero Green Glowing Button */}
        <button
          id="menu-btn-new-series"
          onClick={() => onNavigate('new_series')}
          className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-xl tracking-wider uppercase shadow-xl shadow-[#00FF85]/25 hover:shadow-[#00FF85]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between border-2 border-white/50 cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-black/10 rounded-xl">
              <Dices className="w-8 h-8 text-[#0a0b0e]" />
            </div>
            <span className="font-extrabold">{getTranslation(lang, 'newSeries')}</span>
          </div>
          <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
        </button>

        {/* Histórico */}
        <button
          id="menu-btn-history"
          onClick={() => onNavigate('history')}
          className="w-full py-4 px-6 rounded-2xl bg-[#12151c] hover:bg-[#1a1f2c] border border-gray-800 hover:border-[#00FF85]/50 text-white font-extrabold text-lg transition-all flex items-center justify-between shadow-lg cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00FF85]/10 text-[#00FF85] rounded-xl border border-[#00FF85]/20">
              <History className="w-6 h-6" />
            </div>
            <span>{getTranslation(lang, 'history')}</span>
          </div>
          <span className="text-gray-500 group-hover:text-[#00FF85] transition-colors">→</span>
        </button>

        {/* Ver / Gerenciar Clubes */}
        <button
          id="menu-btn-clubs"
          onClick={() => onNavigate('clubs')}
          className="w-full py-4 px-6 rounded-2xl bg-[#12151c] hover:bg-[#1a1f2c] border border-gray-800 hover:border-[#00FF85]/50 text-white font-extrabold text-lg transition-all flex items-center justify-between shadow-lg cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00FF85]/10 text-[#00FF85] rounded-xl border border-[#00FF85]/20">
              <Shield className="w-6 h-6 text-[#00FF85]" />
            </div>
            <span>{getTranslation(lang, 'manageClubs')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#00FF85]/10 text-[#00FF85] font-mono font-bold px-2 py-0.5 rounded-full border border-[#00FF85]/30">
              {clubsCount}
            </span>
            <span className="text-gray-500 group-hover:text-[#00FF85] transition-colors">→</span>
          </div>
        </button>

        {/* Estatísticas */}
        <button
          id="menu-btn-stats"
          onClick={() => onNavigate('stats')}
          className="w-full py-4 px-6 rounded-2xl bg-[#12151c] hover:bg-[#1a1f2c] border border-gray-800 hover:border-[#00FF85]/50 text-white font-extrabold text-lg transition-all flex items-center justify-between shadow-lg cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl border border-[#00E5FF]/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span>{getTranslation(lang, 'statistics')}</span>
          </div>
          <span className="text-gray-500 group-hover:text-[#00E5FF] transition-colors">→</span>
        </button>

        {/* Importar Clubes */}
        <button
          id="menu-btn-import"
          onClick={() => onNavigate('import')}
          className="w-full py-4 px-6 rounded-2xl bg-[#12151c] hover:bg-[#1a1f2c] border border-gray-800 hover:border-amber-400/50 text-white font-extrabold text-lg transition-all flex items-center justify-between shadow-lg cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <span>{getTranslation(lang, 'importClubs')}</span>
          </div>
          <span className="text-gray-500 group-hover:text-amber-400 transition-colors">→</span>
        </button>

        {/* Configurações */}
        <button
          id="menu-btn-settings"
          onClick={() => onNavigate('settings')}
          className="w-full py-4 px-6 rounded-2xl bg-[#12151c] hover:bg-[#1a1f2c] border border-gray-800 hover:border-gray-600 text-gray-300 hover:text-white font-bold text-base transition-all flex items-center justify-between shadow-lg cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 text-gray-300 rounded-xl">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <span>{getTranslation(lang, 'settings')}</span>
          </div>
          <span className="text-gray-500 group-hover:text-white transition-colors">→</span>
        </button>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center text-xs text-gray-500 font-mono">
        EA FC 26 CLUB DRAFT v1.0 • Standalone Offline App
      </div>
    </div>
  );
};

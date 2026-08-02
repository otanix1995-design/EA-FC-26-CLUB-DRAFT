import React from 'react';
import { Volume2, VolumeX, Sun, Moon, ArrowLeft } from 'lucide-react';
import { Settings, Language } from '../types';
import { getTranslation } from '../services/i18n';

interface HeaderProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  onNavigateHome?: () => void;
  showBack?: boolean;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onNavigateHome,
  showBack = false,
  title,
}) => {
  const lang = settings.language || 'pt';

  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const toggleDarkMode = () => {
    onUpdateSettings({ ...settings, darkMode: !settings.darkMode });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0b0e]/90 border-b border-[#00FF85]/20 px-4 py-3 shadow-lg shadow-[#00FF85]/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onNavigateHome && (
            <button
              id="header-back-button"
              onClick={onNavigateHome}
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-[#00FF85] transition-all border border-[#00FF85]/30 hover:border-[#00FF85] flex items-center justify-center cursor-pointer"
              title={getTranslation(lang, 'backToHome')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* EA FC Neon Badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF85] via-[#02E374] to-[#00994D] p-[2px] shadow-lg shadow-[#00FF85]/20 group-hover:shadow-[#00FF85]/40 transition-all">
              <div className="w-full h-full bg-[#0a0b0e] rounded-[10px] flex items-center justify-center font-black text-xs text-[#00FF85] tracking-tighter border border-[#00FF85]/30">
                FC26
              </div>
            </div>

            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                {title || getTranslation(lang, 'appName')}
                <span className="text-[10px] bg-[#00FF85]/10 text-[#00FF85] px-1.5 py-0.5 rounded font-mono font-bold border border-[#00FF85]/30">
                  DRAFT
                </span>
              </h1>
              {!title && (
                <p className="text-[11px] text-gray-400 -mt-0.5 hidden sm:block">
                  {getTranslation(lang, 'tagline')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            id="header-toggle-sound"
            onClick={toggleSound}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center cursor-pointer ${
              settings.soundEnabled
                ? 'bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/40 hover:bg-[#00FF85]/20'
                : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:text-white'
            }`}
            title={getTranslation(lang, 'rouletteSound')}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="header-toggle-theme"
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center cursor-pointer ${
              settings.darkMode
                ? 'bg-gray-800 text-amber-400 border-amber-400/30 hover:border-amber-400'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title={getTranslation(lang, 'darkMode')}
          >
            {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

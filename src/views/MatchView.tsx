import React, { useState } from 'react';
import { Series, Settings } from '../types';
import { ClubCard } from '../components/ClubCard';
import { getTranslation } from '../services/i18n';
import { Save, ShieldAlert, Trophy } from 'lucide-react';

interface MatchViewProps {
  series: Series;
  settings: Settings;
  onSaveResult: (p1Goals: number, p2Goals: number) => void;
}

export const MatchView: React.FC<MatchViewProps> = ({
  series,
  settings,
  onSaveResult,
}) => {
  const [p1Goals, setP1Goals] = useState<number>(0);
  const [p2Goals, setP2Goals] = useState<number>(0);

  const lang = settings.language || 'pt';

  const p1Club = series.currentP1Club;
  const p2Club = series.currentP2Club;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveResult(Math.max(0, p1Goals), Math.max(0, p2Goals));
  };

  if (!p1Club || !p2Club) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Series Overall Leaderboard Header */}
      <div className="w-full max-w-2xl bg-[#12151c] border border-gray-800 rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-400 mb-2 border-b border-gray-800 pb-2">
          <span>PLACAR DA SÉRIE (Melhor de {series.format})</span>
          <span className="text-[#00FF85]">Precisa de {series.winsToWin} vitórias</span>
        </div>

        <div className="grid grid-cols-3 items-center text-center">
          <div className="flex flex-col items-center">
            <span className="text-base font-black text-[#00FF85]">{series.player1Name}</span>
            <span className="text-2xl font-mono font-black text-white">{series.player1Wins}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 font-bold uppercase">{getTranslation(lang, 'draws')}</span>
            <span className="text-lg font-mono font-bold text-gray-300">{series.draws}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-base font-black text-cyan-400">{series.player2Name}</span>
            <span className="text-2xl font-mono font-black text-white">{series.player2Wins}</span>
          </div>
        </div>
      </div>

      {/* Match Cards Display */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-center">
        <div className="flex flex-col items-center">
          <ClubCard club={p1Club} playerTitle={series.player1Name} size="small" />
        </div>

        <div className="flex flex-col items-center">
          <ClubCard club={p2Club} playerTitle={series.player2Name} size="small" />
        </div>
      </div>

      {/* Score Entry Box */}
      <div className="w-full max-w-md bg-[#12151c] border-2 border-[#00FF85]/40 rounded-3xl p-6 shadow-2xl shadow-[#00FF85]/10">
        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-[#00FF85]" />
            {getTranslation(lang, 'registerResult')}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Informe o placar final da partida</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* P1 Goals */}
            <div className="flex flex-col items-center bg-[#0a0b0e] p-4 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-[#00FF85] mb-2 truncate max-w-full">
                {series.player1Name}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setP1Goals(Math.max(0, p1Goals - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-black text-xl flex items-center justify-center cursor-pointer border border-gray-700"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={p1Goals}
                  onChange={(e) => setP1Goals(parseInt(e.target.value) || 0)}
                  className="w-16 h-12 bg-transparent text-center font-mono font-black text-3xl text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setP1Goals(p1Goals + 1)}
                  className="w-10 h-10 rounded-xl bg-[#00FF85]/20 hover:bg-[#00FF85]/30 text-[#00FF85] font-black text-xl flex items-center justify-center cursor-pointer border border-[#00FF85]/40"
                >
                  +
                </button>
              </div>
            </div>

            {/* P2 Goals */}
            <div className="flex flex-col items-center bg-[#0a0b0e] p-4 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-cyan-400 mb-2 truncate max-w-full">
                {series.player2Name}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setP2Goals(Math.max(0, p2Goals - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-black text-xl flex items-center justify-center cursor-pointer border border-gray-700"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={p2Goals}
                  onChange={(e) => setP2Goals(parseInt(e.target.value) || 0)}
                  className="w-16 h-12 bg-transparent text-center font-mono font-black text-3xl text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setP2Goals(p2Goals + 1)}
                  className="w-10 h-10 rounded-xl bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 font-black text-xl flex items-center justify-center cursor-pointer border border-cyan-400/40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            id="save-match-result-btn"
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-xl uppercase tracking-wider shadow-xl shadow-[#00FF85]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/40"
          >
            <Save className="w-6 h-6" />
            <span>{getTranslation(lang, 'saveResult')}</span>
          </button>
        </form>
      </div>

      {/* Notice info */}
      <div className="mt-6 text-xs text-gray-500 font-mono text-center flex items-center justify-center gap-1.5">
        <ShieldAlert className="w-4 h-4 text-amber-400" />
        <span>O próximo sorteio de clubes será iniciado automaticamente para o próximo jogo.</span>
      </div>
    </div>
  );
};

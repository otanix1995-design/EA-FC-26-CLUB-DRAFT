import React from 'react';
import { Series, Settings } from '../types';
import { ConfettiTrigger } from '../components/Confetti';
import { getTranslation } from '../services/i18n';
import { Trophy, Dices, Home, Award, Calendar, CheckCircle } from 'lucide-react';

interface WinnerViewProps {
  series: Series;
  settings: Settings;
  onNewSeries: () => void;
  onHome: () => void;
}

export const WinnerView: React.FC<WinnerViewProps> = ({
  series,
  settings,
  onNewSeries,
  onHome,
}) => {
  const lang = settings.language || 'pt';

  const winnerName = series.winnerName || 'Campeão';
  const p1Wins = series.player1Wins;
  const p2Wins = series.player2Wins;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center">
      <ConfettiTrigger />

      {/* Trophy Hero Card */}
      <div className="w-full bg-[#12151c] border-2 border-[#FFD700] rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl shadow-[#FFD700]/20 my-4 animate-fadeIn">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#00FF85] to-amber-400" />

        {/* Floating Trophy Icon */}
        <div className="inline-flex items-center justify-center p-5 rounded-full bg-gradient-to-br from-amber-400/20 via-amber-300/10 to-transparent border-2 border-[#FFD700] mb-4 shadow-xl shadow-[#FFD700]/30 animate-bounce">
          <Trophy className="w-20 h-20 text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]" />
        </div>

        <span className="block font-mono font-bold text-xs uppercase tracking-widest text-amber-400 mb-1">
          {getTranslation(lang, 'seriesChampion')}
        </span>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase drop-shadow-lg mb-2">
          {winnerName}
        </h1>

        <div className="inline-flex items-center gap-3 bg-black/60 px-6 py-2 rounded-full border border-amber-400/40 text-amber-200 font-mono font-black text-2xl my-2">
          <span>{series.player1Name}: {p1Wins}</span>
          <span className="text-gray-500">-</span>
          <span>{series.player2Name}: {p2Wins}</span>
        </div>
      </div>

      {/* Series Matches Recap Breakdown */}
      <div className="w-full bg-[#12151c] border border-gray-800 rounded-3xl p-6 my-4 shadow-xl">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-800 pb-3">
          <Award className="w-5 h-5 text-[#00FF85]" />
          Resumo dos Jogos da Série
        </h3>

        <div className="flex flex-col gap-3">
          {series.matches.map((m, idx) => {
            const p1Won = m.winnerPlayer === 1;
            const p2Won = m.winnerPlayer === 2;

            return (
              <div
                key={m.id || idx}
                className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Jogo {idx + 1}</span>
                </div>

                {/* Match Result Row */}
                <div className="flex-1 grid grid-cols-3 items-center text-center w-full">
                  {/* P1 */}
                  <div className={`flex flex-col items-center ${p1Won ? 'text-[#00FF85] font-black' : 'text-gray-400'}`}>
                    <span className="text-xs font-bold truncate">{series.player1Name}</span>
                    <span className="text-sm font-semibold">{m.player1Club?.nome}</span>
                  </div>

                  {/* Score */}
                  <div className="font-mono font-black text-xl text-white bg-black/50 py-1 px-3 rounded-xl border border-gray-800 mx-auto">
                    {m.player1Goals} - {m.player2Goals}
                  </div>

                  {/* P2 */}
                  <div className={`flex flex-col items-center ${p2Won ? 'text-cyan-400 font-black' : 'text-gray-400'}`}>
                    <span className="text-xs font-bold truncate">{series.player2Name}</span>
                    <span className="text-sm font-semibold">{m.player2Club?.nome}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <button
          id="winner-new-series-btn"
          onClick={onNewSeries}
          className="py-4 px-6 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-lg uppercase tracking-wider shadow-xl shadow-[#00FF85]/30 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/40"
        >
          <Dices className="w-5 h-5" />
          <span>{getTranslation(lang, 'newSeries')}</span>
        </button>

        <button
          id="winner-home-btn"
          onClick={onHome}
          className="py-4 px-6 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-extrabold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-700"
        >
          <Home className="w-5 h-5" />
          <span>{getTranslation(lang, 'backToHome')}</span>
        </button>
      </div>
    </div>
  );
};

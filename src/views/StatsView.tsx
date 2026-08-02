import React from 'react';
import { Settings } from '../types';
import { db } from '../services/db';
import { getTranslation } from '../services/i18n';
import { BarChart3, Trophy, Flame, Shield, Globe, Award, Zap, PieChart } from 'lucide-react';

interface StatsViewProps {
  settings: Settings;
}

export const StatsView: React.FC<StatsViewProps> = ({ settings }) => {
  const stats = db.getStatistics();
  const lang = settings.language || 'pt';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-[#12151c] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <div className="p-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-2xl border border-[#00E5FF]/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              {getTranslation(lang, 'statistics')}
            </h2>
            <p className="text-xs text-gray-400">Painel Geral de Desempenho & Sorteios</p>
          </div>
        </div>

        {/* Core KPI Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0a0b0e] p-4 rounded-2xl border border-gray-800 flex flex-col justify-between shadow-md">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              {getTranslation(lang, 'totalMatches')}
            </span>
            <span className="text-3xl font-mono font-black text-[#00FF85] mt-1">
              {stats.totalMatches}
            </span>
          </div>

          <div className="bg-[#0a0b0e] p-4 rounded-2xl border border-gray-800 flex flex-col justify-between shadow-md">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              {getTranslation(lang, 'totalSeriesCount')}
            </span>
            <span className="text-3xl font-mono font-black text-cyan-400 mt-1">
              {stats.totalSeries}
            </span>
          </div>

          <div className="bg-[#0a0b0e] p-4 rounded-2xl border border-gray-800 flex flex-col justify-between shadow-md">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              {getTranslation(lang, 'drawsCount')}
            </span>
            <span className="text-3xl font-mono font-black text-amber-400 mt-1">
              {stats.totalDraws}
            </span>
          </div>

          <div className="bg-[#0a0b0e] p-4 rounded-2xl border border-gray-800 flex flex-col justify-between shadow-md">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              {getTranslation(lang, 'winRate')} (P1)
            </span>
            <span className="text-3xl font-mono font-black text-purple-400 mt-1">
              {stats.winRateP1}%
            </span>
          </div>
        </div>

        {/* Top Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Clube Mais Sorteado */}
          <div className="bg-[#0a0b0e] p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" />
              {getTranslation(lang, 'mostDrawnClub')}
            </div>
            <p className="text-xl font-black text-white truncate">
              {stats.mostDrawnClub?.club || 'Nenhum'}
            </p>
            <span className="text-xs text-gray-400 font-mono mt-1 block">
              {stats.mostDrawnClub ? `${stats.mostDrawnClub.count} sorteios` : '-'}
            </span>
          </div>

          {/* Liga Mais Sorteada */}
          <div className="bg-[#0a0b0e] p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4" />
              {getTranslation(lang, 'mostDrawnLeague')}
            </div>
            <p className="text-xl font-black text-white truncate">
              {stats.mostDrawnLeague?.league || 'Nenhuma'}
            </p>
            <span className="text-xs text-gray-400 font-mono mt-1 block">
              {stats.mostDrawnLeague ? `${stats.mostDrawnLeague.count} vezes` : '-'}
            </span>
          </div>

          {/* País Mais Sorteado */}
          <div className="bg-[#0a0b0e] p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#00FF85] text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              {getTranslation(lang, 'mostDrawnCountry')}
            </div>
            <p className="text-xl font-black text-white truncate">
              {stats.mostDrawnCountry?.country || 'Nenhum'}
            </p>
            <span className="text-xs text-gray-400 font-mono mt-1 block">
              {stats.mostDrawnCountry ? `${stats.mostDrawnCountry.count} vezes` : '-'}
            </span>
          </div>

          {/* Maior Sequência de Vitórias */}
          <div className="bg-[#0a0b0e] p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" />
              {getTranslation(lang, 'longestStreak')}
            </div>
            <p className="text-xl font-black text-white truncate">
              {stats.longestWinStreak.player}
            </p>
            <span className="text-xs text-gray-400 font-mono mt-1 block">
              {stats.longestWinStreak.streak} vitórias seguidas
            </span>
          </div>

          {/* Jogador Com Mais Vitórias */}
          <div className="bg-[#0a0b0e] p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4" />
              {getTranslation(lang, 'topPlayer')}
            </div>
            <p className="text-xl font-black text-white truncate">
              {stats.playerWithMostWins.player}
            </p>
            <span className="text-xs text-gray-400 font-mono mt-1 block">
              {stats.playerWithMostWins.wins} vitórias totais
            </span>
          </div>

          {/* Maior Goleada */}
          <div className="bg-[#0a0b0e] p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              {getTranslation(lang, 'biggestBlowout')}
            </div>
            <p className="text-xl font-black text-white truncate">
              {stats.biggestBlowout ? stats.biggestBlowout.score : 'Nenhuma'}
            </p>
            <span className="text-xs text-gray-400 font-mono mt-1 block truncate">
              {stats.biggestBlowout ? stats.biggestBlowout.match : '-'}
            </span>
          </div>
        </div>

        {/* Rankings Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Clubs Ranking */}
          <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Shield className="w-4 h-4 text-[#00FF85]" />
              {getTranslation(lang, 'topClubs')}
            </h3>

            {stats.topClubsRanking.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">Sem dados suficientes.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.topClubsRanking.map((c, idx) => (
                  <div key={c.name} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <span className="w-5 font-mono font-bold text-gray-500">{idx + 1}.</span>
                      <span className="font-bold text-gray-200">{c.name}</span>
                      <span className="text-[10px] text-gray-500">({c.pais})</span>
                    </div>
                    <span className="font-mono font-black text-[#00FF85]">{c.count}x</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Countries Ranking */}
          <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              {getTranslation(lang, 'topCountries')}
            </h3>

            {stats.topCountriesRanking.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">Sem dados suficientes.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.topCountriesRanking.map((c, idx) => (
                  <div key={c.country} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-800/50">
                    <div className="flex items-center gap-2">
                      <span className="w-5 font-mono font-bold text-gray-500">{idx + 1}.</span>
                      <span className="font-bold text-gray-200">{c.country}</span>
                    </div>
                    <span className="font-mono font-black text-cyan-400">{c.count}x</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

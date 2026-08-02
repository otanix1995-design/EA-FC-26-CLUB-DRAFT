import React, { useState } from 'react';
import { Series, Settings } from '../types';
import { db } from '../services/db';
import { getTranslation } from '../services/i18n';
import { History, Search, Trash2, Trophy, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryViewProps {
  settings: Settings;
  onRefresh: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ settings, onRefresh }) => {
  const [history, setHistory] = useState<Series[]>(db.getHistory());
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const lang = settings.language || 'pt';

  const handleDeleteSeries = (id: string) => {
    if (confirm('Deseja realmente excluir este registro de série do histórico?')) {
      const updated = db.deleteSeries(id);
      setHistory(updated);
      onRefresh();
    }
  };

  const handleClearAll = () => {
    if (confirm('Deseja apagar TODO o histórico de séries e partidas? Esta ação é irreversível.')) {
      db.clearAllHistory();
      setHistory([]);
      onRefresh();
    }
  };

  // Search filter
  const filteredHistory = history.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const p1 = s.player1Name.toLowerCase();
    const p2 = s.player2Name.toLowerCase();
    const winner = (s.winnerName || '').toLowerCase();

    const hasClubMatch = s.matches.some(
      (m) =>
        m.player1Club?.nome.toLowerCase().includes(term) ||
        m.player2Club?.nome.toLowerCase().includes(term)
    );

    return p1.includes(term) || p2.includes(term) || winner.includes(term) || hasClubMatch;
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="bg-[#12151c] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#00FF85]/10 text-[#00FF85] rounded-2xl border border-[#00FF85]/30">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                {getTranslation(lang, 'history')}
              </h2>
              <p className="text-xs text-gray-400">
                {history.length} {history.length === 1 ? 'série registrada' : 'séries registradas'}
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              id="clear-all-history-btn"
              onClick={handleClearAll}
              className="py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-red-800/60 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>{getTranslation(lang, 'clearAllHistory')}</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={getTranslation(lang, 'searchHistory')}
            className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] text-white rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00FF85]/20 transition-all"
          />
        </div>

        {/* List of Series */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium text-sm">
            {getTranslation(lang, 'noHistory')}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredHistory.map((s) => {
              const isExpanded = expandedId === s.id;
              const formattedDate = s.createdAt
                ? new Date(s.createdAt).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <div
                  key={s.id}
                  className="bg-[#0a0b0e] border border-gray-800 hover:border-gray-700 rounded-2xl p-4 transition-all shadow-lg"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{formattedDate}</span>
                        <span className="text-[#00FF85] font-bold">• BO{s.format}</span>
                      </div>

                      <div className="flex items-center gap-3 font-extrabold text-base text-white mt-1">
                        <span className={s.winnerPlayer === 1 ? 'text-[#00FF85]' : 'text-gray-300'}>
                          {s.player1Name} ({s.player1Wins})
                        </span>
                        <span className="text-gray-600 font-mono text-xs">VS</span>
                        <span className={s.winnerPlayer === 2 ? 'text-cyan-400' : 'text-gray-300'}>
                          {s.player2Name} ({s.player2Wins})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {s.winnerName && (
                        <div className="hidden sm:flex items-center gap-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>{s.winnerName}</span>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSeries(s.id);
                        }}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                        title={getTranslation(lang, 'delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Matches Detail */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-800/80 flex flex-col gap-2.5 animate-fadeIn">
                      <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                        Partidas & Clubes Sorteados:
                      </span>

                      {s.matches.map((m, mIdx) => (
                        <div
                          key={m.id || mIdx}
                          className="bg-[#12151c] p-3 rounded-xl border border-gray-800 text-xs font-medium flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gray-500">J{mIdx + 1}:</span>
                            <span className="text-gray-200">
                              {m.player1Club?.nome} <span className="text-gray-500">({m.player1Goals})</span>
                            </span>
                          </div>

                          <span className="font-mono text-amber-400 font-bold">x</span>

                          <div className="flex items-center gap-2">
                            <span className="text-gray-200">
                              <span className="text-gray-500">({m.player2Goals})</span> {m.player2Club?.nome}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

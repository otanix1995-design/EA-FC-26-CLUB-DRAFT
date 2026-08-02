import React, { useState, useMemo } from 'react';
import { Settings, SeriesFormat, Club } from '../types';
import { getTranslation } from '../services/i18n';
import { User, Swords, ShieldCheck, Play, Filter, Check, X, Shield } from 'lucide-react';

interface NewSeriesViewProps {
  settings: Settings;
  clubs: Club[];
  onStartSeries: (p1Name: string, p2Name: string, format: SeriesFormat, excludedDivisions?: string[]) => void;
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

  const lang = settings.language || 'pt';

  // Extract unique divisions from available clubs
  const allDivisions = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (c.divisao) set.add(c.divisao);
    });
    return Array.from(set).sort();
  }, [clubs]);

  // Count clubs per division
  const divisionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    clubs.forEach((c) => {
      const d = c.divisao || '1ª Divisão';
      map[d] = (map[d] || 0) + 1;
    });
    return map;
  }, [clubs]);

  // Selected divisions state (default: all divisions except those in settings.excludedDivisions)
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(() => {
    const excluded = settings.excludedDivisions || [];
    return allDivisions.filter((d) => !excluded.includes(d));
  });

  // Calculate active eligible clubs
  const activeClubsCount = useMemo(() => {
    return clubs.filter((c) => selectedDivisions.includes(c.divisao || '1ª Divisão')).length;
  }, [clubs, selectedDivisions]);

  const toggleDivision = (divName: string) => {
    if (selectedDivisions.includes(divName)) {
      setSelectedDivisions(selectedDivisions.filter((d) => d !== divName));
    } else {
      setSelectedDivisions([...selectedDivisions, divName]);
    }
  };

  const selectAllDivisions = () => {
    setSelectedDivisions([...allDivisions]);
  };

  const deselectAllDivisions = () => {
    setSelectedDivisions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDivisions.length === 0) return;

    const finalP1 = p1Name.trim() || 'Jogador 1';
    const finalP2 = p2Name.trim() || 'Jogador 2';

    // Excluded divisions are those in allDivisions but not in selectedDivisions
    const excluded = allDivisions.filter((d) => !selectedDivisions.includes(d));
    onStartSeries(finalP1, finalP2, format, excluded);
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

          {/* Division Filter Section */}
          <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-4 h-4" />
                {getTranslation(lang, 'filterDivisions')}
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllDivisions}
                  className="text-[11px] font-bold text-[#00FF85] hover:underline cursor-pointer"
                >
                  {getTranslation(lang, 'selectAll')}
                </button>
                <span className="text-gray-600">•</span>
                <button
                  type="button"
                  onClick={deselectAllDivisions}
                  className="text-[11px] font-bold text-gray-400 hover:text-white hover:underline cursor-pointer"
                >
                  {getTranslation(lang, 'deselectAll')}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mb-3">
              {getTranslation(lang, 'filterDivisionsHint')}
            </p>

            {/* Divisions Pill Grid */}
            <div className="flex flex-wrap gap-2 mb-3">
              {allDivisions.map((divName) => {
                const isSelected = selectedDivisions.includes(divName);
                const count = divisionCounts[divName] || 0;

                return (
                  <button
                    key={divName}
                    type="button"
                    onClick={() => toggleDivision(divName)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/60 shadow-md shadow-[#00FF85]/10'
                        : 'bg-[#12151c] text-gray-500 border-gray-800 hover:border-gray-700 hover:text-gray-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[#00FF85] border-[#00FF85] text-black'
                          : 'border-gray-600'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                    </div>
                    <span>{divName}</span>
                    <span className="text-[10px] font-mono opacity-80 bg-black/40 px-1.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Clubs Summary */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800/80">
              <span className="text-gray-400 flex items-center gap-1 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#00FF85]" />
                {getTranslation(lang, 'availableClubsCount')}
              </span>
              <span className="font-mono font-black text-[#00FF85] text-sm">
                {activeClubsCount} / {clubs.length}
              </span>
            </div>

            {selectedDivisions.length === 0 && (
              <div className="mt-2 text-xs font-bold text-red-400 text-center bg-red-950/40 p-2 rounded-xl border border-red-800/50">
                {getTranslation(lang, 'noDivisionsSelectedWarning')}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="start-series-submit-btn"
            type="submit"
            disabled={selectedDivisions.length === 0}
            className={`w-full mt-2 py-4 px-6 rounded-2xl font-black text-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/40 ${
              selectedDivisions.length > 0
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

import React, { useState, useEffect, useRef } from 'react';
import { Club, Settings } from '../types';
import { audio } from '../services/audio';
import { getTranslation } from '../services/i18n';
import { Dices, RefreshCw, Sparkles, Shield } from 'lucide-react';

interface RouletteWheelProps {
  clubs: Club[];
  excludedClubIds?: string[];
  durationSeconds: number;
  playerName: string;
  settings: Settings;
  onSpinComplete: (winningClub: Club) => void;
  onRespin?: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  clubs,
  excludedClubIds = [],
  durationSeconds,
  playerName,
  settings,
  onSpinComplete,
  onRespin,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [tickerList, setTickerList] = useState<Club[]>([]);
  const [winningClub, setWinningClub] = useState<Club | null>(null);

  const reelRef = useRef<HTMLDivElement>(null);
  const currentPosIndexRef = useRef<number>(0);
  const spinTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const lang = settings.language || 'pt';

  // Filter out excluded clubs
  const availableClubs = React.useMemo(() => {
    const pool = clubs.filter((c) => !excludedClubIds.includes(c.id));
    return pool.length > 0 ? pool : clubs; // Fallback to all if pool exhausted
  }, [clubs, excludedClubIds]);

  // Build extended repeating reel for smooth scrolling
  useEffect(() => {
    if (availableClubs.length === 0) return;
    const list: Club[] = [];
    for (let i = 0; i < 12; i++) {
      list.push(...availableClubs);
    }
    setTickerList(list);
    currentPosIndexRef.current = 0;
    if (reelRef.current) {
      reelRef.current.style.transition = 'none';
      reelRef.current.style.transform = `translate3d(0, ${72 * 2}px, 0)`;
    }
  }, [availableClubs]);

  const itemHeight = 72; // px per item in reel

  const spin = () => {
    if (isSpinning || availableClubs.length === 0 || tickerList.length === 0) return;

    const reel = reelRef.current;
    if (!reel) return;

    setIsSpinning(true);
    setWinningClub(null);

    if (settings.soundEnabled) {
      audio.playSpinStart();
    }
    if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Pick winning club randomly
    const randomIndex = Math.floor(Math.random() * availableClubs.length);
    const chosenClub = availableClubs[randomIndex];

    // Target index deep inside the tickerList (e.g. near the 80% mark)
    const targetBaseIndex = Math.floor(tickerList.length * 0.75);
    let targetIndex = targetBaseIndex - (targetBaseIndex % availableClubs.length) + randomIndex;
    if (targetIndex >= tickerList.length) {
      targetIndex = tickerList.length - availableClubs.length + randomIndex;
    }

    const spinDurationMs = (durationSeconds || 8) * 1000;

    // Reset position to start position cleanly
    const startPosIndex = currentPosIndexRef.current % availableClubs.length;
    currentPosIndexRef.current = startPosIndex;
    const startOffset = -(startPosIndex * itemHeight) + itemHeight * 2;
    const targetOffset = -(targetIndex * itemHeight) + itemHeight * 2;

    reel.style.transition = 'none';
    reel.style.transform = `translate3d(0, ${startOffset}px, 0)`;

    // Force browser repaint before starting transition
    void reel.offsetHeight;

    // Apply GPU-accelerated smooth ease-out curve
    reel.style.transition = `transform ${spinDurationMs}ms cubic-bezier(0.1, 0.85, 0.15, 1.0)`;
    reel.style.transform = `translate3d(0, ${targetOffset}px, 0)`;

    // Throttled audio tick sound player during spin
    if (settings.soundEnabled) {
      let elapsed = 0;
      const intervalMs = 70;
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

      tickIntervalRef.current = setInterval(() => {
        elapsed += intervalMs;
        // Frequency slows down as wheel decelerates
        const progress = elapsed / spinDurationMs;
        if (progress < 0.95) {
          audio.playTick();
        }
      }, 90);
    }

    // Schedule completion at end of CSS transition
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);

    spinTimerRef.current = setTimeout(() => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

      setIsSpinning(false);
      currentPosIndexRef.current = targetIndex;
      setWinningClub(chosenClub);

      if (settings.soundEnabled) {
        audio.playFanfare();
      }
      if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 300]);
      }

      onSpinComplete(chosenClub);
    }, spinDurationMs);
  };

  useEffect(() => {
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  const initialOffset = -(currentPosIndexRef.current * itemHeight) + itemHeight * 2;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 py-4">
      {/* Player Turn Banner */}
      <div className="flex items-center gap-2 bg-[#00FF85]/10 border border-[#00FF85]/40 px-5 py-2 rounded-full shadow-lg shadow-[#00FF85]/10">
        <Sparkles className="w-5 h-5 text-[#00FF85] animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-gray-300 font-medium text-sm">Vez de:</span>
        <span className="text-[#00FF85] font-black uppercase text-base tracking-wide">
          {playerName}
        </span>
      </div>

      {/* Casino Ticker Cylinder Container */}
      <div className="relative w-full h-72 rounded-3xl bg-[#0a0b0e] border-2 border-[#00FF85]/50 shadow-2xl shadow-[#00FF85]/20 overflow-hidden flex flex-col items-center justify-center">
        {/* Glow & Depth Overlays */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0a0b0e] via-[#0a0b0e]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/90 to-transparent z-10 pointer-events-none" />

        {/* Center Target Pointer / Selector Line */}
        <div className="absolute inset-x-2 top-[108px] h-[72px] bg-gradient-to-r from-[#00FF85]/15 via-[#00FF85]/30 to-[#00FF85]/15 border-y-2 border-[#00FF85] z-20 pointer-events-none rounded-xl flex items-center justify-between px-3 shadow-xl shadow-[#00FF85]/30">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#00FF85] rounded-full animate-ping" />
            <div className="w-2 h-4 bg-[#00FF85] rounded-sm" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-4 bg-[#00FF85] rounded-sm" />
            <div className="w-3 h-3 bg-[#00FF85] rounded-full animate-ping" />
          </div>
        </div>

        {/* Moving Club Ticker Reel */}
        <div
          ref={reelRef}
          className="w-full"
          style={{
            transform: `translate3d(0, ${initialOffset}px, 0)`,
            willChange: 'transform',
          }}
        >
          {tickerList.map((club, idx) => (
            <div
              key={`${club.id}_${idx}`}
              style={{ height: `${itemHeight}px` }}
              className="flex items-center justify-between px-6 border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white border border-white/20 shadow overflow-hidden relative shrink-0 bg-gray-900"
                  style={{ backgroundColor: club.logoUrl ? '#111827' : (club.badgeColor || '#222') }}
                >
                  {club.logoUrl ? (
                    <img
                      src={club.logoUrl}
                      alt={club.nome}
                      className="w-full h-full object-contain p-0.5"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Shield className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <span className="truncate font-black text-white text-base">{club.nome}</span>
              </div>

              <div className="text-right text-xs font-mono font-semibold text-gray-300">
                <span>{club.pais}</span>
                <span className="block text-[10px] text-amber-400 font-bold">{club.liga}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spin / Respin Buttons */}
      <div className="w-full flex flex-col items-center gap-3">
        {!isSpinning ? (
          <button
            id="roulette-spin-button"
            onClick={spin}
            disabled={availableClubs.length === 0}
            className="w-full max-w-xs py-4 px-8 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-xl tracking-wider uppercase shadow-xl shadow-[#00FF85]/30 hover:shadow-[#00FF85]/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/40 cursor-pointer"
          >
            <Dices className="w-7 h-7" />
            <span>{winningClub ? getTranslation(lang, 'respin') : getTranslation(lang, 'spin')}</span>
          </button>
        ) : (
          <div className="w-full max-w-xs py-4 px-8 rounded-2xl bg-gray-800/90 border border-[#00FF85]/40 text-[#00FF85] font-extrabold text-lg flex items-center justify-center gap-3 animate-pulse shadow-lg">
            <RefreshCw className="w-6 h-6 animate-spin text-[#00FF85]" />
            <span>{getTranslation(lang, 'spinning')} ({durationSeconds}s)</span>
          </div>
        )}

        {onRespin && !isSpinning && winningClub && (
          <button
            type="button"
            onClick={onRespin}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider underline cursor-pointer flex items-center gap-1.5 py-1 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'clubNotInGame')}</span>
          </button>
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { Club, Settings } from '../types';
import { audio } from '../services/audio';
import { getTranslation } from '../services/i18n';
import { Dices, Trophy, RefreshCw, Sparkles, Shield } from 'lucide-react';

interface RouletteWheelProps {
  clubs: Club[];
  excludedClubIds?: string[];
  durationSeconds: number;
  playerName: string;
  settings: Settings;
  onSpinComplete: (winningClub: Club) => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  clubs,
  excludedClubIds = [],
  durationSeconds,
  playerName,
  settings,
  onSpinComplete,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tickerList, setTickerList] = useState<Club[]>([]);
  const [winningClub, setWinningClub] = useState<Club | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const lang = settings.language || 'pt';

  // Filter out excluded clubs
  const availableClubs = React.useMemo(() => {
    const pool = clubs.filter((c) => !excludedClubIds.includes(c.id));
    return pool.length > 0 ? pool : clubs; // Fallback to all if pool exhausted
  }, [clubs, excludedClubIds]);

  // Build extended repeating reel for infinite visual scrolling
  useEffect(() => {
    if (availableClubs.length === 0) return;
    // Repeat candidate clubs to build a long horizontal/vertical reel (e.g. 150 items)
    const list: Club[] = [];
    for (let i = 0; i < 20; i++) {
      list.push(...availableClubs);
    }
    setTickerList(list);
  }, [availableClubs]);

  const spin = () => {
    if (isSpinning || availableClubs.length === 0) return;

    if (settings.soundEnabled) {
      audio.playSpinStart();
    }
    if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    setIsSpinning(true);
    setWinningClub(null);

    // Pick winning club randomly with equal probability
    const randomIndex = Math.floor(Math.random() * availableClubs.length);
    const chosenClub = availableClubs[randomIndex];

    // Find a target index deep inside the tickerList so the wheel spins smoothly for full duration
    const targetBaseIndex = Math.floor(tickerList.length * 0.75);
    let targetIndex = targetBaseIndex - (targetBaseIndex % availableClubs.length) + randomIndex;
    if (targetIndex >= tickerList.length) {
      targetIndex = tickerList.length - availableClubs.length + randomIndex;
    }

    const startTime = performance.now();
    const spinDurationMs = (durationSeconds || 8) * 1000;
    const startIndex = selectedIndex;
    const totalDistance = targetIndex - startIndex;

    let lastTickIdx = startIndex;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDurationMs, 1);

      // Ease-out cubic for realistic casino wheel deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentIndex = Math.floor(startIndex + totalDistance * easeOut);

      setSelectedIndex(currentIndex);

      // Play tick sound on item change
      if (currentIndex !== lastTickIdx) {
        lastTickIdx = currentIndex;
        if (settings.soundEnabled && Math.random() > 0.1) {
          audio.playTick();
        }
        if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(15);
        }
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateSpin);
      } else {
        // Spin finished
        setIsSpinning(false);
        setSelectedIndex(targetIndex);
        setWinningClub(chosenClub);

        if (settings.soundEnabled) {
          audio.playFanfare();
        }
        if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([200, 100, 300]);
        }

        onSpinComplete(chosenClub);
      }
    };

    animationRef.current = requestAnimationFrame(animateSpin);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const itemHeight = 72; // px per item in reel
  const offset = -(selectedIndex * itemHeight) + itemHeight * 2; // Center offset

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
        {/* Glow Effects */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0a0b0e] via-[#0a0b0e]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/80 to-transparent z-10 pointer-events-none" />

        {/* Center Target Pointer / Selector Line */}
        <div className="absolute inset-x-2 top-[108px] h-[72px] bg-gradient-to-r from-[#00FF85]/10 via-[#00FF85]/25 to-[#00FF85]/10 border-y-2 border-[#00FF85] z-20 pointer-events-none rounded-xl flex items-center justify-between px-3 shadow-lg shadow-[#00FF85]/20">
          <div className="w-3 h-3 bg-[#00FF85] rounded-full animate-ping" />
          <div className="w-3 h-3 bg-[#00FF85] rounded-full animate-ping" />
        </div>

        {/* Moving Club Ticker Reel */}
        <div
          ref={containerRef}
          className="w-full transition-transform ease-out"
          style={{
            transform: `translateY(${offset}px)`,
          }}
        >
          {tickerList.map((club, idx) => {
            const isTarget = idx === selectedIndex;
            return (
              <div
                key={`${club.id}_${idx}`}
                className={`h-[72px] flex items-center justify-between px-6 transition-all duration-150 ${
                  isTarget
                    ? 'scale-105 opacity-100 font-black text-white text-lg'
                    : 'scale-95 opacity-30 text-gray-400 text-sm'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white border border-white/20 shadow overflow-hidden relative shrink-0"
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
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                  <span className="truncate">{club.nome}</span>
                </div>

                <div className="text-right text-xs font-mono font-semibold text-gray-400">
                  <span>{club.pais}</span>
                  <span className="block text-[10px] text-amber-400/80">{club.liga}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spin Button */}
      <div className="w-full flex justify-center">
        {!isSpinning ? (
          <button
            id="roulette-spin-button"
            onClick={spin}
            disabled={availableClubs.length === 0}
            className="w-full max-w-xs py-4 px-8 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-xl tracking-wider uppercase shadow-xl shadow-[#00FF85]/30 hover:shadow-[#00FF85]/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/40 cursor-pointer"
          >
            <Dices className="w-7 h-7" />
            <span>{getTranslation(lang, 'spin')}</span>
          </button>
        ) : (
          <div className="w-full max-w-xs py-4 px-8 rounded-2xl bg-gray-800/90 border border-[#00FF85]/40 text-[#00FF85] font-extrabold text-lg flex items-center justify-center gap-3 animate-pulse shadow-lg">
            <RefreshCw className="w-6 h-6 animate-spin text-[#00FF85]" />
            <span>{getTranslation(lang, 'spinning')} ({durationSeconds}s)</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Club, Settings } from '../types';
import { audio } from '../services/audio';
import { getTranslation } from '../services/i18n';
import { getLeagueLogo } from '../services/leagueLogos';
import { CountryFlag } from './CountryFlag';
import { Dices, Sparkles, Shield, Trophy, Globe, TrendingUp, FastForward, CheckCircle2, RefreshCw } from 'lucide-react';

interface RouletteWheelProps {
  clubs: Club[];
  excludedClubIds?: string[];
  durationSeconds?: number;
  playerName: string;
  settings: Settings;
  onSpinComplete: (winningClub: Club) => void;
  onRespin?: () => void;
}

// Country flag emoji mapping helper
export function getCountryFlag(pais: string): string {
  if (!pais) return '🌍';
  const name = pais.trim().toLowerCase();

  if (name.includes('espanha') || name.includes('spain')) return '🇪🇸';
  if (name.includes('inglaterra') || name.includes('england')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
  if (name.includes('itália') || name.includes('italy')) return '🇮🇹';
  if (name.includes('alemanha') || name.includes('germany')) return '🇩🇪';
  if (name.includes('frança') || name.includes('france')) return '🇫🇷';
  if (name.includes('brasil') || name.includes('brazil')) return '🇧🇷';
  if (name.includes('portugal')) return '🇵🇹';
  if (name.includes('argentina')) return '🇦🇷';
  if (name.includes('holanda') || name.includes('netherlands') || name.includes('países baixos')) return '🇳🇱';
  if (name.includes('bélgica') || name.includes('belgium')) return '🇧🇪';
  if (name.includes('estados unidos') || name.includes('eua') || name.includes('usa')) return '🇺🇸';
  if (name.includes('arábia') || name.includes('saudi')) return '🇸🇦';
  if (name.includes('equador') || name.includes('ecuador')) return '🇪🇨';
  if (name.includes('romênia') || name.includes('romania')) return '🇷🇴';
  if (name.includes('uruguai') || name.includes('uruguay')) return '🇺🇾';
  if (name.includes('colômbia') || name.includes('colombia')) return '🇨🇴';
  if (name.includes('méxico') || name.includes('mexico')) return '🇲🇽';
  if (name.includes('turquia') || name.includes('turkey')) return '🇹🇷';
  if (name.includes('grécia') || name.includes('greece')) return '🇬🇷';
  if (name.includes('escócia') || name.includes('scotland')) return '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
  if (name.includes('áustria') || name.includes('austria')) return '🇦🇹';
  if (name.includes('suíça') || name.includes('switzerland')) return '🇨🇭';
  if (name.includes('suécia') || name.includes('sweden')) return '🇸🇪';
  if (name.includes('dinamarca') || name.includes('denmark')) return '🇩🇰';
  if (name.includes('noruega') || name.includes('norway')) return '🇳🇴';
  if (name.includes('japão') || name.includes('japan')) return '🇯🇵';
  if (name.includes('coreia') || name.includes('korea')) return '🇰🇷';

  return '🌍';
}

// Canvas Tunnel & Sparks Background Component
const CanvasTunnel: React.FC<{ phase: string }> = ({ phase }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Tunnel Rings
    const rings: { z: number }[] = [];
    for (let i = 0; i < 12; i++) {
      rings.push({ z: (i / 12) * 1000 });
    }

    // Particles/Sparks
    const particles: { x: number; y: number; z: number; size: number; color: string }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? '#00FF85' : '#02E374',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Draw 3D Tunnel Rings
      rings.forEach((ring) => {
        ring.z -= phase === 'SUSPENSE' ? 18 : 10;
        if (ring.z <= 10) ring.z += 1000;

        const scale = 500 / ring.z;
        const radiusX = Math.min(width * 1.5, 200 * scale);
        const radiusY = Math.min(height * 1.5, 140 * scale);

        ctx.beginPath();
        ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle =
          phase === 'SUSPENSE'
            ? `rgba(255, 180, 0, ${Math.min(1, scale * 0.5)})`
            : `rgba(0, 255, 133, ${Math.min(1, scale * 0.5)})`;
        ctx.lineWidth = Math.max(1, 3 * scale);
        ctx.stroke();
      });

      // Draw Sparks
      particles.forEach((p) => {
        p.z -= phase === 'SUSPENSE' ? 22 : 12;
        if (p.z <= 10) {
          p.z += 1000;
          p.x = (Math.random() - 0.5) * width;
          p.y = (Math.random() - 0.5) * height;
        }

        const scale = 400 / p.z;
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = phase === 'SUSPENSE' ? '#FFD700' : p.color;
          ctx.shadowBlur = 8 * scale;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [phase]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />;
};

type RevealPhase = 'IDLE' | 'TUNNEL' | 'COUNTRY' | 'LEAGUE' | 'DIVISION' | 'SUSPENSE' | 'CLUB_CREST' | 'CLUB_FULL';

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  clubs,
  excludedClubIds = [],
  playerName,
  settings,
  onSpinComplete,
  onRespin,
}) => {
  const [phase, setPhase] = useState<RevealPhase>('IDLE');
  const [chosenClub, setChosenClub] = useState<Club | null>(null);
  const [showClubName, setShowClubName] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lang = settings.language || 'pt';

  // Filter out excluded clubs
  const availableClubs = React.useMemo(() => {
    const pool = clubs.filter((c) => !excludedClubIds.includes(c.id));
    return pool.length > 0 ? pool : clubs;
  }, [clubs, excludedClubIds]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Start the Cinematic Reveal Sequence
  const startReveal = () => {
    if (availableClubs.length === 0 || phase !== 'IDLE') return;

    clearTimer();
    setShowClubName(false);

    // Pick random club with equal probability
    const randomIndex = Math.floor(Math.random() * availableClubs.length);
    const selected = availableClubs[randomIndex];
    setChosenClub(selected);

    // STEP 1: Entrance / Tunnel
    setPhase('TUNNEL');
    if (settings.soundEnabled) audio.playTunnelStart();
    if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Pipeline timeouts
    timerRef.current = setTimeout(() => {
      // STEP 2: Country Reveal
      setPhase('COUNTRY');
      if (settings.soundEnabled) audio.playCountryReveal();

      timerRef.current = setTimeout(() => {
        // STEP 3: League Reveal
        setPhase('LEAGUE');
        if (settings.soundEnabled) audio.playLeagueReveal();

        timerRef.current = setTimeout(() => {
          // STEP 4: Division Reveal
          setPhase('DIVISION');
          if (settings.soundEnabled) audio.playTick();

          timerRef.current = setTimeout(() => {
            // STEP 5: Final Suspense
            setPhase('SUSPENSE');
            if (settings.soundEnabled) audio.playFinalSuspense();
            if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([100, 100, 100]);
            }

            timerRef.current = setTimeout(() => {
              // STEP 6: Club Crest Reveal
              setPhase('CLUB_CREST');
              if (settings.soundEnabled) audio.playFanfare();
              if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([150, 80, 250]);
              }

              // Reveal name 1s later
              timerRef.current = setTimeout(() => {
                setShowClubName(true);
                setPhase('CLUB_FULL');
                onSpinComplete(selected);
              }, 1000);
            }, 1800);
          }, 1500);
        }, 1800);
      }, 1800);
    }, 2800);
  };

  // Immediate Skip (Pular)
  const skipAnimation = () => {
    clearTimer();
    if (!chosenClub) return;

    setShowClubName(true);
    setPhase('CLUB_FULL');
    if (settings.soundEnabled) audio.playFanfare();
    onSpinComplete(chosenClub);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 py-4">
      {/* IDLE VIEW - SORTEAR CLUBE BUTTON */}
      {phase === 'IDLE' && (
        <div className="w-full flex flex-col items-center gap-6 animate-fadeIn">
          {/* Player Turn Banner */}
          <div className="flex items-center gap-2 bg-[#00FF85]/10 border border-[#00FF85]/40 px-5 py-2 rounded-full shadow-lg shadow-[#00FF85]/10">
            <Sparkles className="w-5 h-5 text-[#00FF85] animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-gray-300 font-medium text-sm">Vez de:</span>
            <span className="text-[#00FF85] font-black uppercase text-base tracking-wide">{playerName}</span>
          </div>

          {/* Stadium Preview Card */}
          <div className="relative w-full h-64 rounded-3xl bg-[#0a0b0e] border-2 border-[#00FF85]/40 shadow-2xl shadow-[#00FF85]/20 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00FF85]/15 via-transparent to-transparent pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-[#00FF85]/20 border border-[#00FF85]/50 flex items-center justify-center mb-3 shadow-lg shadow-[#00FF85]/30">
              <Dices className="w-9 h-9 text-[#00FF85]" />
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-wider">Pronto para Sorteio</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Sorteie um clube aleatório de forma cinematográfica e justa
            </p>

            <div className="mt-4 px-3 py-1 rounded-full bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400 font-mono">
              ⚽ {availableClubs.length} clubes elegíveis
            </div>
          </div>

          {/* Main Action Button: SORTEAR CLUBE */}
          <button
            id="draw-club-main-btn"
            onClick={startReveal}
            disabled={availableClubs.length === 0}
            className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-xl tracking-wider uppercase shadow-2xl shadow-[#00FF85]/40 hover:shadow-[#00FF85]/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/50 cursor-pointer"
          >
            <Dices className="w-7 h-7" />
            <span>{getTranslation(lang, 'drawClub')}</span>
          </button>
        </div>
      )}

      {/* CINEMATIC REVEAL MODAL STAGE (Phases 1-7) */}
      {phase !== 'IDLE' && (
        <div className="relative w-full min-h-[420px] rounded-3xl bg-[#050608] border-2 border-[#00FF85]/50 shadow-2xl shadow-[#00FF85]/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          {/* Canvas Tunnel */}
          <CanvasTunnel phase={phase} />

          {/* Flash / Light Explosions */}
          {phase === 'CLUB_CREST' && (
            <div className="absolute inset-0 bg-white animate-ping opacity-20 pointer-events-none z-30" />
          )}

          {/* Skip Button (Pular) - Discrete at Top Right */}
          {phase !== 'CLUB_FULL' && (
            <button
              type="button"
              onClick={skipAnimation}
              className="absolute top-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-gray-900/80 hover:bg-gray-800 border border-white/20 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer shadow-lg backdrop-blur-md transition-all"
            >
              <FastForward className="w-3.5 h-3.5 text-[#00FF85]" />
              <span>{getTranslation(lang, 'skip')}</span>
            </button>
          )}

          {/* STAGE CONTENT */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center gap-4">
            {/* PHASE 1: TUNNEL */}
            {phase === 'TUNNEL' && (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-[#00FF85]/20 border border-[#00FF85] flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                  <Dices className="w-8 h-8 text-[#00FF85]" />
                </div>
                <h3 className="text-xl font-black text-[#00FF85] uppercase tracking-widest">
                  SORTEANDO CLUBE...
                </h3>
                <p className="text-xs font-mono text-gray-400">Preparando suspense para {playerName}</p>
              </div>
            )}

            {/* PHASE 2: REVELAÇÃO DO PAÍS */}
            {phase === 'COUNTRY' && chosenClub && (
              <div className="flex flex-col items-center gap-3 animate-bounce">
                <div className="flex items-center justify-center drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]">
                  <CountryFlag
                    country={chosenClub.pais}
                    className="text-7xl"
                    imageClassName="w-32 h-20 object-cover rounded-xl border-2 border-white/40 shadow-2xl"
                  />
                </div>
                <span className="text-xs font-black uppercase text-[#00FF85] tracking-widest bg-[#00FF85]/10 border border-[#00FF85]/40 px-3 py-1 rounded-full">
                  🌍 {getTranslation(lang, 'revealingCountry')}
                </span>
                <h2 className="text-3xl font-black text-white uppercase tracking-wider">
                  {chosenClub.pais}
                </h2>
              </div>
            )}

            {/* PHASE 3: REVELAÇÃO DA LIGA */}
            {phase === 'LEAGUE' && chosenClub && (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-amber-400/80 flex items-center justify-center p-3 shadow-2xl shadow-amber-500/30 overflow-hidden backdrop-blur-md">
                  {getLeagueLogo(chosenClub.liga) ? (
                    <img
                      src={getLeagueLogo(chosenClub.liga)}
                      alt={chosenClub.liga}
                      className="w-full h-full object-contain filter drop-shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Trophy className="w-12 h-12 text-amber-400" />
                  )}
                </div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-widest bg-amber-500/10 border border-amber-500/40 px-3 py-1 rounded-full">
                  🏆 {getTranslation(lang, 'revealingLeague')}
                </span>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider max-w-sm">
                  {chosenClub.liga}
                </h2>
              </div>
            )}

            {/* PHASE 4: REVELAÇÃO DA DIVISÃO */}
            {phase === 'DIVISION' && chosenClub && (
              <div className="flex flex-col items-center gap-3 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-xs font-black uppercase text-blue-400 tracking-widest bg-blue-500/10 border border-blue-500/40 px-3 py-1 rounded-full">
                  📈 {getTranslation(lang, 'revealingDivision')}
                </span>
                <h2 className="text-3xl font-black text-white uppercase tracking-wider">
                  {chosenClub.divisao || '1ª Divisão'}
                </h2>
              </div>
            )}

            {/* PHASE 5: SUSPENSE FINAL */}
            {phase === 'SUSPENSE' && (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center shadow-2xl shadow-red-500/50 animate-ping">
                  <Shield className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-red-400 uppercase tracking-widest mt-2">
                  PREPARE-SE...
                </h2>
              </div>
            )}

            {/* PHASE 6 & 7: REVELAÇÃO DO CLUBE */}
            {(phase === 'CLUB_CREST' || phase === 'CLUB_FULL') && chosenClub && (
              <div className="flex flex-col items-center gap-5 w-full animate-fadeIn">
                <span className="text-xs font-black uppercase text-[#00FF85] tracking-widest bg-[#00FF85]/10 border border-[#00FF85]/40 px-4 py-1 rounded-full">
                  ✨ {getTranslation(lang, 'revealingClub')}
                </span>

                {/* Shield / Crest */}
                <div className="relative w-28 h-28 rounded-3xl bg-gray-900 border-2 border-[#00FF85] flex items-center justify-center shadow-2xl shadow-[#00FF85]/40 overflow-hidden p-2">
                  {chosenClub.logoUrl ? (
                    <img
                      src={chosenClub.logoUrl}
                      alt={chosenClub.nome}
                      className="w-full h-full object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Shield className="w-14 h-14 text-gray-300" />
                  )}
                </div>

                {/* Club Name (Appears in step 7 or if showClubName is true) */}
                {(showClubName || phase === 'CLUB_FULL') ? (
                  <div className="flex flex-col items-center gap-2 animate-fadeIn">
                    <h2 className="text-3xl font-black text-white uppercase tracking-wide max-w-md">
                      🛡️ {chosenClub.nome}
                    </h2>

                    {/* Meta info pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                      <span className="px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-300 font-bold flex items-center gap-1.5">
                        <CountryFlag country={chosenClub.pais} imageClassName="w-4 h-2.5 object-cover rounded-2xs inline-block shrink-0" />
                        <span>{chosenClub.pais}</span>
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 text-xs text-amber-300 font-bold flex items-center gap-1.5">
                        {getLeagueLogo(chosenClub.liga) ? (
                          <img
                            src={getLeagueLogo(chosenClub.liga)}
                            alt={chosenClub.liga}
                            className="w-4 h-4 object-contain shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{chosenClub.liga}</span>
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 text-xs text-blue-300 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                        <span>{chosenClub.divisao || '1ª Divisão'}</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-10 flex items-center justify-center text-xs text-gray-500 font-mono animate-pulse">
                    Revelando nome...
                  </div>
                )}

                {/* Final Action Buttons */}
                {phase === 'CLUB_FULL' && (
                  <div className="w-full max-w-sm flex flex-col gap-3 mt-4 animate-fadeIn">
                    <button
                      id="confirm-revealed-club-btn"
                      onClick={() => onSpinComplete(chosenClub)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#00FF85] via-[#02E374] to-[#00CC66] text-[#0a0b0e] font-black text-lg uppercase tracking-wider shadow-xl shadow-[#00FF85]/30 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/40"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      <span>{getTranslation(lang, 'confirmClub')}</span>
                    </button>

                    {onRespin && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhase('IDLE');
                          setChosenClub(null);
                          if (onRespin) onRespin();
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <RefreshCw className="w-4 h-4 text-amber-400" />
                        <span>{getTranslation(lang, 'clubNotInGame')}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};




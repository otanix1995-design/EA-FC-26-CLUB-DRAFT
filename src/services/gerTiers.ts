export interface GERTierConfig {
  tierKey: 'icon' | 'elite' | 'gold' | 'silver' | 'bronze';
  tierLabel: string;
  badge: string;
  ratingLabel: string;
  primaryColor: string;    // Hex format e.g. #38BDF8
  secondaryColor: string;  // Hex format e.g. #FFD700
  accentColor: string;     // Hex format e.g. #FFFFFF
  borderClass: string;
  borderHex: string;
  glowClass: string;
  glowColorRgba: string;
  bgGradientClass: string;
  textColorClass: string;
  badgeClass: string;
}

export function getGERTierConfig(rating: number = 80): GERTierConfig {
  // 1. ICON / LENDÁRIO (EA FC ICON CARD) - GER 91+
  if (rating >= 91) {
    return {
      tierKey: 'icon',
      tierLabel: 'Icon / Lendário',
      badge: '👑 ICON (91+)',
      ratingLabel: 'CARTA ICON 91+',
      primaryColor: '#00F0FF',
      secondaryColor: '#FFD700',
      accentColor: '#FFFFFF',
      borderClass: 'border-cyan-300',
      borderHex: '#00F0FF',
      glowClass: 'shadow-[0_0_70px_rgba(0,240,255,0.9)]',
      glowColorRgba: 'rgba(0,240,255,0.9)',
      bgGradientClass: 'from-cyan-500/30 via-amber-400/20 to-black',
      textColorClass: 'text-cyan-200',
      badgeClass: 'bg-gradient-to-r from-cyan-400/40 via-amber-300/40 to-cyan-400/40 border-2 border-cyan-200 text-white font-black shadow-xl shadow-cyan-400/50 animate-pulse',
    };
  }

  // 2. ÉLITE / ROXA (EA FC SPECIAL / HERO) - GER 85 a 90
  if (rating >= 85) {
    return {
      tierKey: 'elite',
      tierLabel: 'Élite Roxa',
      badge: '💜 ÉLITE (85-90)',
      ratingLabel: 'CARTA ÉLITE 85-90',
      primaryColor: '#A855F7',
      secondaryColor: '#EC4899',
      accentColor: '#38BDF8',
      borderClass: 'border-purple-400',
      borderHex: '#A855F7',
      glowClass: 'shadow-[0_0_60px_rgba(168,85,247,0.85)]',
      glowColorRgba: 'rgba(168,85,247,0.85)',
      bgGradientClass: 'from-purple-600/30 via-fuchsia-600/20 to-black',
      textColorClass: 'text-purple-300',
      badgeClass: 'bg-gradient-to-r from-purple-600/40 via-fuchsia-500/40 to-purple-600/40 border-2 border-purple-300 text-purple-200 font-black shadow-lg shadow-purple-500/40 animate-pulse',
    };
  }

  // 2. OURO 🥇 (EA FC GOLD CARD) - GER 78 a 84
  if (rating >= 78) {
    return {
      tierKey: 'gold',
      tierLabel: 'Ouro',
      badge: '🥇 OURO',
      ratingLabel: 'CARTA OURO 78-84',
      primaryColor: '#FFD700',
      secondaryColor: '#F59E0B',
      accentColor: '#B45309',
      borderClass: 'border-amber-400',
      borderHex: '#FFD700',
      glowClass: 'shadow-[0_0_50px_rgba(255,215,0,0.75)]',
      glowColorRgba: 'rgba(255,215,0,0.75)',
      bgGradientClass: 'from-amber-500/25 via-yellow-600/15 to-black',
      textColorClass: 'text-amber-300',
      badgeClass: 'bg-amber-500/20 border-2 border-amber-400/80 text-amber-300 font-extrabold shadow-md shadow-amber-500/20',
    };
  }

  // 3. PRATA 🥈 (EA FC SILVER CARD) - GER 68 a 77
  if (rating >= 68) {
    return {
      tierKey: 'silver',
      tierLabel: 'Prata',
      badge: '🥈 PRATA',
      ratingLabel: 'CARTA PRATA 68-77',
      primaryColor: '#E2E8F0',
      secondaryColor: '#94A3B8',
      accentColor: '#CBD5E1',
      borderClass: 'border-slate-300',
      borderHex: '#E2E8F0',
      glowClass: 'shadow-[0_0_40px_rgba(226,232,240,0.7)]',
      glowColorRgba: 'rgba(226,232,240,0.7)',
      bgGradientClass: 'from-slate-400/25 via-slate-600/15 to-black',
      textColorClass: 'text-slate-200',
      badgeClass: 'bg-slate-500/20 border-2 border-slate-300/80 text-slate-200 font-extrabold shadow-md shadow-slate-500/20',
    };
  }

  // 4. BRONZE 🥉 (EA FC BRONZE CARD) - GER < 68
  return {
    tierKey: 'bronze',
    tierLabel: 'Bronze',
    badge: '🥉 BRONZE',
    ratingLabel: 'CARTA BRONZE <68',
    primaryColor: '#CD7F32',
    secondaryColor: '#EA580C',
    accentColor: '#B45309',
    borderClass: 'border-amber-700',
    borderHex: '#CD7F32',
    glowClass: 'shadow-[0_0_35px_rgba(205,127,50,0.65)]',
    glowColorRgba: 'rgba(205,127,50,0.65)',
    bgGradientClass: 'from-amber-800/25 via-orange-950/20 to-black',
    textColorClass: 'text-amber-500',
    badgeClass: 'bg-amber-900/30 border-2 border-amber-600/80 text-amber-400 font-extrabold shadow-md shadow-amber-800/20',
  };
}

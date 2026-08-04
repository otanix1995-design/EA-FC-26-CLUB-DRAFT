export interface GERTierConfig {
  tierKey: 'legendary' | 'gold' | 'silver' | 'bronze' | 'modest';
  tierLabel: string;
  badge: string;
  ratingLabel: string;
  primaryColor: string;    // Hex format e.g. #00F0FF
  secondaryColor: string;  // Hex format e.g. #FF007F
  accentColor: string;     // Hex format e.g. #FFD700
  borderClass: string;
  borderHex: string;
  glowClass: string;
  glowColorRgba: string;
  bgGradientClass: string;
  textColorClass: string;
  badgeClass: string;
}

export function getGERTierConfig(rating: number = 80): GERTierConfig {
  if (rating >= 86) {
    return {
      tierKey: 'legendary',
      tierLabel: 'Élite / Lendário',
      badge: '👑 ÉLITE / LENDÁRIO',
      ratingLabel: 'WALKOUT 86+',
      primaryColor: '#00F0FF',
      secondaryColor: '#FF007F',
      accentColor: '#FFD700',
      borderClass: 'border-cyan-400',
      borderHex: '#00F0FF',
      glowClass: 'shadow-[0_0_60px_rgba(0,240,255,0.85)]',
      glowColorRgba: 'rgba(0,240,255,0.85)',
      bgGradientClass: 'from-cyan-500/25 via-fuchsia-600/20 to-black',
      textColorClass: 'text-cyan-300',
      badgeClass: 'bg-gradient-to-r from-cyan-500/30 via-fuchsia-500/30 to-amber-400/30 border-2 border-cyan-300 text-cyan-200 font-black shadow-lg shadow-cyan-500/30 animate-pulse',
    };
  }
  if (rating >= 80) {
    return {
      tierKey: 'gold',
      tierLabel: 'Classe Mundial',
      badge: '🥇 CLASSE MUNDIAL',
      ratingLabel: 'OURO 80-85',
      primaryColor: '#FFD700',
      secondaryColor: '#F59E0B',
      accentColor: '#B45309',
      borderClass: 'border-amber-400',
      borderHex: '#FFD700',
      glowClass: 'shadow-[0_0_50px_rgba(255,215,0,0.7)]',
      glowColorRgba: 'rgba(255,215,0,0.7)',
      bgGradientClass: 'from-amber-500/25 via-yellow-600/15 to-black',
      textColorClass: 'text-amber-300',
      badgeClass: 'bg-amber-500/20 border-2 border-amber-400/80 text-amber-300 font-extrabold shadow-md shadow-amber-500/20',
    };
  }
  if (rating >= 74) {
    return {
      tierKey: 'silver',
      tierLabel: 'Time Forte',
      badge: '🥈 TIME FORTE',
      ratingLabel: 'PRATA 74-79',
      primaryColor: '#00FF85',
      secondaryColor: '#38BDF8',
      accentColor: '#02E374',
      borderClass: 'border-[#00FF85]',
      borderHex: '#00FF85',
      glowClass: 'shadow-[0_0_40px_rgba(0,255,133,0.6)]',
      glowColorRgba: 'rgba(0,255,133,0.6)',
      bgGradientClass: 'from-[#00FF85]/20 via-sky-500/15 to-black',
      textColorClass: 'text-[#00FF85]',
      badgeClass: 'bg-[#00FF85]/20 border-2 border-[#00FF85]/80 text-[#00FF85] font-extrabold shadow-md shadow-[#00FF85]/20',
    };
  }
  if (rating >= 68) {
    return {
      tierKey: 'bronze',
      tierLabel: 'Intermediário',
      badge: '🥉 INTERMEDIÁRIO',
      ratingLabel: 'BRONZE 68-73',
      primaryColor: '#F97316',
      secondaryColor: '#EA580C',
      accentColor: '#D97706',
      borderClass: 'border-orange-500',
      borderHex: '#F97316',
      glowClass: 'shadow-[0_0_35px_rgba(249,115,22,0.55)]',
      glowColorRgba: 'rgba(249,115,22,0.55)',
      bgGradientClass: 'from-orange-500/20 via-amber-700/15 to-black',
      textColorClass: 'text-orange-400',
      badgeClass: 'bg-orange-500/20 border-2 border-orange-400/70 text-orange-400 font-extrabold shadow-md shadow-orange-500/20',
    };
  }
  return {
    tierKey: 'modest',
    tierLabel: 'Clube Modesto',
    badge: '⚽ CLUBE MODESTO',
    ratingLabel: 'DIVISÃO ACESSO <68',
    primaryColor: '#A855F7',
    secondaryColor: '#8B5CF6',
    accentColor: '#6366F1',
    borderClass: 'border-purple-500',
    borderHex: '#A855F7',
    glowClass: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    glowColorRgba: 'rgba(168,85,247,0.5)',
    bgGradientClass: 'from-purple-500/20 via-indigo-600/15 to-black',
    textColorClass: 'text-purple-300',
    badgeClass: 'bg-purple-500/20 border-2 border-purple-400/70 text-purple-300 font-extrabold shadow-md shadow-purple-500/20',
  };
}

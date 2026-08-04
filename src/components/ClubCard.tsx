import React from 'react';
import { Club } from '../types';
import { getLeagueLogo } from '../services/leagueLogos';
import { getGERTierConfig } from '../services/gerTiers';
import { Trophy, Shield, Globe, MapPin } from 'lucide-react';
import { CountryFlag } from './CountryFlag';

interface ClubCardProps {
  club: Club;
  playerTitle?: string;
  size?: 'normal' | 'large' | 'small';
  animate?: boolean;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  club,
  playerTitle,
  size = 'normal',
  animate = true,
}) => {
  const rating = club.rating || 80;
  const tierConfig = getGERTierConfig(rating);

  // Sizing styles
  const sizeClasses = {
    small: 'w-48 py-3 px-3 text-xs',
    normal: 'w-64 py-5 px-4 text-sm',
    large: 'w-72 md:w-80 py-6 px-5 text-base',
  };

  return (
    <div
      className={`relative mx-auto rounded-2xl bg-gradient-to-b from-gray-900 via-[#111319] to-[#08090c] border-2 shadow-2xl overflow-hidden flex flex-col items-center text-center transition-all duration-300 ${tierConfig.borderClass} ${tierConfig.glowClass} ${
        sizeClasses[size]
      } ${animate ? 'hover:scale-[1.03]' : ''}`}
    >
      {/* Background glowing polygon overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at top, ${tierConfig.primaryColor}33 0%, transparent 70%)`,
        }}
      />

      {/* FC Shimmer line effect */}
      <div
        className="absolute top-0 left-0 right-0 h-1 animate-pulse"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${tierConfig.primaryColor} 50%, transparent 100%)`,
        }}
      />

      {/* Player Header if passed */}
      {playerTitle && (
        <div className="mb-2 px-3 py-0.5 rounded-full bg-black/60 border border-white/20 text-[#00FF85] font-extrabold text-[11px] uppercase tracking-wider">
          {playerTitle}
        </div>
      )}

      {/* Card Header: OVR + Country */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className="font-mono font-black text-2xl md:text-3xl tracking-tighter drop-shadow-md"
            style={{ color: tierConfig.primaryColor }}
          >
            {rating}
          </span>
          <span className="text-[10px] uppercase font-black tracking-widest leading-none text-gray-400">
            OVR
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-md border border-white/10 text-xs">
          <CountryFlag country={club.pais} imageClassName="w-5 h-3.5 object-cover rounded-xs border border-white/20 shrink-0" />
          <span className="text-[11px] font-semibold text-gray-300 truncate max-w-[90px]">{club.pais}</span>
        </div>
      </div>

      {/* Club Crest Placeholder / Badge Icon */}
      <div
        className="w-16 h-16 md:w-20 md:h-20 my-1 rounded-2xl flex items-center justify-center shadow-inner border-2 relative group overflow-hidden"
        style={{
          borderColor: `${tierConfig.primaryColor}66`,
          background: club.logoUrl
            ? `radial-gradient(circle, ${tierConfig.primaryColor}15 0%, rgba(0,0,0,0.6) 100%)`
            : `linear-gradient(135deg, ${club.badgeColor || '#C8102E'} 0%, #111827 100%)`,
        }}
      >
        {club.logoUrl ? (
          <img
            src={club.logoUrl}
            alt={club.nome}
            className="w-full h-full object-contain p-1 drop-shadow-md"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Hide broken image link
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <Shield className="w-10 h-10 md:w-12 md:h-12 text-gray-200 drop-shadow" />
        )}
        <div className="absolute bottom-1 right-1 bg-black/70 p-1 rounded-full text-[10px] border border-white/20">
          <Trophy className="w-3 h-3 text-[#00FF85]" />
        </div>
      </div>

      {/* Tier Label Pill */}
      <div className="mt-1">
        <span
          className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 border"
          style={{
            borderColor: `${tierConfig.primaryColor}55`,
            color: tierConfig.primaryColor,
          }}
        >
          {tierConfig.badge}
        </span>
      </div>

      {/* Club Name */}
      <h3 className="text-lg md:text-xl font-black text-white tracking-tight mt-1 line-clamp-1 drop-shadow-md">
        {club.nome}
      </h3>

      {/* League & Division */}
      <div className="w-full mt-3 pt-2 border-t border-white/10 flex flex-col gap-1 text-xs">
        <div className="flex items-center justify-center gap-1.5 text-gray-200 font-medium">
          {getLeagueLogo(club.liga) ? (
            <span className="w-5 h-5 rounded-md bg-slate-100 p-0.5 inline-flex items-center justify-center shrink-0 shadow-sm">
              <img
                src={getLeagueLogo(club.liga)}
                alt={club.liga}
                className="w-full h-full object-contain shrink-0"
                referrerPolicy="no-referrer"
              />
            </span>
          ) : (
            <Globe className="w-3.5 h-3.5 text-[#00FF85]" />
          )}
          <span className="truncate">{club.liga}</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-gray-400 font-mono text-[11px]">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{club.divisao}</span>
        </div>
      </div>

      {/* Gold Card Metallic Corners */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#E5B842]/60" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#E5B842]/60" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#E5B842]/60" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#E5B842]/60" />
    </div>
  );
};

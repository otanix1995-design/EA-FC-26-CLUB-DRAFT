import React from 'react';
import { Club } from '../types';
import { getLeagueLogo } from '../services/leagueLogos';
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
  const rating = club.rating || 82;

  // Sizing styles
  const sizeClasses = {
    small: 'w-48 py-3 px-3 text-xs',
    normal: 'w-64 py-5 px-4 text-sm',
    large: 'w-72 md:w-80 py-6 px-5 text-base',
  };

  return (
    <div
      className={`relative mx-auto rounded-2xl bg-gradient-to-b from-[#2A2312] via-[#1A1813] to-[#0D0C09] border-2 border-[#E5B842] shadow-2xl shadow-[#E5B842]/20 overflow-hidden flex flex-col items-center text-center transition-all duration-300 ${
        sizeClasses[size]
      } ${animate ? 'hover:scale-[1.02] hover:border-[#00FF85] hover:shadow-[#00FF85]/30' : ''}`}
    >
      {/* Background glowing polygon overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FFD700]/20 via-transparent to-transparent pointer-events-none" />

      {/* FC Shimmer line effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00FF85] to-transparent animate-pulse" />

      {/* Player Header if passed */}
      {playerTitle && (
        <div className="mb-2 px-3 py-0.5 rounded-full bg-[#00FF85]/20 border border-[#00FF85]/50 text-[#00FF85] font-extrabold text-[11px] uppercase tracking-wider">
          {playerTitle}
        </div>
      )}

      {/* Card Header: OVR + Country */}
      <div className="w-full flex items-center justify-between border-b border-[#E5B842]/30 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-black text-2xl md:text-3xl text-amber-300 tracking-tighter drop-shadow-md">
            {rating}
          </span>
          <span className="text-[10px] uppercase font-bold text-amber-200/70 tracking-widest leading-none">
            OVR
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-[#E5B842]/20 text-xs">
          <CountryFlag country={club.pais} imageClassName="w-5 h-3.5 object-cover rounded-xs border border-amber-400/30 shrink-0" />
          <span className="text-[11px] font-semibold text-gray-300 truncate max-w-[90px]">{club.pais}</span>
        </div>
      </div>

      {/* Club Crest Placeholder / Badge Icon */}
      <div
        className="w-16 h-16 md:w-20 md:h-20 my-1 rounded-2xl flex items-center justify-center shadow-inner border-2 border-[#E5B842]/40 relative group overflow-hidden"
        style={{
          background: club.logoUrl
            ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%)'
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
          <Shield className="w-10 h-10 md:w-12 md:h-12 text-amber-200/90 drop-shadow" />
        )}
        <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded-full text-[10px] border border-amber-400/30">
          <Trophy className="w-3 h-3 text-[#00FF85]" />
        </div>
      </div>

      {/* Club Name */}
      <h3 className="text-lg md:text-xl font-black text-white tracking-tight mt-2 line-clamp-1 drop-shadow-md">
        {club.nome}
      </h3>

      {/* League & Division */}
      <div className="w-full mt-3 pt-2 border-t border-amber-400/20 flex flex-col gap-1 text-xs">
        <div className="flex items-center justify-center gap-1.5 text-amber-100/90 font-medium">
          {getLeagueLogo(club.liga) ? (
            <img
              src={getLeagueLogo(club.liga)}
              alt={club.liga}
              className="w-4 h-4 object-contain shrink-0 filter drop-shadow"
              referrerPolicy="no-referrer"
            />
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

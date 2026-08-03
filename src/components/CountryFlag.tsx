import React from 'react';

const RESTO_DO_MUNDO_FLAG_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="100%"><rect width="900" height="600" fill="%23040817"/><g transform="translate(450, 300)" fill="none"><g fill="%23FFFFFF" stroke="none"><path d="M -15,190 C -120,180 -220,80 -210,-60 C -205,-130 -150,-200 -80,-230 C -82,-220 -135,-180 -190,-60 C -200,60 -100,165 -15,190 Z" opacity="0.9"/><path d="M -150,-200 C -180,-230 -120,-240 -80,-230 C -110,-215 -135,-210 -150,-200 Z" /><path d="M -180,-160 C -220,-185 -160,-200 -125,-185 C -150,-175 -170,-170 -180,-160 Z" /><path d="M -205,-110 C -245,-125 -190,-150 -155,-130 C -175,-125 -195,-120 -205,-110 Z" /><path d="M -220,-50 C -260,-60 -210,-90 -170,-70 C -190,-65 -210,-60 -220,-50 Z" /><path d="M -220,10 C -260,10 -215,-20 -175,0 C -195,0 -210,5 -220,10 Z" /><path d="M -205,70 C -245,80 -205,40 -165,60 C -185,60 -200,65 -205,70 Z" /><path d="M -175,120 C -210,140 -180,100 -140,110 C -160,110 -170,115 -175,120 Z" /><path d="M -125,160 C -155,185 -140,150 -100,150 C -115,150 -120,155 -125,160 Z" /><path d="M -60,185 C -80,215 -85,180 -50,175 C -55,175 -58,180 -60,185 Z" /><g transform="scale(-1, 1)"><path d="M -15,190 C -120,180 -220,80 -210,-60 C -205,-130 -150,-200 -80,-230 C -82,-220 -135,-180 -190,-60 C -200,60 -100,165 -15,190 Z" opacity="0.9"/><path d="M -150,-200 C -180,-230 -120,-240 -80,-230 C -110,-215 -135,-210 -150,-200 Z" /><path d="M -180,-160 C -220,-185 -160,-200 -125,-185 C -150,-175 -170,-170 -180,-160 Z" /><path d="M -205,-110 C -245,-125 -190,-150 -155,-130 C -175,-125 -195,-120 -205,-110 Z" /><path d="M -220,-50 C -260,-60 -210,-90 -170,-70 C -190,-65 -210,-60 -220,-50 Z" /><path d="M -220,10 C -260,10 -215,-20 -175,0 C -195,0 -210,5 -220,10 Z" /><path d="M -205,70 C -245,80 -205,40 -165,60 C -185,60 -200,65 -205,70 Z" /><path d="M -175,120 C -210,140 -180,100 -140,110 C -160,110 -170,115 -175,120 Z" /><path d="M -125,160 C -155,185 -140,150 -100,150 C -115,150 -120,155 -125,160 Z" /><path d="M -60,185 C -80,215 -85,180 -50,175 C -55,175 -58,180 -60,185 Z" /></g><path d="M -30,180 L 30,205 L 20,212 L -40,187 Z"/><path d="M 30,180 L -30,205 L -20,212 L 40,187 Z"/></g><path d="M 0,-185 Q 45,-215 90,-185 Q 135,-215 145,-180 C 150,-80 135,50 0,160 C -135,50 -150,-80 -145,-180 Q -135,-215 -90,-185 Q -45,-215 0,-185 Z" fill="none" stroke="%23FFFFFF" stroke-width="9" stroke-linejoin="round"/><circle cx="0" cy="-10" r="105" fill="%23FFFFFF"/><g fill="%23040817"><path d="M -65,-45 C -75,-65 -45,-85 -15,-75 C -5,-65 -20,-45 -30,-35 C -45,-25 -60,-30 -65,-45 Z"/><path d="M -35,-30 C -40,-25 -30,-15 -25,-20 Z"/><path d="M -35,-10 C -20,-20 -5,5 -15,45 C -30,65 -50,40 -40,15 Z"/><path d="M -5,-70 C 15,-80 45,-60 35,-45 C 15,-40 0,-50 -5,-70 Z"/><path d="M 0,-40 C 25,-45 45,-20 35,25 C 20,40 0,15 0,-40 Z"/><path d="M -25,-85 C -15,-90 -5,-80 -15,-75 Z"/><path d="M -10,-60 C -5,-65 0,-55 -5,-55 Z"/></g></g></svg>`;

function normalizeStr(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function getCountryFlagData(countryName: string): { type: 'image' | 'emoji'; value: string } {
  if (!countryName) return { type: 'emoji', value: '🌍' };
  const c = normalizeStr(countryName);

  if (
    c.includes('resto') ||
    c.includes('world') ||
    c.includes('rdm') ||
    c.includes('internacional') ||
    c.includes('global')
  ) {
    return { type: 'image', value: RESTO_DO_MUNDO_FLAG_SVG };
  }

  // Specific UK Nations first
  if (c.includes('inglaterra') || c.includes('england')) return { type: 'emoji', value: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' };
  if (c.includes('escocia') || c.includes('scotland')) return { type: 'emoji', value: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' };
  if (c.includes('gales') || c.includes('wales')) return { type: 'emoji', value: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' };
  if (c.includes('irlanda do norte') || c.includes('northern ireland')) return { type: 'emoji', value: '🇬🇧' };
  if (c.includes('reino unido') || c.includes('uk') || c.includes('great britain')) return { type: 'emoji', value: '🇬🇧' };

  // Main European Countries
  if (c.includes('espanha') || c.includes('spain')) return { type: 'emoji', value: '🇪🇸' };
  if (c.includes('italia') || c.includes('italy')) return { type: 'emoji', value: '🇮🇹' };
  if (c.includes('alemanha') || c.includes('germany')) return { type: 'emoji', value: '🇩🇪' };
  if (c.includes('franca') || c.includes('france')) return { type: 'emoji', value: '🇫🇷' };
  if (c.includes('portugal')) return { type: 'emoji', value: '🇵🇹' };
  if (c.includes('holanda') || c.includes('paises baixos') || c.includes('netherlands')) return { type: 'emoji', value: '🇳🇱' };
  if (c.includes('belgica') || c.includes('belgium')) return { type: 'emoji', value: '🇧🇪' };
  if (c.includes('turquia') || c.includes('turkey') || c.includes('turkiye')) return { type: 'emoji', value: '🇹🇷' };
  if (c.includes('polonia') || c.includes('poland')) return { type: 'emoji', value: '🇵🇱' };
  if (c.includes('suecia') || c.includes('sweden')) return { type: 'emoji', value: '🇸🇪' };
  if (c.includes('noruega') || c.includes('norway')) return { type: 'emoji', value: '🇳🇴' };
  if (c.includes('dinamarca') || c.includes('denmark')) return { type: 'emoji', value: '🇩🇰' };
  if (c.includes('finlandia') || c.includes('finland')) return { type: 'emoji', value: '🇫🇮' };
  if (c.includes('suica') || c.includes('switzerland')) return { type: 'emoji', value: '🇨🇭' };
  if (c.includes('austria')) return { type: 'emoji', value: '🇦🇹' };
  if (c.includes('grecia') || c.includes('greece')) return { type: 'emoji', value: '🇬🇷' };
  if (c.includes('croacia') || c.includes('croatia')) return { type: 'emoji', value: '🇭🇷' };
  if (c.includes('servia') || c.includes('serbia')) return { type: 'emoji', value: '🇷🇸' };
  if (c.includes('republica tcheca') || c.includes('republica checa') || c.includes('czech')) return { type: 'emoji', value: '🇨🇿' };
  if (c.includes('romenia') || c.includes('romania')) return { type: 'emoji', value: '🇷🇴' };
  if (c.includes('ucrania') || c.includes('ukraine')) return { type: 'emoji', value: '🇺🇦' };
  if (c.includes('russia')) return { type: 'emoji', value: '🇷🇺' };
  if (c.includes('hungria') || c.includes('hungary')) return { type: 'emoji', value: '🇭🇺' };
  if (c.includes('eslovaquia') || c.includes('slovakia')) return { type: 'emoji', value: '🇸🇰' };
  if (c.includes('eslovenia') || c.includes('slovenia')) return { type: 'emoji', value: '🇸🇮' };
  if (c.includes('bulgaria')) return { type: 'emoji', value: '🇧🇬' };
  if (c.includes('irlanda') || c.includes('ireland')) return { type: 'emoji', value: '🇮🇪' };
  if (c.includes('iclandia') || c.includes('islandia') || c.includes('iceland')) return { type: 'emoji', value: '🇮🇸' };
  if (c.includes('chipre') || c.includes('cyprus')) return { type: 'emoji', value: '🇨🇾' };

  // Americas
  if (c.includes('brasil') || c.includes('brazil')) return { type: 'emoji', value: '🇧🇷' };
  if (c.includes('argentina')) return { type: 'emoji', value: '🇦🇷' };
  if (c.includes('uruguai') || c.includes('uruguay')) return { type: 'emoji', value: '🇺🇾' };
  if (c.includes('colombia')) return { type: 'emoji', value: '🇨🇴' };
  if (c.includes('chile')) return { type: 'emoji', value: '🇨🇱' };
  if (c.includes('equador') || c.includes('ecuador')) return { type: 'emoji', value: '🇪🇨' };
  if (c.includes('peru')) return { type: 'emoji', value: '🇵🇪' };
  if (c.includes('paraguai') || c.includes('paraguay')) return { type: 'emoji', value: '🇵🇾' };
  if (c.includes('bolivia')) return { type: 'emoji', value: '🇧🇴' };
  if (c.includes('venezuela')) return { type: 'emoji', value: '🇻🇪' };
  if (c.includes('estados unidos') || c.includes('usa') || c === 'eua' || c.includes('united states')) return { type: 'emoji', value: '🇺🇸' };
  if (c.includes('mexico')) return { type: 'emoji', value: '🇲🇽' };
  if (c.includes('canada')) return { type: 'emoji', value: '🇨🇦' };
  if (c.includes('costa rica')) return { type: 'emoji', value: '🇨🇷' };
  if (c.includes('jamaica')) return { type: 'emoji', value: '🇯🇲' };
  if (c.includes('panama')) return { type: 'emoji', value: '🇵🇦' };

  // Middle East & Africa
  if (c.includes('arabia') || c.includes('saudi')) return { type: 'emoji', value: '🇸🇦' };
  if (c.includes('marrocos') || c.includes('morocco')) return { type: 'emoji', value: '🇲🇦' };
  if (c.includes('egito') || c.includes('egypt')) return { type: 'emoji', value: '🇪🇬' };
  if (c.includes('catar') || c.includes('qatar')) return { type: 'emoji', value: '🇶🇦' };
  if (c.includes('emirados') || c.includes('uae')) return { type: 'emoji', value: '🇦🇪' };
  if (c.includes('israel')) return { type: 'emoji', value: '🇮🇱' };
  if (c.includes('senegal')) return { type: 'emoji', value: '🇸🇳' };
  if (c.includes('gana') || c.includes('ghana')) return { type: 'emoji', value: '🇬🇭' };
  if (c.includes('camaroes') || c.includes('cameroon')) return { type: 'emoji', value: '🇨🇲' };
  if (c.includes('costa do marfim') || c.includes('ivory coast')) return { type: 'emoji', value: '🇨🇮' };
  if (c.includes('nigeria')) return { type: 'emoji', value: '🇳🇬' };
  if (c.includes('africa do sul') || c.includes('south africa')) return { type: 'emoji', value: '🇿🇦' };
  if (c.includes('algeria') || c.includes('argelia')) return { type: 'emoji', value: '🇩🇿' };
  if (c.includes('tunisia')) return { type: 'emoji', value: '🇹🇳' };

  // Asia & Oceania
  if (c.includes('japao') || c.includes('japan')) return { type: 'emoji', value: '🇯🇵' };
  if (c.includes('coreia') || c.includes('korea')) return { type: 'emoji', value: '🇰🇷' };
  if (c.includes('china')) return { type: 'emoji', value: '🇨🇳' };
  if (c.includes('australia')) return { type: 'emoji', value: '🇦🇺' };
  if (c.includes('india')) return { type: 'emoji', value: '🇮🇳' };
  if (c.includes('nova zelandia') || c.includes('new zealand')) return { type: 'emoji', value: '🇳🇿' };

  return { type: 'emoji', value: '🌍' };
}

interface CountryFlagProps {
  country: string;
  className?: string;
  imageClassName?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  country,
  className = '',
  imageClassName = 'w-5 h-3.5 object-cover rounded-xs shadow-xs',
}) => {
  const flag = getCountryFlagData(country);

  if (flag.type === 'image') {
    return (
      <img
        src={flag.value}
        alt={country}
        className={`${imageClassName} ${className}`}
      />
    );
  }

  return <span className={className}>{flag.value}</span>;
};


import { Club } from '../types';

export const KNOWN_CLUB_LOGOS: Record<string, string> = {
  // LALIGA
  'real madrid': 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  'fc barcelona': 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  'barcelona': 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  'atlético de madrid': 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
  'athletic club': 'https://upload.wikimedia.org/wikipedia/en/7/73/Athletic_Club_logo.svg',
  'real betis': 'https://upload.wikimedia.org/wikipedia/en/1/13/Real_betis_logo.svg',
  'real sociedad': 'https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg',
  'villarreal cf': 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg',
  'sevilla fc': 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg',
  'girona fc': 'https://upload.wikimedia.org/wikipedia/en/9/90/Girona_FC_logo.svg',
  'valencia cf': 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg',

  // Premier League
  'manchester city': 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  'liverpool': 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  'arsenal': 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  'chelsea': 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  'manchester united': 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  'tottenham hotspur': 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  'aston villa': 'https://upload.wikimedia.org/wikipedia/en/a/9a/Aston_Villa_fc_badge.svg',
  'newcastle united': 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
  'brighton & hove albion': 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
  'west ham united': 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',

  // Serie A
  'inter de milão': 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
  'ac milan': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/AC_Milan_logo.svg',
  'juventus': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg',
  'napoli': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/SSC_Neapel.svg',
  'atalanta': 'https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg',
  'as roma': 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg',
  'lazio': 'https://upload.wikimedia.org/wikipedia/en/c/ce/S.S._Lazio_badge.svg',
  'fiorentina': 'https://upload.wikimedia.org/wikipedia/commons/7/79/ACF_Fiorentina_2022.svg',

  // Bundesliga
  'bayern münchen': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
  'bayer 04 leverkusen': 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg',
  'borussia dortmund': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
  'rb leipzig': 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg',
  'eintracht frankfurt': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg',
  'vfb stuttgart': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg',

  // Ligue 1
  'paris saint-germain': 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
  'as monaco': 'https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg',
  'olympique de marseille': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg',
  'olympique lyonnais': 'https://upload.wikimedia.org/wikipedia/en/c/c6/Olympique_Lyonnais.svg',
  'lille osc': 'https://upload.wikimedia.org/wikipedia/en/6/6f/Lille_OSC_2018_logo.svg',

  // Outros
  'al hilal': 'https://upload.wikimedia.org/wikipedia/en/a/a2/Al_Hilal_SFC_Logo.svg',
  'al nassr': 'https://upload.wikimedia.org/wikipedia/en/c/c5/Al_Nassr_FC.svg',
  'al ittihad': 'https://upload.wikimedia.org/wikipedia/en/c/c6/Al-Ittihad_FC_logo.svg',
  'al ahli': 'https://upload.wikimedia.org/wikipedia/en/2/25/Al-Ahli_Saudi_FC_logo.svg',
  'sl benfica': 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg',
  'fc porto': 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg',
  'sporting cp': 'https://upload.wikimedia.org/wikipedia/en/3/3e/Sporting_Clube_de_Portugal.svg',
  'ajax': 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg',
  'psv eindhoven': 'https://upload.wikimedia.org/wikipedia/en/0/05/PSV_Eindhoven.svg',
  'feyenoord': 'https://upload.wikimedia.org/wikipedia/en/e/e3/Feyenoord_logo.svg',
  'inter miami cf': 'https://upload.wikimedia.org/wikipedia/en/5/5c/Inter_Miami_CF_logo.svg',
};

export function getKnownClubLogo(clubName: string): string | undefined {
  if (!clubName) return undefined;
  const key = clubName.trim().toLowerCase();
  
  if (KNOWN_CLUB_LOGOS[key]) {
    return KNOWN_CLUB_LOGOS[key];
  }

  for (const [name, logoUrl] of Object.entries(KNOWN_CLUB_LOGOS)) {
    if (key.includes(name) || name.includes(key)) {
      return logoUrl;
    }
  }

  return undefined;
}

export function attachLogosToClubs(clubs: Club[]): Club[] {
  return clubs.map((c) => {
    if (!c.logoUrl) {
      const known = getKnownClubLogo(c.nome);
      if (known) {
        return { ...c, logoUrl: known };
      }
    }
    return c;
  });
}

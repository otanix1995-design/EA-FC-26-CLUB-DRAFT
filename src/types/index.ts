export type Language = 'pt' | 'en' | 'es';

export interface Club {
  id: string;
  nome: string;
  pais: string;
  liga: string;
  divisao: string;
  badgeColor?: string;
  rating?: number;
  logoUrl?: string;
}

export type SeriesFormat = 1 | 3 | 5 | 7;

export interface MatchResult {
  id: string;
  matchNumber: number;
  player1Club: Club;
  player2Club: Club;
  player1Goals: number;
  player2Goals: number;
  winnerPlayer: 1 | 2 | 0; // 0 for draw
  createdAt: string;
}

export interface Series {
  id: string;
  player1Name: string;
  player2Name: string;
  format: SeriesFormat;
  winsToWin: number;
  player1Wins: number;
  player2Wins: number;
  draws: number;
  player1TotalGoals: number;
  player2TotalGoals: number;
  matches: MatchResult[];
  drawnClubIds: string[];
  excludedDivisions?: string[];
  winnerName?: string;
  winnerPlayer?: 1 | 2;
  status: 'drafting_p1' | 'drafting_p2' | 'vs_ready' | 'in_match' | 'completed';
  currentMatchIndex: number;
  currentP1Club?: Club;
  currentP2Club?: Club;
  createdAt: string;
  completedAt?: string;
}

export interface Settings {
  darkMode: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  rouletteTime: 5 | 8 | 10; // seconds
  language: Language;
  excludedDivisions?: string[];
}

export interface StatisticsData {
  totalMatches: number;
  totalSeries: number;
  mostDrawnClub: { club: string; count: number } | null;
  mostDrawnLeague: { league: string; count: number } | null;
  mostDrawnCountry: { country: string; count: number } | null;
  longestWinStreak: { player: string; streak: number };
  playerWithMostWins: { player: string; wins: number };
  biggestBlowout: { match: string; score: string; diff: number } | null;
  totalDraws: number;
  winRateP1: number;
  topClubsRanking: { name: string; count: number; pais: string }[];
  topCountriesRanking: { country: string; count: number }[];
  topLeaguesRanking: { league: string; count: number }[];
}

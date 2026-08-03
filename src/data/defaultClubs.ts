import { Club } from '../types';

export const DEFAULT_CLUBS: Club[] = [
  // LALIGA EA SPORTS (Espanha)
  { id: '1', nome: 'Real Madrid', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#102A45', rating: 86 },
  { id: '2', nome: 'FC Barcelona', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#004D98', rating: 85 },
  { id: '3', nome: 'Atlético de Madrid', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#CB3524', rating: 83 },
  { id: '4', nome: 'Athletic Club', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#EE2524', rating: 80 },
  { id: '5', nome: 'Real Betis', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#00B140', rating: 79 },
  { id: '6', nome: 'Real Sociedad', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#0055A5', rating: 80 },
  { id: '7', nome: 'Villarreal CF', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#FFE600', rating: 80 },
  { id: '8', nome: 'Sevilla FC', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#D31411', rating: 78 },
  { id: '9', nome: 'Girona FC', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#CD2027', rating: 79 },
  { id: '10', nome: 'Valencia CF', pais: 'Espanha', liga: 'LALIGA EA SPORTS', divisao: '1ª Divisão', badgeColor: '#FF7900', rating: 77 },

  // Premier League (Inglaterra)
  { id: '11', nome: 'Manchester City', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#6CABDD', rating: 86 },
  { id: '12', nome: 'Liverpool', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#C8102E', rating: 85 },
  { id: '13', nome: 'Arsenal', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#EF0107', rating: 85 },
  { id: '14', nome: 'Chelsea', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#034694', rating: 82 },
  { id: '15', nome: 'Manchester United', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#DA291C', rating: 81 },
  { id: '16', nome: 'Tottenham Hotspur', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#132257', rating: 81 },
  { id: '17', nome: 'Aston Villa', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#95BFE6', rating: 82 },
  { id: '18', nome: 'Newcastle United', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#241F20', rating: 82 },
  { id: '19', nome: 'Brighton & Hove Albion', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#0057B8', rating: 79 },
  { id: '20', nome: 'West Ham United', pais: 'Inglaterra', liga: 'Premier League', divisao: '1ª Divisão', badgeColor: '#7A263A', rating: 78 },

  // Serie A (Itália)
  { id: '21', nome: 'Inter de Milão', pais: 'Itália', liga: 'Serie A Enilive', divisao: '1ª Divisão', badgeColor: '#00529F', rating: 85 },
  { id: '22', nome: 'AC Milan', pais: 'Itália', liga: 'Serie A Enilive', divisao: '1ª Divisão', badgeColor: '#AC122D', rating: 82 },
  { id: '23', nome: 'Juventus', pais: 'Itália', liga: 'Serie A Enilive', divisao: '1ª Divisão', badgeColor: '#000000', rating: 83 },
  { id: '24', nome: 'Napoli', pais: 'Itália', liga: 'Serie A Enilive', divisao: '1ª Divisão', badgeColor: '#008CFF', rating: 82 },
  { id: '25', nome: 'Atalanta', pais: 'Itália', liga: 'Serie A Enilive', divisao: '1ª Divisão', badgeColor: '#1E73BE', rating: 82 },
  { id: '26', nome: 'AS Roma', pais: 'Itália', liga: 'Serie A Enilive', divisao: '1ª Divisão', badgeColor: '#8E1F2F', rating: 80 },
  { id: '27', nome: 'Lazio', pais: 'Itália', liga: 'Serie A Enilive', divisao: '1ª Divisão', badgeColor: '#87D8F7', rating: 79 },
  { id: '28', nome: 'Fiorentina', pais: 'Itália', liga: 'Serie A Enilive', divisao: '1ª Divisão', badgeColor: '#4B2E83', rating: 78 },

  // Bundesliga (Alemanha)
  { id: '29', nome: 'Bayern München', pais: 'Alemanha', liga: 'Bundesliga', divisao: '1ª Divisão', badgeColor: '#DC052D', rating: 86 },
  { id: '30', nome: 'Bayer 04 Leverkusen', pais: 'Alemanha', liga: 'Bundesliga', divisao: '1ª Divisão', badgeColor: '#E32219', rating: 84 },
  { id: '31', nome: 'Borussia Dortmund', pais: 'Alemanha', liga: 'Bundesliga', divisao: '1ª Divisão', badgeColor: '#FDE100', rating: 82 },
  { id: '32', nome: 'RB Leipzig', pais: 'Alemanha', liga: 'Bundesliga', divisao: '1ª Divisão', badgeColor: '#DD013F', rating: 82 },
  { id: '33', nome: 'Eintracht Frankfurt', pais: 'Alemanha', liga: 'Bundesliga', divisao: '1ª Divisão', badgeColor: '#E10019', rating: 79 },
  { id: '34', nome: 'VfB Stuttgart', pais: 'Alemanha', liga: 'Bundesliga', divisao: '1ª Divisão', badgeColor: '#E30613', rating: 79 },

  // Ligue 1 (França)
  { id: '35', nome: 'Paris Saint-Germain', pais: 'França', liga: 'Ligue 1 McDonald\'s', divisao: '1ª Divisão', badgeColor: '#002F6C', rating: 85 },
  { id: '36', nome: 'AS Monaco', pais: 'França', liga: 'Ligue 1 McDonald\'s', divisao: '1ª Divisão', badgeColor: '#E2001A', rating: 80 },
  { id: '37', nome: 'Olympique de Marseille', pais: 'França', liga: 'Ligue 1 McDonald\'s', divisao: '1ª Divisão', badgeColor: '#00A3E0', rating: 79 },
  { id: '38', nome: 'Olympique Lyonnais', pais: 'França', liga: 'Ligue 1 McDonald\'s', divisao: '1ª Divisão', badgeColor: '#12264C', rating: 78 },
  { id: '39', nome: 'Lille OSC', pais: 'França', liga: 'Ligue 1 McDonald\'s', divisao: '1ª Divisão', badgeColor: '#E2001A', rating: 79 },

  // Saudi Pro League (Arábia Saudita)
  { id: '50', nome: 'Al Hilal', pais: 'Arábia Saudita', liga: 'ROSHN Saudi League', divisao: '1ª Divisão', badgeColor: '#00529F', rating: 82 },
  { id: '51', nome: 'Al Nassr', pais: 'Arábia Saudita', liga: 'ROSHN Saudi League', divisao: '1ª Divisão', badgeColor: '#FFF200', rating: 81 },
  { id: '52', nome: 'Al Ittihad', pais: 'Arábia Saudita', liga: 'ROSHN Saudi League', divisao: '1ª Divisão', badgeColor: '#000000', rating: 80 },
  { id: '53', nome: 'Al Ahli', pais: 'Arábia Saudita', liga: 'ROSHN Saudi League', divisao: '1ª Divisão', badgeColor: '#007A33', rating: 80 },

  // Outros Gigantes da Europa
  { id: '54', nome: 'SL Benfica', pais: 'Portugal', liga: 'Liga Portugal', divisao: '1ª Divisão', badgeColor: '#E10019', rating: 80 },
  { id: '55', nome: 'FC Porto', pais: 'Portugal', liga: 'Liga Portugal', divisao: '1ª Divisão', badgeColor: '#00529F', rating: 79 },
  { id: '56', nome: 'Sporting CP', pais: 'Portugal', liga: 'Liga Portugal', divisao: '1ª Divisão', badgeColor: '#007A33', rating: 81 },
  { id: '57', nome: 'Ajax', pais: 'Holanda', liga: 'Eredivisie', divisao: '1ª Divisão', badgeColor: '#D31411', rating: 78 },
  { id: '58', nome: 'PSV Eindhoven', pais: 'Holanda', liga: 'Eredivisie', divisao: '1ª Divisão', badgeColor: '#FF0000', rating: 80 },
  { id: '59', nome: 'Feyenoord', pais: 'Holanda', liga: 'Eredivisie', divisao: '1ª Divisão', badgeColor: '#000000', rating: 79 },
  { id: '60', nome: 'Inter Miami CF', pais: 'Estados Unidos', liga: 'MLS', divisao: 'Major League', badgeColor: '#F7B5CD', rating: 78 },
];

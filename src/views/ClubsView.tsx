import React, { useState, useMemo } from 'react';
import { Club, Settings } from '../types';
import { getTranslation } from '../services/i18n';
import { getLeagueLogo } from '../services/leagueLogos';
import { LeagueLogosModal } from '../components/LeagueLogosModal';
import {
  Shield,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Filter,
  Globe,
  Trophy,
  X,
  Check,
  AlertTriangle,
  Sliders,
  ChevronDown,
  Upload,
  Pencil,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';

interface ClubsViewProps {
  settings: Settings;
  clubs: Club[];
  onAddClub: (club: Omit<Club, 'id'>) => void;
  onUpdateClub?: (club: Club) => void;
  onDeleteClub: (id: string) => void;
  onRestoreDefaults: () => void;
}

const PRESET_COLORS = [
  '#00FF85',
  '#00E5FF',
  '#FF3366',
  '#FFD700',
  '#9933FF',
  '#FF6600',
  '#0066FF',
  '#FFFFFF',
  '#111111',
  '#003366',
  '#CC0000',
  '#009933',
];

export const ClubsView: React.FC<ClubsViewProps> = ({
  settings,
  clubs,
  onAddClub,
  onUpdateClub,
  onDeleteClub,
  onRestoreDefaults,
}) => {
  const lang = settings.language || 'pt';

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [displayCount, setDisplayCount] = useState<number>(48);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLeagueLogosModalOpen, setIsLeagueLogosModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [deletingClub, setDeletingClub] = useState<Club | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Club Form State
  const [formNome, setFormNome] = useState('');
  const [formPais, setFormPais] = useState('');
  const [formLiga, setFormLiga] = useState('');
  const [formDivisao, setFormDivisao] = useState('1ª Divisão');
  const [formRating, setFormRating] = useState<number>(80);
  const [formColor, setFormColor] = useState('#00FF85');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formError, setFormError] = useState('');

  // Extract metadata lists
  const allCountries = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (c.pais) set.add(c.pais);
    });
    return Array.from(set).sort();
  }, [clubs]);

  const allDivisions = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (c.divisao) set.add(c.divisao);
    });
    return Array.from(set).sort();
  }, [clubs]);

  const allLeagues = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (c.liga) set.add(c.liga);
    });
    return Array.from(set).sort();
  }, [clubs]);

  // Filtered Clubs list
  const filteredClubs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return clubs.filter((c) => {
      const matchSearch =
        !term ||
        c.nome.toLowerCase().includes(term) ||
        c.pais.toLowerCase().includes(term) ||
        c.liga.toLowerCase().includes(term) ||
        c.divisao.toLowerCase().includes(term);

      const matchCountry = selectedCountry === 'ALL' || c.pais === selectedCountry;
      const matchDivision = selectedDivision === 'ALL' || c.divisao === selectedDivision;
      const matchLeague = selectedLeague === 'ALL' || c.liga === selectedLeague;

      return matchSearch && matchCountry && matchDivision && matchLeague;
    });
  }, [clubs, searchTerm, selectedCountry, selectedDivision, selectedLeague]);

  const visibleClubs = useMemo(() => {
    return filteredClubs.slice(0, displayCount);
  }, [filteredClubs, displayCount]);

  const openAddModal = () => {
    setEditingClub(null);
    setFormNome('');
    setFormPais('');
    setFormLiga('');
    setFormDivisao('1ª Divisão');
    setFormRating(80);
    setFormColor('#00FF85');
    setFormLogoUrl('');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (club: Club) => {
    setEditingClub(club);
    setFormNome(club.nome);
    setFormPais(club.pais);
    setFormLiga(club.liga);
    setFormDivisao(club.divisao);
    setFormRating(club.rating || 80);
    setFormColor(club.badgeColor || '#00FF85');
    setFormLogoUrl(club.logoUrl || '');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Por favor selecione um arquivo de imagem válido (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError('A imagem deve ter no máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormLogoUrl(result);
        setFormError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim()) {
      setFormError('Informe o nome do clube.');
      return;
    }

    if (editingClub) {
      if (onUpdateClub) {
        onUpdateClub({
          ...editingClub,
          nome: formNome.trim(),
          pais: formPais.trim() || 'Internacional',
          liga: formLiga.trim() || 'Liga Geral',
          divisao: formDivisao.trim() || '1ª Divisão',
          badgeColor: formColor,
          rating: Number(formRating) || 80,
          logoUrl: formLogoUrl || undefined,
        });
      }
    } else {
      onAddClub({
        nome: formNome.trim(),
        pais: formPais.trim() || 'Internacional',
        liga: formLiga.trim() || 'Liga Geral',
        divisao: formDivisao.trim() || '1ª Divisão',
        badgeColor: formColor,
        rating: Number(formRating) || 80,
        logoUrl: formLogoUrl || undefined,
      });
    }

    // Reset Form & Close Modal
    setIsAddModalOpen(false);
    setEditingClub(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingClub) {
      onDeleteClub(deletingClub.id);
      setDeletingClub(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Top Banner & Quick Stats */}
      <div className="bg-[#12151c] border border-gray-800 rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#00FF85]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00FF85]/10 border border-[#00FF85]/30 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#00FF85] mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>{getTranslation(lang, 'manageClubs')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              BANCO DE DADOS DE CLUBES
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Visualize, edite escudos, adicione, pesquise ou remova clubes do sorteador
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-open-league-logos-modal"
              onClick={() => setIsLeagueLogosModalOpen(true)}
              className="py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition-all border border-amber-500/40 hover:border-amber-400 flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              title="Gerenciar escudos oficiais das ligas"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{getTranslation(lang, 'manageLeagueLogos')}</span>
            </button>

            <button
              type="button"
              id="btn-open-add-club-modal"
              onClick={openAddModal}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#00FF85] to-[#02E374] text-[#0a0b0e] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#00FF85]/20 hover:shadow-[#00FF85]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 border border-white/40 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{getTranslation(lang, 'addNewClub')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRestoreConfirm(true)}
              className="py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white font-bold text-xs transition-all border border-gray-700 hover:border-amber-400/50 flex items-center gap-2 cursor-pointer"
              title="Restaurar padrão"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Restaurar 684 Padrão</span>
            </button>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-800">
          <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-3 text-center">
            <span className="block text-2xl font-black font-mono text-[#00FF85]">
              {clubs.length}
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {getTranslation(lang, 'totalClubs')}
            </span>
          </div>

          <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-3 text-center">
            <span className="block text-2xl font-black font-mono text-cyan-400">
              {allCountries.length}
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {getTranslation(lang, 'totalCountries')}
            </span>
          </div>

          <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-3 text-center">
            <span className="block text-2xl font-black font-mono text-amber-400">
              {allLeagues.length}
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {getTranslation(lang, 'totalLeagues')}
            </span>
          </div>

          <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-3 text-center">
            <span className="block text-2xl font-black font-mono text-purple-400">
              {allDivisions.length}
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {getTranslation(lang, 'totalDivisions')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#12151c] border border-gray-800 rounded-2xl p-4 mb-6 shadow-lg flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDisplayCount(48);
            }}
            placeholder={getTranslation(lang, 'searchClubs')}
            className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Division Filter Dropdown */}
        <div className="min-w-[160px]">
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setDisplayCount(48);
            }}
            className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] text-xs font-bold text-gray-200 rounded-xl px-3 py-2.5 outline-none cursor-pointer"
          >
            <option value="ALL">{getTranslation(lang, 'allDivisions')}</option>
            {allDivisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter Dropdown */}
        <div className="min-w-[160px]">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setDisplayCount(48);
            }}
            className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] text-xs font-bold text-gray-200 rounded-xl px-3 py-2.5 outline-none cursor-pointer"
          >
            <option value="ALL">{getTranslation(lang, 'allCountries')}</option>
            {allCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4 px-1 font-mono font-bold">
        <span>
          Exibindo {Math.min(visibleClubs.length, filteredClubs.length)} de {filteredClubs.length} clubes encontrados
        </span>
        {(searchTerm || selectedCountry !== 'ALL' || selectedDivision !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCountry('ALL');
              setSelectedDivision('ALL');
              setSelectedLeague('ALL');
            }}
            className="text-[#00FF85] hover:underline cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="bg-[#12151c] border border-gray-800 rounded-3xl p-12 text-center my-6">
          <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            {getTranslation(lang, 'noClubsFound')}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Tente pesquisar com outros termos ou desative os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleClubs.map((club) => (
            <div
              key={club.id}
              className="bg-[#12151c] border border-gray-800/80 hover:border-[#00FF85]/40 rounded-2xl p-3.5 transition-all hover:shadow-lg hover:shadow-[#00FF85]/5 flex items-center justify-between group relative overflow-hidden"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {/* Shield / Logo Badge */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-black shrink-0 shadow-md border border-white/20 overflow-hidden relative"
                  style={{ backgroundColor: club.logoUrl ? '#0a0b0e' : (club.badgeColor || '#00FF85') }}
                >
                  {club.logoUrl ? (
                    <img
                      src={club.logoUrl}
                      alt={club.nome}
                      className="w-full h-full object-contain p-0.5"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Shield className="w-5 h-5 fill-current opacity-80" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white truncate group-hover:text-[#00FF85] transition-colors">
                    {club.nome}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 truncate mt-0.5">
                    {getLeagueLogo(club.liga) ? (
                      <img
                        src={getLeagueLogo(club.liga)}
                        alt={club.liga}
                        className="w-3.5 h-3.5 object-contain shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <span className="truncate">{club.liga}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-[#00FF85] shrink-0 font-mono font-bold text-[10px]">
                      {club.divisao}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium truncate">{club.pais}</p>
                </div>
              </div>

              {/* Action Buttons: Edit and Delete */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(club)}
                  className="p-1.5 rounded-xl bg-gray-900/60 hover:bg-[#00FF85]/20 text-gray-400 hover:text-[#00FF85] transition-all border border-transparent hover:border-[#00FF85]/40 cursor-pointer"
                  title="Editar / Adicionar Escudo"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingClub(club)}
                  className="p-1.5 rounded-xl bg-gray-900/60 hover:bg-red-950/80 text-gray-500 hover:text-red-400 transition-all border border-transparent hover:border-red-800/60 cursor-pointer"
                  title="Excluir clube"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button if pagination exists */}
      {filteredClubs.length > displayCount && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setDisplayCount((prev) => prev + 48)}
            className="py-3 px-8 rounded-2xl bg-[#12151c] hover:bg-[#1a1f2c] border border-gray-800 hover:border-[#00FF85] text-[#00FF85] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
          >
            Carregar Mais Clubes ({filteredClubs.length - displayCount} restantes)
          </button>
        </div>
      )}

      {/* MODAL: ADD / EDIT CLUB */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#12151c] border-2 border-[#00FF85]/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative my-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-[#00FF85]/10 text-[#00FF85] rounded-2xl border border-[#00FF85]/30">
                {editingClub ? <Pencil className="w-6 h-6 stroke-[2]" /> : <Plus className="w-6 h-6 stroke-[3]" />}
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {editingClub ? getTranslation(lang, 'editClub') : getTranslation(lang, 'addNewClub')}
                </h3>
                <p className="text-xs text-gray-400">
                  {editingClub ? 'Atualize as informações ou o escudo do clube' : 'Preencha os dados do novo clube para a roleta'}
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs font-bold text-red-300">
                  {formError}
                </div>
              )}

              {/* Club Logo / Escudo Upload Section */}
              <div className="bg-[#0a0b0e] border border-gray-800 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-gray-300 uppercase flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00FF85]" />
                  <span>{getTranslation(lang, 'clubLogo')}</span>
                </label>

                {/* Preview Box */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-700 bg-[#12151c] flex items-center justify-center overflow-hidden shrink-0 relative"
                    style={{ backgroundColor: formLogoUrl ? '#0a0b0e' : formColor }}
                  >
                    {formLogoUrl ? (
                      <img
                        src={formLogoUrl}
                        alt="Preview"
                        className="w-full h-full object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Shield className="w-8 h-8 text-black/60" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* File Upload Button */}
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white cursor-pointer border border-gray-700 transition-colors">
                      <Upload className="w-4 h-4 text-[#00FF85]" />
                      <span>{getTranslation(lang, 'uploadLogo')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    {formLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormLogoUrl('')}
                        className="ml-2 text-xs text-red-400 hover:underline inline-block cursor-pointer"
                      >
                        {getTranslation(lang, 'removeLogo')}
                      </button>
                    )}

                    <p className="text-[10px] text-gray-500">
                      Aceita PNG, JPG, WebP ou SVG (máx. 2MB).
                    </p>
                  </div>
                </div>

                {/* Direct Image URL Input */}
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    placeholder={getTranslation(lang, 'pasteLogoUrl')}
                    className="w-full bg-[#12151c] border border-gray-800 focus:border-[#00FF85] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Nome do Clube */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Nome do Clube *
                </label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: Santos FC, Real Madrid, Inter de Milão..."
                  className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none font-medium"
                />
              </div>

              {/* País e Liga */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    value={formPais}
                    onChange={(e) => setFormPais(e.target.value)}
                    placeholder="Ex: Brasil, Espanha..."
                    className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Liga
                  </label>
                  <input
                    type="text"
                    value={formLiga}
                    onChange={(e) => setFormLiga(e.target.value)}
                    placeholder="Ex: Brasileirão, Premier League..."
                    className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Divisão e Rating */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Divisão
                  </label>
                  <input
                    type="text"
                    value={formDivisao}
                    onChange={(e) => setFormDivisao(e.target.value)}
                    placeholder="Ex: 1ª Divisão, 2ª Divisão..."
                    className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Rating (OVR)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="99"
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-[#00FF85] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Badge Color Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                  Cor de Fundo do Escudo (quando sem imagem)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-xl border border-white/40 flex items-center justify-center shrink-0 shadow-md"
                    style={{ backgroundColor: formColor }}
                  >
                    <Shield className="w-4 h-4 text-black" />
                  </div>
                  <input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-10 h-8 rounded-lg bg-transparent cursor-pointer border border-gray-800"
                  />
                  <span className="text-xs font-mono text-gray-400">{formColor}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setFormColor(hex)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                        formColor === hex ? 'scale-125 border-white ring-2 ring-[#00FF85]' : 'border-black/30'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {getTranslation(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00FF85] to-[#02E374] text-[#0a0b0e] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00FF85]/20 hover:scale-[1.02] cursor-pointer"
                >
                  {getTranslation(lang, 'saveClub')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingClub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12151c] border-2 border-red-500/50 rounded-3xl p-6 w-full max-w-md shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white uppercase mb-2">
              EXCLUIR CLUBE?
            </h3>

            <div className="bg-[#0a0b0e] p-3 rounded-2xl border border-gray-800 my-4 flex items-center justify-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold shrink-0 overflow-hidden relative"
                style={{ backgroundColor: deletingClub.logoUrl ? '#0a0b0e' : (deletingClub.badgeColor || '#00FF85') }}
              >
                {deletingClub.logoUrl ? (
                  <img src={deletingClub.logoUrl} alt={deletingClub.nome} className="w-full h-full object-contain p-0.5" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
              </div>
              <div className="text-left">
                <span className="block font-bold text-white text-sm">{deletingClub.nome}</span>
                <span className="text-xs text-gray-400">
                  {deletingClub.liga} • {deletingClub.pais}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-6">
              Este clube não aparecerá mais nos sorteios da roleta.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingClub(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs uppercase cursor-pointer"
              >
                {getTranslation(lang, 'cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase cursor-pointer shadow-lg shadow-red-600/30"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESTORE DEFAULTS CONFIRMATION */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12151c] border-2 border-amber-500/50 rounded-3xl p-6 w-full max-w-md shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white uppercase mb-2">
              RESTAURAR CLUBES PADRÃO?
            </h3>

            <p className="text-xs text-gray-300 mb-6">
              Esta ação substituirá a lista atual pelos <strong>684 clubes masculinos oficiais do EA FC 26</strong>.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRestoreConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs uppercase cursor-pointer"
              >
                {getTranslation(lang, 'cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onRestoreDefaults();
                  setShowRestoreConfirm(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase cursor-pointer shadow-lg shadow-amber-500/30"
              >
                Sim, Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LEAGUE LOGOS MANAGER */}
      {isLeagueLogosModalOpen && (
        <LeagueLogosModal
          settings={settings}
          clubs={clubs}
          onClose={() => setIsLeagueLogosModalOpen(false)}
          onUpdate={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

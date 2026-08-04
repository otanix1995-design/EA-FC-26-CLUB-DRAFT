import React, { useState, useRef } from 'react';
import { Settings } from '../types';
import { db } from '../services/db';
import { getTranslation } from '../services/i18n';
import { FileSpreadsheet, Upload, CheckCircle2, Download, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

interface ImportViewProps {
  settings: Settings;
  onClubsUpdated: () => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ settings, onClubsUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importStats, setImportStats] = useState<{
    totalClubs: number;
    totalCountries: number;
    totalLeagues: number;
    totalDivisions: number;
    updatedRatingsCount?: number;
    newClubsAddedCount?: number;
    modeUsed?: 'merge' | 'replace';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lang = settings.language || 'pt';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setImportStats(null);

    try {
      const result = await db.importClubsFromExcel(file, importMode);
      setImportStats({
        totalClubs: result.totalClubs,
        totalCountries: result.totalCountries,
        totalLeagues: result.totalLeagues,
        totalDivisions: result.totalDivisions,
        updatedRatingsCount: result.updatedRatingsCount,
        newClubsAddedCount: result.newClubsAddedCount,
        modeUsed: result.modeUsed,
      });
      onClubsUpdated();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao importar arquivo Excel.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSyncDefaultRatings = () => {
    try {
      const res = db.syncDefaultRatings();
      onClubsUpdated();
      alert(`Sincronização concluída! ${res.updatedCount} times tiveram suas notas GER atualizadas sem alterar ligas ou escudos.`);
    } catch (err) {
      alert('Erro ao sincronizar notas GER.');
    }
  };

  const handleDownloadTemplate = () => {
    db.downloadTemplateExcel();
  };

  const handleRestoreDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar a base original de 684 times do EA FC 26? Isso irá redefinir alterações personalizadas.')) {
      db.restoreDefaultClubs();
      setImportStats(null);
      setErrorMsg(null);
      onClubsUpdated();
      alert('Clubes padrão do EA FC 26 restaurados com sucesso!');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-[#12151c] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <div className="p-3 bg-amber-400/10 text-amber-400 rounded-2xl border border-amber-400/30">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              {getTranslation(lang, 'importClubs')}
            </h2>
            <p className="text-xs text-gray-400">Importe sua planilha .xlsx ou .xls para atualizar o banco de dados</p>
          </div>
        </div>

        {/* Import Mode Selector Cards */}
        <div className="mb-6 space-y-2">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            Modo de Importação da Planilha:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Merge Option (Recommended) */}
            <div
              onClick={() => setImportMode('merge')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                importMode === 'merge'
                  ? 'bg-[#00FF85]/10 border-[#00FF85] shadow-lg shadow-[#00FF85]/10'
                  : 'bg-[#0a0b0e] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#00FF85]" />
                  Mesclar e Atualizar GERs
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#00FF85]/20 text-[#00FF85] text-[10px] font-mono font-bold uppercase">
                  Recomendado
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                Preserva suas ligas, divisões e escudos customizados intactos. Atualiza as notas GER dos times e adiciona novos clubes.
              </p>
            </div>

            {/* Replace Option */}
            <div
              onClick={() => setImportMode('replace')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                importMode === 'replace'
                  ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-[#0a0b0e] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Substituir Todos
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                Substitui completamente o banco de dados atual pelos dados contidos exclusivamente na planilha selecionada.
              </p>
            </div>
          </div>
        </div>

        {/* Required Structure Example Card */}
        <div className="mb-6 bg-[#0a0b0e] border border-amber-400/30 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Estrutura obrigatória da planilha Excel
          </h4>
          <p className="text-xs text-gray-400 mb-3">
            O arquivo deve conter as colunas: <span className="text-white font-mono font-bold">| Clube | Liga | Divisão | País | GER |</span>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-gray-300 border-collapse">
              <thead>
                <tr className="bg-amber-400/10 text-amber-300 border-b border-amber-400/20">
                  <th className="py-2 px-3">Clube</th>
                  <th className="py-2 px-3">Liga</th>
                  <th className="py-2 px-3">Divisão</th>
                  <th className="py-2 px-3">País</th>
                  <th className="py-2 px-3">GER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="py-1.5 px-3 text-white font-semibold">1. FC Kaiserslautern</td>
                  <td className="py-1.5 px-3">2. Bundesliga</td>
                  <td className="py-1.5 px-3">2ª Divisão</td>
                  <td className="py-1.5 px-3">Alemanha</td>
                  <td className="py-1.5 px-3 text-amber-300 font-bold">69</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 text-white font-semibold">Real Madrid</td>
                  <td className="py-1.5 px-3">LALIGA EA SPORTS</td>
                  <td className="py-1.5 px-3">1ª Divisão</td>
                  <td className="py-1.5 px-3">Espanha</td>
                  <td className="py-1.5 px-3 text-amber-300 font-bold">86</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 text-white font-semibold">Flamengo</td>
                  <td className="py-1.5 px-3">Brasileirão Série A</td>
                  <td className="py-1.5 px-3">Série A</td>
                  <td className="py-1.5 px-3">Brasil</td>
                  <td className="py-1.5 px-3 text-amber-300 font-bold">79</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* File Input Hidden & Upload Area */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4 my-6">
          <button
            id="select-excel-file-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-[#0a0b0e] font-black text-xl uppercase tracking-wider shadow-xl shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer border border-white/40"
          >
            {loading ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Processando Planilha...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span>
                  {importMode === 'merge' ? 'Mesclar Planilha (.xlsx / .xls)' : 'Substituir por Planilha (.xlsx / .xls)'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-200 text-xs font-bold flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Import Success Metrics Display */}
        {importStats && (
          <div className="p-6 bg-[#0a0b0e] border-2 border-[#00FF85] rounded-3xl mb-6 shadow-xl shadow-[#00FF85]/10 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#00FF85] font-black text-lg">
                <CheckCircle2 className="w-6 h-6" />
                <span>{getTranslation(lang, 'importSuccess')}</span>
              </div>
              {importStats.updatedRatingsCount !== undefined && importStats.updatedRatingsCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[#00FF85]/20 text-[#00FF85] text-xs font-mono font-bold">
                  {importStats.updatedRatingsCount} GERs Atualizados!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-[#12151c] p-3 rounded-2xl border border-gray-800">
                <span className="block text-2xl font-mono font-black text-white">{importStats.totalClubs}</span>
                <span className="text-[11px] text-gray-400 font-bold uppercase">{getTranslation(lang, 'totalClubs')}</span>
              </div>

              <div className="bg-[#12151c] p-3 rounded-2xl border border-gray-800">
                <span className="block text-2xl font-mono font-black text-white">{importStats.totalCountries}</span>
                <span className="text-[11px] text-gray-400 font-bold uppercase">{getTranslation(lang, 'totalCountries')}</span>
              </div>

              <div className="bg-[#12151c] p-3 rounded-2xl border border-gray-800">
                <span className="block text-2xl font-mono font-black text-white">{importStats.totalLeagues}</span>
                <span className="text-[11px] text-gray-400 font-bold uppercase">{getTranslation(lang, 'totalLeagues')}</span>
              </div>

              <div className="bg-[#12151c] p-3 rounded-2xl border border-gray-800">
                <span className="block text-2xl font-mono font-black text-white">{importStats.totalDivisions}</span>
                <span className="text-[11px] text-gray-400 font-bold uppercase">{getTranslation(lang, 'totalDivisions')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick GER Sync Button & Secondary Template Actions */}
        <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSyncDefaultRatings}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-500/40"
            title="Atualiza as notas GER dos times existentes para a base oficial do EA FC 26 sem alterar suas ligas e escudos"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Sincronizar GERs Oficiais</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="download-template-btn"
              onClick={handleDownloadTemplate}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-gray-700"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{getTranslation(lang, 'downloadTemplate')}</span>
            </button>

            <button
              id="restore-defaults-btn"
              onClick={handleRestoreDefaults}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-gray-700"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>{getTranslation(lang, 'restoreDefaults')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

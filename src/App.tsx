/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Club, Series, SeriesFormat, Settings } from './types';
import { db } from './services/db';
import { audio } from './services/audio';
import { Header } from './components/Header';
import { HomeView } from './views/HomeView';
import { NewSeriesView } from './views/NewSeriesView';
import { DraftView } from './views/DraftView';
import { MatchView } from './views/MatchView';
import { WinnerView } from './views/WinnerView';
import { HistoryView } from './views/HistoryView';
import { StatsView } from './views/StatsView';
import { ImportView } from './views/ImportView';
import { SettingsView } from './views/SettingsView';
import { ClubsView } from './views/ClubsView';

export default function App() {
  const [view, setView] = useState<
    'home' | 'new_series' | 'draft' | 'match' | 'winner' | 'history' | 'stats' | 'import' | 'settings' | 'clubs'
  >('home');

  const [settings, setSettings] = useState<Settings>(db.getSettings());
  const [clubs, setClubs] = useState<Club[]>(db.getClubs());
  const [activeSeries, setActiveSeries] = useState<Series | null>(null);

  useEffect(() => {
    audio.setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleUpdateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    db.saveSettings(newSettings);
  };

  const handleClubsUpdated = () => {
    setClubs(db.getClubs());
  };

  const handleAddClub = (newClubData: Omit<Club, 'id'>) => {
    const updated = db.addClub(newClubData);
    setClubs(updated);
  };

  const handleDeleteClub = (id: string) => {
    const updated = db.deleteClub(id);
    setClubs(updated);
  };

  const handleUpdateClub = (updatedClub: Club) => {
    const updated = db.updateClub(updatedClub);
    setClubs(updated);
  };

  const handleRestoreDefaultClubs = () => {
    const defaultClubs = db.restoreDefaultClubs();
    setClubs(defaultClubs);
  };

  const handleResetDatabase = () => {
    setClubs(db.getClubs());
    setSettings(db.getSettings());
  };

  // --- SERIES FLOW HANDLERS ---
  const handleStartNewSeries = (
    p1Name: string,
    p2Name: string,
    format: SeriesFormat,
    excludedDivisions?: string[],
    excludedLeagues?: string[],
    excludedCountries?: string[]
  ) => {
    const winsToWin = format === 1 ? 1 : format === 3 ? 2 : format === 5 ? 3 : 4;

    const newSeries: Series = {
      id: `series_${Date.now()}`,
      player1Name: p1Name,
      player2Name: p2Name,
      format,
      winsToWin,
      player1Wins: 0,
      player2Wins: 0,
      draws: 0,
      player1TotalGoals: 0,
      player2TotalGoals: 0,
      matches: [],
      drawnClubIds: [],
      excludedDivisions: excludedDivisions || settings.excludedDivisions || [],
      excludedLeagues: excludedLeagues || settings.excludedLeagues || [],
      excludedCountries: excludedCountries || settings.excludedCountries || [],
      status: 'drafting_p1',
      currentMatchIndex: 0,
      createdAt: new Date().toISOString(),
    };

    setActiveSeries(newSeries);
    setView('draft');
  };

  const handleUpdateSeriesFilters = (filters: {
    excludedDivisions?: string[];
    excludedLeagues?: string[];
    excludedCountries?: string[];
  }) => {
    if (!activeSeries) return;
    setActiveSeries({
      ...activeSeries,
      ...filters,
    });
  };

  const handleConfirmDraftP1 = (club: Club) => {
    if (!activeSeries) return;
    const updated: Series = {
      ...activeSeries,
      currentP1Club: club,
      status: 'drafting_p2',
    };
    setActiveSeries(updated);
  };

  const handleConfirmDraftP2 = (club: Club) => {
    if (!activeSeries || !activeSeries.currentP1Club) return;
    const updated: Series = {
      ...activeSeries,
      currentP2Club: club,
      drawnClubIds: [
        ...activeSeries.drawnClubIds,
        activeSeries.currentP1Club.id,
        club.id,
      ],
      status: 'vs_ready',
    };
    setActiveSeries(updated);
  };

  const handleStartMatch = () => {
    if (!activeSeries) return;
    const updated: Series = {
      ...activeSeries,
      status: 'in_match',
    };
    setActiveSeries(updated);
    setView('match');
  };

  const handleSaveMatchResult = (p1Goals: number, p2Goals: number) => {
    if (!activeSeries || !activeSeries.currentP1Club || !activeSeries.currentP2Club) return;

    let winnerPlayer: 1 | 2 | 0 = 0;
    if (p1Goals > p2Goals) winnerPlayer = 1;
    else if (p2Goals > p1Goals) winnerPlayer = 2;

    const matchRecord = {
      id: `match_${Date.now()}`,
      matchNumber: activeSeries.currentMatchIndex + 1,
      player1Club: activeSeries.currentP1Club,
      player2Club: activeSeries.currentP2Club,
      player1Goals: p1Goals,
      player2Goals: p2Goals,
      winnerPlayer,
      createdAt: new Date().toISOString(),
    };

    const newMatches = [...activeSeries.matches, matchRecord];
    const newP1Wins = activeSeries.player1Wins + (winnerPlayer === 1 ? 1 : 0);
    const newP2Wins = activeSeries.player2Wins + (winnerPlayer === 2 ? 1 : 0);
    const newDraws = activeSeries.draws + (winnerPlayer === 0 ? 1 : 0);

    const isP1SeriesWinner = newP1Wins >= activeSeries.winsToWin;
    const isP2SeriesWinner = newP2Wins >= activeSeries.winsToWin;
    const isCompleted = isP1SeriesWinner || isP2SeriesWinner;

    const winnerName = isP1SeriesWinner
      ? activeSeries.player1Name
      : isP2SeriesWinner
      ? activeSeries.player2Name
      : undefined;

    const updatedSeries: Series = {
      ...activeSeries,
      player1Wins: newP1Wins,
      player2Wins: newP2Wins,
      draws: newDraws,
      player1TotalGoals: activeSeries.player1TotalGoals + p1Goals,
      player2TotalGoals: activeSeries.player2TotalGoals + p2Goals,
      matches: newMatches,
      status: isCompleted ? 'completed' : 'drafting_p1',
      winnerName,
      winnerPlayer: isP1SeriesWinner ? 1 : isP2SeriesWinner ? 2 : undefined,
      currentMatchIndex: isCompleted ? activeSeries.currentMatchIndex : activeSeries.currentMatchIndex + 1,
      currentP1Club: undefined,
      currentP2Club: undefined,
      completedAt: isCompleted ? new Date().toISOString() : undefined,
    };

    setActiveSeries(updatedSeries);

    // Save series state / log in DB
    db.saveSeries(updatedSeries);

    if (isCompleted) {
      setView('winner');
    } else {
      // Advance to next match drafting!
      setView('draft');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        settings.darkMode
          ? 'bg-[#0a0b0e] text-white selection:bg-[#00FF85] selection:text-black'
          : 'bg-gray-100 text-gray-900 selection:bg-[#00FF85] selection:text-black'
      }`}
    >
      {/* Header Bar */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onNavigateHome={() => setView('home')}
        showBack={view !== 'home'}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {view === 'home' && (
          <HomeView
            settings={settings}
            onNavigate={(nextView) => setView(nextView)}
            clubsCount={clubs.length}
          />
        )}

        {view === 'new_series' && (
          <NewSeriesView
            settings={settings}
            clubs={clubs}
            onStartSeries={handleStartNewSeries}
            onCancel={() => setView('home')}
          />
        )}

        {view === 'draft' && activeSeries && (
          <DraftView
            series={activeSeries}
            clubs={clubs}
            settings={settings}
            onConfirmDraftP1={handleConfirmDraftP1}
            onConfirmDraftP2={handleConfirmDraftP2}
            onStartMatch={handleStartMatch}
            onUpdateSeriesFilters={handleUpdateSeriesFilters}
          />
        )}

        {view === 'match' && activeSeries && (
          <MatchView
            series={activeSeries}
            settings={settings}
            onSaveResult={handleSaveMatchResult}
          />
        )}

        {view === 'winner' && activeSeries && (
          <WinnerView
            series={activeSeries}
            settings={settings}
            onNewSeries={() => setView('new_series')}
            onHome={() => setView('home')}
          />
        )}

        {view === 'history' && (
          <HistoryView
            settings={settings}
            onRefresh={() => setClubs(db.getClubs())}
          />
        )}

        {view === 'stats' && <StatsView settings={settings} />}

        {view === 'import' && (
          <ImportView
            settings={settings}
            onClubsUpdated={handleClubsUpdated}
          />
        )}

        {view === 'clubs' && (
          <ClubsView
            settings={settings}
            clubs={clubs}
            onAddClub={handleAddClub}
            onUpdateClub={handleUpdateClub}
            onDeleteClub={handleDeleteClub}
            onRestoreDefaults={handleRestoreDefaultClubs}
          />
        )}

        {view === 'settings' && (
          <SettingsView
            settings={settings}
            clubs={clubs}
            onUpdateSettings={handleUpdateSettings}
            onResetDatabase={handleResetDatabase}
          />
        )}
      </main>
    </div>
  );
}

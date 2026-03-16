import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BracketProvider } from './hooks/useBracket.jsx';
import PlayerSelect from './components/PlayerSelect';
import Header from './components/Header';
import LockBanner from './components/LockBanner';
import Bracket from './components/Bracket';
import { LS_PLAYERS_KEY } from './constants';
import './App.css';

export default function App() {
  const [players, setPlayers] = useLocalStorage(LS_PLAYERS_KEY, []);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  function handleSelect(name) {
    setCurrentPlayer(name);
  }

  function handleAddPlayer(name) {
    if (!players.includes(name)) {
      setPlayers((prev) => [...prev, name]);
    }
    setCurrentPlayer(name);
  }

  if (!currentPlayer) {
    return (
      <PlayerSelect
        players={players}
        onSelect={handleSelect}
        onAddPlayer={handleAddPlayer}
      />
    );
  }

  return (
    <BracketProvider currentPlayer={currentPlayer}>
      <div className="app">
        <Header currentPlayer={currentPlayer} onSwitchPlayer={() => setCurrentPlayer(null)} />
        <LockBanner />
        <div className="bracket-scroll">
          <Bracket />
        </div>
      </div>
    </BracketProvider>
  );
}

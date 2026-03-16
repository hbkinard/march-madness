import { useState } from 'react';
import './PlayerSelect.css';

export default function PlayerSelect({ players, onSelect, onAddPlayer }) {
  const [newName, setNewName] = useState('');

  const trimmed = newName.trim();
  const isDuplicate = players.includes(trimmed);

  function handleAdd(e) {
    e.preventDefault();
    if (trimmed && !isDuplicate) {
      onAddPlayer(trimmed);
      setNewName('');
    }
  }

  return (
    <div className="ps-overlay">
      <div className="ps-modal">
        <div className="ps-header">
          <span className="ps-year">2026</span>
          <h2>March Madness Bracket</h2>
        </div>

        {players.length > 0 && (
          <div className="ps-section">
            <p className="ps-label">Select your bracket</p>
            <div className="ps-player-list">
              {players.map((name) => (
                <button key={name} className="ps-player-btn" onClick={() => onSelect(name)}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="ps-section">
          <p className="ps-label">
            {players.length > 0 ? 'Add a new player' : 'Enter your name to get started'}
          </p>
          <form onSubmit={handleAdd} className="ps-add-form">
            <input
              type="text"
              placeholder="Player name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              maxLength={40}
            />
            <button type="submit" disabled={!trimmed || isDuplicate}>
              {players.length === 0 ? 'Start' : 'Add & Select'}
            </button>
          </form>
          {isDuplicate && trimmed && (
            <p className="ps-error">"{trimmed}" already has a bracket — select them above.</p>
          )}
        </div>
      </div>
    </div>
  );
}

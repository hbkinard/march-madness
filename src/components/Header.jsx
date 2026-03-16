import { useBracket } from '../hooks/useBracket.jsx';
import './Header.css';

export default function Header({ currentPlayer, onSwitchPlayer }) {
  const { forceSave, savedIndicator, locked } = useBracket();

  return (
    <header className="header">
      <div className="header-title">
        <span className="header-year">2026</span>
        <h1>March Madness Bracket</h1>
      </div>

      <div className="header-right">
        <div className="header-user">
          <span className="header-user-label">Bracket for</span>
          <span className="header-user-name">{currentPlayer}</span>
        </div>
        <div className="header-actions">
          {!locked && (
            <button
              className={`btn-save ${savedIndicator ? 'btn-save--saved' : ''}`}
              onClick={forceSave}
            >
              {savedIndicator ? 'Saved ✓' : 'Save'}
            </button>
          )}
          <button className="btn-switch" onClick={onSwitchPlayer}>
            Switch Player
          </button>
        </div>
      </div>
    </header>
  );
}

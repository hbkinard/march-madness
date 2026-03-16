import { useState } from 'react';
import './UsernameModal.css';

export default function UsernameModal({ onSubmit }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Welcome to March Madness 2026</h2>
        <p>Enter your name to fill out your bracket.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            maxLength={40}
          />
          <button type="submit" disabled={!value.trim()}>
            Start Bracket
          </button>
        </form>
      </div>
    </div>
  );
}

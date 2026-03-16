import { useState, useEffect } from 'react';
import { isLocked, timeUntilLock } from '../utils/time';
import './LockBanner.css';

export default function LockBanner() {
  const [locked, setLocked] = useState(isLocked());
  const [countdown, setCountdown] = useState(timeUntilLock());

  useEffect(() => {
    const interval = setInterval(() => {
      setLocked(isLocked());
      setCountdown(timeUntilLock());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (locked) {
    return (
      <div className="lock-banner lock-banner--locked">
        Bracket Locked — Good luck!
      </div>
    );
  }

  return (
    <div className="lock-banner lock-banner--open">
      Locks in: <strong>{countdown}</strong>
    </div>
  );
}

import { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { computeBracketState, cascadeClear } from '../utils/bracket';
import { isLocked } from '../utils/time';
import { LS_ALL_PICKS_KEY } from '../constants';

const BracketContext = createContext(null);

function bracketReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PICKS':
      return { ...state, picks: action.picks, locked: isLocked() };

    case 'SELECT_WINNER': {
      if (state.locked) return state;
      const { matchupId, winner } = action;
      const oldWinner = state.picks[matchupId];

      if (oldWinner === winner) {
        const cleared = cascadeClear({ ...state.picks, [matchupId]: null }, matchupId, oldWinner);
        return { ...state, picks: { ...cleared, [matchupId]: null } };
      }

      let newPicks = { ...state.picks, [matchupId]: winner };
      if (oldWinner) {
        newPicks = cascadeClear(newPicks, matchupId, oldWinner);
        newPicks[matchupId] = winner;
      }

      return { ...state, picks: newPicks };
    }

    case 'CHECK_LOCK':
      return { ...state, locked: isLocked() };

    default:
      return state;
  }
}

export function BracketProvider({ currentPlayer, children }) {
  const [allPicks, setAllPicks] = useLocalStorage(LS_ALL_PICKS_KEY, {});
  const [savedIndicator, setSavedIndicator] = useState(false);

  const [state, dispatch] = useReducer(bracketReducer, {
    picks: allPicks[currentPlayer] || {},
    locked: isLocked(),
  });

  // When player switches, load their picks
  useEffect(() => {
    dispatch({ type: 'LOAD_PICKS', picks: allPicks[currentPlayer] || {} });
  }, [currentPlayer]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save on every pick change
  useEffect(() => {
    setAllPicks((prev) => ({ ...prev, [currentPlayer]: state.picks }));
  }, [state.picks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll lock status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: 'CHECK_LOCK' }), 30000);
    return () => clearInterval(interval);
  }, []);

  const selectWinner = useCallback((matchupId, winner) => {
    dispatch({ type: 'SELECT_WINNER', matchupId, winner });
  }, []);

  const forceSave = useCallback(() => {
    setAllPicks((prev) => ({ ...prev, [currentPlayer]: state.picks }));
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  }, [currentPlayer, state.picks]); // eslint-disable-line react-hooks/exhaustive-deps

  const bracketState = computeBracketState(state.picks);

  return (
    <BracketContext.Provider
      value={{ picks: state.picks, bracketState, locked: state.locked, selectWinner, forceSave, savedIndicator }}
    >
      {children}
    </BracketContext.Provider>
  );
}

export function useBracket() {
  const ctx = useContext(BracketContext);
  if (!ctx) throw new Error('useBracket must be used inside BracketProvider');
  return ctx;
}

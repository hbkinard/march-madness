import TeamSlot from './TeamSlot';
import { useBracket } from '../hooks/useBracket.jsx';
import './Matchup.css';

export default function Matchup({ matchupId, mirrored }) {
  const { bracketState, picks, locked, selectWinner } = useBracket();
  const matchup = bracketState[matchupId];

  if (!matchup) return null;

  const { topTeam, topSeed, bottomTeam, bottomSeed } = matchup;
  const winner = picks[matchupId] || null;

  const topIsWinner = !!winner && winner === topTeam;
  const bottomIsWinner = !!winner && winner === bottomTeam;
  const topIsEliminated = !!winner && winner !== topTeam && !!topTeam;
  const bottomIsEliminated = !!winner && winner !== bottomTeam && !!bottomTeam;

  function handleTop() {
    if (topTeam) selectWinner(matchupId, topTeam);
  }

  function handleBottom() {
    if (bottomTeam) selectWinner(matchupId, bottomTeam);
  }

  return (
    <div className={`matchup ${mirrored ? 'matchup--mirrored' : ''}`}>
      <div className="matchup-teams">
        <TeamSlot
          seed={topSeed}
          team={topTeam}
          isWinner={topIsWinner}
          isEliminated={topIsEliminated}
          onClick={handleTop}
          locked={locked}
        />
        <div className="matchup-divider" />
        <TeamSlot
          seed={bottomSeed}
          team={bottomTeam}
          isWinner={bottomIsWinner}
          isEliminated={bottomIsEliminated}
          onClick={handleBottom}
          locked={locked}
        />
      </div>
      <div className="matchup-connector">
        <div className="connector-top" />
        <div className="connector-mid" />
        <div className="connector-bottom" />
      </div>
    </div>
  );
}

import Matchup from './Matchup';
import { useBracket } from '../hooks/useBracket.jsx';
import './FinalFour.css';

export default function FinalFour() {
  const { picks } = useBracket();
  const champion = picks['ff-R6-M0'] || null;

  return (
    <div className="final-four">
      <div className="ff-label">Final Four</div>

      <div className="ff-semi">
        <div className="ff-semi-label">East vs West</div>
        <Matchup matchupId="ff-R5-M0" />
      </div>

      <div className="ff-championship">
        <div className="ff-champ-label">Championship</div>
        <Matchup matchupId="ff-R6-M0" />
        {champion && (
          <div className="ff-champion-display">
            <div className="ff-champion-trophy">🏆</div>
            <div className="ff-champion-name">{champion}</div>
            <div className="ff-champion-sub">2026 Champion</div>
          </div>
        )}
      </div>

      <div className="ff-semi">
        <div className="ff-semi-label">South vs Midwest</div>
        <Matchup matchupId="ff-R5-M1" />
      </div>
    </div>
  );
}

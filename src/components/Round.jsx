import Matchup from './Matchup';

// Each round doubles the cell height so matchups stay vertically aligned.
// R1: 8 matchups × 57px = 456px total
// R2: 4 matchups × 114px = 456px total
// R3: 2 matchups × 228px = 456px total
// R4: 1 matchup  × 456px = 456px total
const BASE_SLOT_HEIGHT = 28;
const SLOT_DIVIDER = 1;
export const MATCHUP_HEIGHT = BASE_SLOT_HEIGHT * 2 + SLOT_DIVIDER; // 57px

export default function Round({ region, round, mirrored }) {
  const matchupsInRound = Math.pow(2, 4 - round); // R1=8, R2=4, R3=2, R4=1
  const scale = Math.pow(2, round - 1);            // R1=1, R2=2, R3=4, R4=8
  const cellHeight = MATCHUP_HEIGHT * scale;        // each cell is exactly scale*57px

  const matchupIds = Array.from({ length: matchupsInRound }, (_, i) =>
    `${region}-R${round}-M${i}`
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {matchupIds.map((id) => (
        <div
          key={id}
          style={{
            height: `${cellHeight}px`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%' }}>
            <Matchup matchupId={id} mirrored={mirrored} />
          </div>
        </div>
      ))}
    </div>
  );
}

import Round from './Round';
import './Region.css';

export default function Region({ regionKey, regionName, mirrored }) {
  // R1-R4 rounds
  const rounds = [1, 2, 3, 4];

  return (
    <div className={`region ${mirrored ? 'region--mirrored' : ''}`}>
      <div className="region-name">{regionName}</div>
      <div className="region-rounds">
        {(mirrored ? [...rounds].reverse() : rounds).map((round) => (
          <div key={round} className="region-round-col">
            <Round region={regionKey} round={round} mirrored={mirrored} />
          </div>
        ))}
      </div>
    </div>
  );
}

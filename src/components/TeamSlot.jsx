import './TeamSlot.css';

export default function TeamSlot({ seed, team, isWinner, isEliminated, onClick, locked, empty }) {
  if (empty || !team) {
    return <div className="team-slot team-slot--empty" />;
  }

  const classes = [
    'team-slot',
    isWinner ? 'team-slot--winner' : '',
    isEliminated ? 'team-slot--eliminated' : '',
    !locked && onClick ? 'team-slot--clickable' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={!locked && onClick ? onClick : undefined} title={team}>
      {seed != null && <span className="team-seed">{seed}</span>}
      <span className="team-name">{team}</span>
    </div>
  );
}

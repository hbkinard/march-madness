import Region from './Region';
import FinalFour from './FinalFour';
import teamsData from '../data/teams.json';
import './Bracket.css';

export default function Bracket() {
  const regions = teamsData.regions;

  return (
    <div className="bracket">
      {/* Left side: East (top) + West (bottom) */}
      <div className="bracket-side bracket-side--left">
        <Region regionKey="east" regionName={regions.east.name} mirrored={false} />
        <div className="side-divider" />
        <Region regionKey="west" regionName={regions.west.name} mirrored={false} />
      </div>

      {/* Center: Final Four */}
      <div className="bracket-center">
        <FinalFour />
      </div>

      {/* Right side: South (top) + Midwest (bottom), mirrored */}
      <div className="bracket-side bracket-side--right">
        <Region regionKey="south" regionName={regions.south.name} mirrored={true} />
        <div className="side-divider" />
        <Region regionKey="midwest" regionName={regions.midwest.name} mirrored={true} />
      </div>
    </div>
  );
}

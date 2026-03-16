// Bracket locks at noon ET on March 19, 2026
export const LOCK_DEADLINE = new Date('2026-03-19T12:00:00-04:00');

// Round names
export const ROUND_NAMES = [
  'First Round',
  'Second Round',
  'Sweet 16',
  'Elite 8',
  'Final Four',
  'Championship',
];

// Region order: left side renders East + West, right side Midwest + South
// Final Four: East vs West (Semi 1), South vs Midwest (Semi 2)
export const REGIONS = ['east', 'west', 'midwest', 'south'];

// Left side regions (flow left-to-right into center)
export const LEFT_REGIONS = ['east', 'west'];
// Right side regions (flow right-to-left into center, mirrored)
export const RIGHT_REGIONS = ['south', 'midwest'];

// Final Four matchup config
export const FINAL_FOUR_MATCHUPS = [
  { id: 'ff-R5-M0', topRegion: 'east', bottomRegion: 'west' },
  { id: 'ff-R5-M1', topRegion: 'south', bottomRegion: 'midwest' },
];
export const CHAMPIONSHIP_ID = 'ff-R6-M0';

// Number of rounds per region (R1-R4)
export const REGION_ROUNDS = 4;
// Total rounds including FF and Championship
export const TOTAL_ROUNDS = 6;

// localStorage keys
export const LS_PLAYERS_KEY = 'mm2026_players';       // string[]
export const LS_ALL_PICKS_KEY = 'mm2026_all_picks';   // { [player]: { [matchupId]: winner } }

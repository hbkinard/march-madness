import teamsData from '../data/teams.json';

// Generate matchup ID
export function matchupId(region, round, index) {
  return `${region}-R${round}-M${index}`;
}

// Generate the initial Round 1 matchups from teams.json
export function generateInitialMatchups() {
  const matchups = {};
  for (const [regionKey, regionData] of Object.entries(teamsData.regions)) {
    regionData.matchups.forEach((m, idx) => {
      const id = matchupId(regionKey, 1, idx);
      matchups[id] = {
        id,
        region: regionKey,
        round: 1,
        index: idx,
        topTeam: m.topTeam,
        topSeed: m.topSeed,
        bottomTeam: m.bottomTeam,
        bottomSeed: m.bottomSeed,
      };
    });
  }
  return matchups;
}

// Compute the full bracket state from picks + initial matchups
// Returns: { [matchupId]: { id, round, index, region, topTeam, topSeed, bottomTeam, bottomSeed } }
export function computeBracketState(picks) {
  const initial = generateInitialMatchups();
  const state = { ...initial };

  // Process each region rounds 2-4
  for (const regionKey of Object.keys(teamsData.regions)) {
    for (let round = 2; round <= 4; round++) {
      const matchupsInRound = Math.pow(2, 4 - round); // R2=4, R3=2, R4=1
      for (let idx = 0; idx < matchupsInRound; idx++) {
        const id = matchupId(regionKey, round, idx);
        // The two feeders are from previous round at indices idx*2 and idx*2+1
        const topFeederId = matchupId(regionKey, round - 1, idx * 2);
        const bottomFeederId = matchupId(regionKey, round - 1, idx * 2 + 1);
        const topTeam = picks[topFeederId] || null;
        const bottomTeam = picks[bottomFeederId] || null;

        // Get seeds by looking up who those teams are in the initial bracket
        const topSeed = topTeam ? getSeedForTeam(topTeam, regionKey, state) : null;
        const bottomSeed = bottomTeam ? getSeedForTeam(bottomTeam, regionKey, state) : null;

        state[id] = { id, region: regionKey, round, index: idx, topTeam, topSeed, bottomTeam, bottomSeed };
      }
    }
  }

  // Final Four semis: ff-R5-M0 (East vs West), ff-R5-M1 (South vs Midwest)
  const ffPairings = [
    { id: 'ff-R5-M0', topRegion: 'east', bottomRegion: 'west' },
    { id: 'ff-R5-M1', topRegion: 'south', bottomRegion: 'midwest' },
  ];
  ffPairings.forEach(({ id, topRegion, bottomRegion }, idx) => {
    const topFeederId = matchupId(topRegion, 4, 0);
    const bottomFeederId = matchupId(bottomRegion, 4, 0);
    const topTeam = picks[topFeederId] || null;
    const bottomTeam = picks[bottomFeederId] || null;
    const topSeed = topTeam ? getSeedForTeam(topTeam, topRegion, state) : null;
    const bottomSeed = bottomTeam ? getSeedForTeam(bottomTeam, bottomRegion, state) : null;
    state[id] = { id, region: 'finalfour', round: 5, index: idx, topTeam, topSeed, bottomTeam, bottomSeed };
  });

  // Championship: ff-R6-M0
  const champTopTeam = picks['ff-R5-M0'] || null;
  const champBottomTeam = picks['ff-R5-M1'] || null;
  state['ff-R6-M0'] = {
    id: 'ff-R6-M0',
    region: 'finalfour',
    round: 6,
    index: 0,
    topTeam: champTopTeam,
    topSeed: champTopTeam ? getSeedForTeamGlobal(champTopTeam, state) : null,
    bottomTeam: champBottomTeam,
    bottomSeed: champBottomTeam ? getSeedForTeamGlobal(champBottomTeam, state) : null,
  };

  return state;
}

// Look up a team's seed within a region from initial matchups
function getSeedForTeam(teamName, regionKey, state) {
  for (let idx = 0; idx < 8; idx++) {
    const m = state[matchupId(regionKey, 1, idx)];
    if (!m) continue;
    if (m.topTeam === teamName) return m.topSeed;
    if (m.bottomTeam === teamName) return m.bottomSeed;
  }
  return null;
}

function getSeedForTeamGlobal(teamName, state) {
  for (const key of Object.keys(state)) {
    const m = state[key];
    if (m.round !== 1) continue;
    if (m.topTeam === teamName) return m.topSeed;
    if (m.bottomTeam === teamName) return m.bottomSeed;
  }
  return null;
}

// Given a picks map and a matchup that changed (oldWinner removed), clear all
// downstream picks that reference the old winner.
export function cascadeClear(picks, changedMatchupId, oldWinner) {
  if (!oldWinner) return picks;

  const updated = { ...picks };
  // BFS: find all matchups downstream that contain oldWinner
  const queue = [changedMatchupId];
  const visited = new Set();

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const nextId = getDownstreamMatchupId(currentId);
    if (!nextId) continue;

    // If the downstream matchup's pick equals oldWinner, clear it and continue cascade
    if (updated[nextId] === oldWinner) {
      updated[nextId] = null;
      queue.push(nextId);
    }
  }

  return updated;
}

// Given a matchup ID, return the ID of the next-round matchup that this feeds into
export function getDownstreamMatchupId(id) {
  // Parse region matchup: {region}-R{round}-M{index}
  const regionMatch = id.match(/^(\w+)-R(\d+)-M(\d+)$/);
  if (!regionMatch) return null;

  const [, region, roundStr, indexStr] = regionMatch;
  const round = parseInt(roundStr, 10);
  const index = parseInt(indexStr, 10);

  // Region rounds 1-3 feed into next region round
  if (region !== 'ff' && round < 4) {
    return matchupId(region, round + 1, Math.floor(index / 2));
  }

  // Region round 4 (Elite 8) feeds into Final Four semis
  if (region !== 'ff' && round === 4) {
    // east->ff-R5-M0 top, west->ff-R5-M0 bottom, south->ff-R5-M1 top, midwest->ff-R5-M1 bottom
    const ffMap = { east: 'ff-R5-M0', west: 'ff-R5-M0', south: 'ff-R5-M1', midwest: 'ff-R5-M1' };
    return ffMap[region] || null;
  }

  // Final Four semis feed into championship
  if (region === 'ff' && round === 5) {
    return 'ff-R6-M0';
  }

  return null;
}

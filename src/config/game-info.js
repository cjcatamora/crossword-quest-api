// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'crossword-quest',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'CrosswordQuest',            // the name players will see
  team: 'Group 6 (3-1)',            // your group's name and section, for example Bookworms (3-1)
  developer: 'cjcatamora',       // YOUR GitHub username: this build is yours
  description: 'CrosswordQuest is a multiplayer crossword puzzle game where each player uses their own device, players join via a shareable link + 6-digit code, race to solve clues on a shared grid, and see every correct answer fill instantly on everyones screen.',     // one sentence about how the game is played
  min_players: 1,               // change to the limits your game is designed for
  max_players: 30,
  version: pkg.version,         // read from package.json, do not edit here
};

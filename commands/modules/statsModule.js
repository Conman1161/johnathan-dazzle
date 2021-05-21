const { DiceRoll, DiceRoller } = require('rpg-dice-roller');

function rollStats(args) {
  let statThreshold = args === "70" ? 70 : 1;

  let diceObj = new DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');

  while (diceObj.total < statThreshold) {
    diceObj.roll();
  }

  return diceObj;
}

function rollStats20() {
  return new DiceRoll('{d20,d20,d20,d20,d20,d20}');
}

function rollcth() {
  // str, con, size, dex, app, int, pow, edu
  let roller = new DiceRoller();
  let str = roller.roll('3d6');
  let con = roller.roll('3d6');
  let siz = roller.roll('2d6');
  let dex = roller.roll('3d6');
  let app = roller.roll('3d6');
  let int = roller.roll('2d6');
  let pow = roller.roll('3d6');
  let edu = roller.roll('2d6');
  return [str, con, siz, dex, app, int, pow, edu];
}

function getMod(args) {
  if (parseInt(args) >= 1 && parseInt(args) <= 30) {
    return Math.floor((parseInt(args) - 10) / 2);
  }
  return 'You did not enter a valid ability score!';

}

module.exports = {
  rollStats,
  rollStats20,
  rollcth,
  getMod,
};

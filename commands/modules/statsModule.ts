import { DiceRoll } from 'rpg-dice-roller';

function rollStats(args: string | undefined): DiceRoll {
  let statThreshold = args === "70" ? 70 : 1;

  let diceObj = new DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');

  while (diceObj.total < statThreshold) {
    diceObj.roll();
  }

  return diceObj;
}

function rollStats20(): DiceRoll {
  return new DiceRoll('{d20,d20,d20,d20,d20,d20}');
}

function rollcth(): DiceRoll {
  // str, con, size, dex, app, int, pow, edu
  return new DiceRoll(`{3d6,3d6,2d6,3d6,3d6,2d6,3d6,2d6}`);
}

function getMod(args: string | number) {
  if (parseInt(args.toString()) >= 1 && parseInt(args.toString()) <= 30) {
    return Math.floor((parseInt(args.toString()) - 10) / 2);
  }
  return 'You did not enter a valid ability score!';

}

module.exports = {
  rollStats,
  rollStats20,
  rollcth,
  getMod,
};

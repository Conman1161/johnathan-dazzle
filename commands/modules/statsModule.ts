import { DiceRoll } from 'rpg-dice-roller';

//4d6kh3
function rollStandard() {
  return new DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');
}

function rollStandardMin() {
  let diceObj = new DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');

  while (diceObj.total < 70) {
    diceObj.roll();
  }

  return diceObj;
}

//6d20
function rollStats20() {
  return new DiceRoll('{d20,d20,d20,d20,d20,d20}');
}

//cth block
function rollcth() {
  // str, con, size, dex, app, int, pow, edu
  return new DiceRoll(`{3d6,3d6,2d6,3d6,3d6,2d6,3d6,2d6}`);
}

//3d6
function rollClassic(){
  return new DiceRoll(`{3d6,3d6,3d6,3d6,3d6,3d6}`);
}

//2d6+6
function rollHeroic(){
  return new DiceRoll(`{2d6,2d6,2d6,2d6,2d6,2d6}`);
}

//24d6
function rollDicePool(){
  return new DiceRoll(`{24d6}`);
}

function getMod(args: string | number) {
  if (parseInt(args.toString()) >= 1 && parseInt(args.toString()) <= 30) {
    return Math.floor((parseInt(args.toString()) - 10) / 2);
  }
  throw 'You did not enter a valid ability score!';

}

module.exports = {
  rollStandard,
  rollStandardMin,
  rollStats20,
  rollcth,
  rollClassic,
  rollHeroic,
  rollDicePool,
  getMod,
};

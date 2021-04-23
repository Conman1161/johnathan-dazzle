const dice = require("dice-expression-evaluator");

function rollStats(args) {
  let diceRoll;
  let statThreshold = 1;

  if (args == "70") {
    statThreshold = 70;
  }
  const diceObj = new dice('4d6+4d6+4d6+4d6+4d6+4d6');

  do {
    diceRoll = diceObj.roll();
    let statsCheck = diceRoll.roll;
    for (let i = 0; i < diceRoll.diceRaw.length; i++) {
      let currentRolls = diceRoll.diceRaw[i];
      statsCheck -= Math.min.apply(Math, currentRolls);
    }
  } while (statsCheck < statThreshold);

  return diceRoll;
}

function rollStats20() {
  return dice('d20+d20+d20+d20+d20+d20').roll();
}

function rollcth() {
  let str = dice('3d6').roll();
  let con = dice('3d6').roll();
  let siz = dice('2d6').roll();
  let dex = dice('3d6').roll();
  let app = dice('3d6').roll();
  let int = dice('2d6').roll();
  let pow = dice('3d6').roll();
  let edu = dice('2d6').roll();
  return [str, con, siz, dex, app, int, pow, edu];
}

function getMod(args) {
  if (parseInt(args) >= 1 && parseInt(args) <= 30) {
    return Math.ceil((parseInt(args) - 10) / 2);
  }
  return 'You did not enter a valid ability score!';

}

module.exports = {
  rollStats,
  rollStats20,
  rollcth,
  getMod,
};

const dice = require("dice-expression-evaluator");

function rollStats(args) {
  var diceRoll;
  var statThreshold = 1;

  if (args == "70") {
    statThreshold = 70;
  }
  const diceObj = new dice('4d6+4d6+4d6+4d6+4d6+4d6');

  do {
    diceRoll = diceObj.roll();
    var statsCheck = diceRoll.roll;
    for (let i = 0; i < diceRoll.diceRaw.length; i++) {
      var currentRolls = diceRoll.diceRaw[i];
      statsCheck -= Math.min.apply(Math, currentRolls);
    }
  } while (statsCheck < statThreshold);

  return diceRoll;
}

function rollStats20() {
  return dice('d20+d20+d20+d20+d20+d20').roll();
}

function rollcth() {
  var str = dice('3d6').roll();
  var con = dice('3d6').roll();
  var siz = dice('2d6').roll();
  var dex = dice('3d6').roll();
  var app = dice('3d6').roll();
  var int = dice('2d6').roll();
  var pow = dice('3d6').roll();
  var edu = dice('2d6').roll();
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

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
  switch (parseInt(args)) {
    case 1:
      return "-5";

    case 2:
    case 3:
      return "-4";

    case 4:
    case 5:
      return "-3";

    case 6:
    case 7:
      return "-2";

    case 8:
    case 9:
      return "-1";

    case 10:
    case 11:
      return "0";

    case 12:
    case 13:
      return "+1";

    case 14:
    case 15:
      return "+2";

    case 16:
    case 17:
      return "+3";

    case 18:
    case 19:
      return "+4";

    case 20:
    case 21:
      return "+5";

    case 22:
    case 23:
      return "+6";

    case 24:
    case 25:
      return "+7";

    case 26:
    case 27:
      return "+8";

    case 28:
    case 29:
      return "+9";

    case 30:
      return "+10";
  }
}

module.exports = {
  rollStats,
  rollStats20,
  rollcth,
  getMod,
};

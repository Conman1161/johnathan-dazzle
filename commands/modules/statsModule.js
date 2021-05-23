"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpg_dice_roller_1 = require("rpg-dice-roller");
function rollStats(args) {
    let statThreshold = args === "70" ? 70 : 1;
    let diceObj = new rpg_dice_roller_1.DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');
    while (diceObj.total < statThreshold) {
        diceObj.roll();
    }
    return diceObj;
}
function rollStats20() {
    return new rpg_dice_roller_1.DiceRoll('{d20,d20,d20,d20,d20,d20}');
}
function rollcth() {
    // str, con, size, dex, app, int, pow, edu
    return new rpg_dice_roller_1.DiceRoll(`{3d6,3d6,2d6,3d6,3d6,2d6,3d6,2d6}`);
}
function getMod(args) {
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

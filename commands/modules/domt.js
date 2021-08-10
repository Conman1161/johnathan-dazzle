"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw = exports.lookup = void 0;
const rpg_dice_roller_1 = require("rpg-dice-roller");
let table = require('../dnd/charts/domt/cards.json');
function lookup(card) {
    return table[card];
}
exports.lookup = lookup;
function draw(deck) {
    let poolDiceResult = new rpg_dice_roller_1.DiceRoll(`d${parseInt(deck)}`).total - 1;
    return Object.keys(table)[poolDiceResult];
}
exports.draw = draw;

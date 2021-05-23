"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpg_dice_roller_1 = require("rpg-dice-roller");
const table = require('../dnd/charts/domt/cards.json');
function lookup(card) {
    return table[card];
}
function draw(deck) {
    let poolDiceResult = new rpg_dice_roller_1.DiceRoll(`d${parseInt(deck)}`).total - 1;
    return Object.keys(table)[poolDiceResult];
}
module.exports = {
    lookup, draw
};

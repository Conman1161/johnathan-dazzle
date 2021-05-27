import { DiceRoll } from 'rpg-dice-roller';
const table = require('../dnd/charts/domt/cards.json');

function lookup(card: string) {
    return table[card];
}

function draw(deck: string) {
    let poolDiceResult = new DiceRoll(`d${parseInt(deck)}`).total - 1;
    return Object.keys(table)[poolDiceResult];
}

module.exports = {
    lookup, draw
};
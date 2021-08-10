import { DiceRoll } from 'rpg-dice-roller';
let table = require('../dnd/charts/domt/cards.json');

export function lookup(card: string) {
    return table[card];
}

export function draw(deck: string) {
    let poolDiceResult = new DiceRoll(`d${parseInt(deck)}`).total - 1;
    return Object.keys(table)[poolDiceResult];
}
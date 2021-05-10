const dice = require('dice-expression-evaluator');
const table = require('../dnd/charts/domt/cards.json');

function lookup(card) {
    return table[card];
}

function draw(deck) {
    let poolDiceResult = new dice(`d${parseInt(deck)}`).roll().roll - 1;
    return Object.keys(table)[poolDiceResult];
}

module.exports = {
    lookup, draw
};
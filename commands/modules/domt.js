const dice = require('dice-expression-evaluator');
const table = require('../dnd/charts/domt/cards.json');
const indexes = require('../dnd/charts/domt/indexes.json');

function lookup(card){
    if(table[card]===undefined){
        throw 22;
    }
    return [table[card], indexes[card]];
}

function roll(pool){
    var poolDiceResult = new dice(`d${pool.length}`).roll().roll-1;
    return [pool[poolDiceResult], poolDiceResult];
}

module.exports = {
    lookup, roll
};
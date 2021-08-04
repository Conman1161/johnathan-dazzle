"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMod = exports.rollDicePool = exports.rollHeroic = exports.rollClassic = exports.rollcth = exports.rollStats20 = exports.rollStandardMin = exports.rollStandard = void 0;
const discord_js_1 = require("discord.js");
const rpg_dice_roller_1 = require("rpg-dice-roller");
const intStrings = ["One", "Two", "Three", "Four", "Five", "Six"];
const cocNames = ['Strength', 'Constitution', 'Size', 'Dexterity', 'Appearance', 'Intelligence', 'Power', 'Education'];
//4d6kh3
function rollStandard() {
    let diceRoll = new rpg_dice_roller_1.DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');
    let embed = new discord_js_1.MessageEmbed();
    diceRoll.rolls[0].results.forEach((roll, index) => {
        let currentSet = roll.results[0];
        let rollArray = [];
        currentSet.rolls.forEach((currentRoll) => {
            rollArray.push(currentRoll.value);
        });
        let min = Math.min.apply(Math, rollArray);
        rollArray[rollArray.indexOf(min)] = `~~${min}~~`;
        embed.addField(`__Stat ${intStrings[index]}__`, `**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`, true);
    });
    embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
    return embed;
}
exports.rollStandard = rollStandard;
function rollStandardMin() {
    let diceRoll = new rpg_dice_roller_1.DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');
    let embed = new discord_js_1.MessageEmbed();
    while (diceRoll.total < 70) {
        diceRoll.roll();
    }
    diceRoll.rolls[0].results.forEach((roll, index) => {
        let currentSet = roll.results[0];
        let rollArray = [];
        currentSet.rolls.forEach((currentRoll) => {
            rollArray.push(currentRoll.value);
        });
        let min = Math.min.apply(Math, rollArray);
        rollArray[rollArray.indexOf(min)] = `~~${min}~~`;
        embed.addField(`__Stat ${intStrings[index]}__`, `**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`, true);
    });
    embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
    return embed;
}
exports.rollStandardMin = rollStandardMin;
//6d20
function rollStats20() {
    let diceRoll = new rpg_dice_roller_1.DiceRoll('{d20,d20,d20,d20,d20,d20}');
    let embed = new discord_js_1.MessageEmbed();
    diceRoll.rolls[0].results.forEach((roll, index) => {
        let currentSet = roll.results[0];
        let rollArray = [];
        currentSet.rolls.forEach((currentRoll) => {
            rollArray.push(currentRoll.value);
            embed.addField(`__Stat ${intStrings[index]}__`, `**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`, true);
        });
    });
    embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
    return embed;
}
exports.rollStats20 = rollStats20;
//cth block
function rollcth() {
    // str, con, size, dex, app, int, pow, edu
    let diceRoll = new rpg_dice_roller_1.DiceRoll(`{3d6,3d6,2d6,3d6,3d6,2d6,3d6,2d6}`);
    let embed = new discord_js_1.MessageEmbed();
    diceRoll.rolls[0].results.forEach((roll, index) => {
        let currentSet = roll.results[0];
        let rollArray = [];
        currentSet.rolls.forEach((roll) => {
            rollArray.push(roll.value);
        });
        if ([2, 5, 7].includes(index))
            rollArray.push('**6**');
        embed.addField(`__${cocNames[index]}__`, `**${(currentSet.value) * 5}**\nFrom: [ ${rollArray.join(' + ')} ] * 5`, true);
    });
    return embed;
}
exports.rollcth = rollcth;
//3d6
function rollClassic() {
    let diceRoll = new rpg_dice_roller_1.DiceRoll(`{3d6,3d6,3d6,3d6,3d6,3d6}`);
    let embed = new discord_js_1.MessageEmbed();
    diceRoll.rolls[0].results.forEach((roll, index) => {
        let currentSet = roll.results[0];
        let rollArray = [];
        currentSet.rolls.forEach((currentRoll) => {
            rollArray.push(currentRoll.value);
        });
        embed.addField(`__Stat ${intStrings[index]}__`, `**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`, true);
    });
    embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
    return embed;
}
exports.rollClassic = rollClassic;
//2d6+6
function rollHeroic() {
    let diceRoll = new rpg_dice_roller_1.DiceRoll(`{2d6,2d6,2d6,2d6,2d6,2d6}`);
    let embed = new discord_js_1.MessageEmbed();
    diceRoll.rolls[0].results.forEach((roll, index) => {
        let currentSet = roll.results[0];
        let rollArray = [];
        currentSet.rolls.forEach((currentRoll) => {
            rollArray.push(currentRoll.value);
        });
        rollArray.push('**6**');
        embed.addField(`__Stat ${intStrings[index]}__`, `**${currentSet.value + 6}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value + 6)}**__`, true);
    });
    embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total + (6 * 6)}**__`);
    return embed;
}
exports.rollHeroic = rollHeroic;
//24d6
function rollDicePool() {
    let diceRoll = new rpg_dice_roller_1.DiceRoll(`{24d6}`);
    let embed = new discord_js_1.MessageEmbed();
    diceRoll.rolls[0].results.forEach((roll, index) => {
        let currentSet = roll.results[0];
        let rollArray = [];
        currentSet.rolls.forEach((currentRoll) => {
            rollArray.push(currentRoll.value);
        });
        embed.addField(`Your Dice Pool`, `[ ${rollArray.join(', ')} ]`, true);
    });
    embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
    return embed;
}
exports.rollDicePool = rollDicePool;
function getMod(args) {
    if (parseInt(args.toString()) >= 1 && parseInt(args.toString()) <= 30) {
        return Math.floor((parseInt(args.toString()) - 10) / 2);
    }
    throw 'You did not enter a valid ability score!';
}
exports.getMod = getMod;

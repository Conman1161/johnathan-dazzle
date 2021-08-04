import { MessageEmbed } from 'discord.js';
import { DiceRoll } from 'rpg-dice-roller';
import { RollResult } from 'rpg-dice-roller/types/results';
const intStrings = ["One", "Two", "Three", "Four", "Five", "Six"];
const cocNames = ['Strength', 'Constitution', 'Size', 'Dexterity', 'Appearance', 'Intelligence', 'Power', 'Education'];

//4d6kh3
export function rollStandard() {
  let diceRoll = new DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');
  let embed = new MessageEmbed();

  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    let min  = Math.min.apply(Math, rollArray);
    rollArray[rollArray.indexOf(min)] = `~~${min}~~`;
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  
  return embed;
}

export function rollStandardMin() {
  let diceRoll = new DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');
  let embed = new MessageEmbed();

  while (diceRoll.total < 70) {
    diceRoll.roll();
  }
  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    let min  = Math.min.apply(Math, rollArray);
    rollArray[rollArray.indexOf(min)] = `~~${min}~~`;
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);

  return embed;
}

//6d20
export function rollStats20() {
  let diceRoll = new DiceRoll('{d20,d20,d20,d20,d20,d20}');
  let embed = new MessageEmbed();

  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
      embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
    });
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);

  return embed;
}

//cth block
export function rollcth() {
  // str, con, size, dex, app, int, pow, edu
  let diceRoll = new DiceRoll(`{3d6,3d6,2d6,3d6,3d6,2d6,3d6,2d6}`);
  let embed = new MessageEmbed();

  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];

    currentSet.rolls.forEach((roll: RollResult)=>{
      rollArray.push(roll.value);
    })
    if ([2, 5, 7].includes(index)) rollArray.push('**6**');
    embed.addField(`__${cocNames[index]}__`, `**${(currentSet.value) * 5}**\nFrom: [ ${rollArray.join(' + ')} ] * 5`, true);
  });

  return embed;
}

//3d6
export function rollClassic(){
  let diceRoll = new DiceRoll(`{3d6,3d6,3d6,3d6,3d6,3d6}`);
  let embed = new MessageEmbed();

  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);

  return embed;
}

//2d6+6
export function rollHeroic(){
  let diceRoll = new DiceRoll(`{2d6,2d6,2d6,2d6,2d6,2d6}`);
  let embed = new MessageEmbed();

  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];

    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    rollArray.push('**6**');
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value+6}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value+6)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total + (6*6)}**__`);

  return embed;
}

//24d6
export function rollDicePool(){
  let diceRoll = new DiceRoll(`{24d6}`);
  let embed = new MessageEmbed();

  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];

    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });

    embed.addField(`Your Dice Pool`,`[ ${rollArray.join(', ')} ]`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);

  return embed;
}

export function getMod(args: string | number) {
  if (parseInt(args.toString()) >= 1 && parseInt(args.toString()) <= 30) {
    return Math.floor((parseInt(args.toString()) - 10) / 2);
  }
  throw 'You did not enter a valid ability score!';

}
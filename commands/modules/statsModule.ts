import { MessageEmbed } from 'discord.js';
import { DiceRoll } from 'rpg-dice-roller';
import { RollResult } from 'rpg-dice-roller/types/results';
let intStrings = ["One", "Two", "Three", "Four", "Five", "Six"];
let dtlNames = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']
let cocNames = ['Strength', 'Constitution', 'Size', 'Dexterity', 'Appearance', 'Intelligence', 'Power', 'Education'];

//4d6kh3
export function rollStandard() {
  let diceRoll = new DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');
  let embed = new MessageEmbed();

  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    //@ts-expect-error
    let min  = Math.min(...rollArray);
    rollArray[rollArray.indexOf(min)] = `~~${min}~~`;
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: `The normal 4d6 keep the highest 3d6`})

  return embed;
}

//4d6kh3 min 70
export function rollStandardMin() {
  let diceRoll = new DiceRoll('{4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3,4d6kh3}');
  let embed = new MessageEmbed();

  while (diceRoll.total < 70) {
    diceRoll.roll();
  }
  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    //@ts-expect-error
    let min  = Math.min(...rollArray);
    rollArray[rollArray.indexOf(min)] = `~~${min}~~`;
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: `The same as Standard, except the sum of all your Ability Scores MUST be higher than 70`})

  return embed;
}

//6d20
export function rollStats20() {
  let diceRoll = new DiceRoll('{d20,d20,d20,d20,d20,d20}');
  let embed = new MessageEmbed();

  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
      embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
    });
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: 'Instead of rolling multiple dice for each Ability Score, you roll 1d20 for each individual stat'})

  return embed;
}

//cth block
export function rollcth() {
  // str, con, size, dex, app, int, pow, edu
  let diceRoll = new DiceRoll(`{3d6,3d6,2d6,3d6,3d6,2d6,3d6,2d6}`);
  let embed = new MessageEmbed();

  //@ts-expect-error
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

  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: 'From the Pathfinder SRD, you roll 3d6 for each Ability Score'});

  return embed;
}

//2d6+6
export function rollHeroic(){
  let diceRoll = new DiceRoll(`{2d6,2d6,2d6,2d6,2d6,2d6}`);
  let embed = new MessageEmbed();

  //@ts-expect-error
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
  embed.setFooter({text: 'From the Pathfinder SRD, you roll 2d6+6 for each Ability Score'})

  return embed;
}

//24d6
export function rollDicePool(){
  let diceRoll = new DiceRoll(`{24d6}`);
  let embed = new MessageEmbed();

  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll: any)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];

    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });

    embed.addField(`Your Dice Pool`,`[ ${rollArray.join(', ')} ]`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: 'Before rolling your dice pool, select how many d6 per Ability Score (min 3d6) you wish to assign. Then, in order of which stats you want first (decided beforehand), take the amount of d6s you selected for each Ability Score in order\nFrom the Pathfinder SRD'})

  return embed;
}

//TODO: 6x6 grid of 4d6kh3 (Bingo) [ ]
//TODO: (3d6+1d8)kh3 [ ]
//TODO: 5d6kh3 (Power Rolling) [X]
//TODO: 4d4 (Dark Sun) [X]
//TODO: 5d4 (Dark Sun Pus) [X]
//TODO: 3d6 (Down the Line) [X]
//TODO: 24d6dl6 (Munchkin Method) [X]
//TODO: 3x3 grid of 1d6 each (Tic-Tac-Toe) [ ]
//TODO: Choose your own! [ ]

export function rollBingo(){
  let d6 = new DiceRoll('4d6kh3');
  let embed = new MessageEmbed();

  embed.addField('WIP!','WIP!');

  embed.setFooter({text: `Use an Ability Score line that would be a 6-long bingo! Useful for rolling stats as a party`});
  
  return embed;
}

// 5d6kh3
export function rollPower() {
  let diceRoll = new DiceRoll('{5d6kh3,5d6kh3,5d6kh3,5d6kh3,5d6kh3,5d6kh3}');
  let embed = new MessageEmbed();

  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll, index) => {
    let currentSet = roll.results[0];
    let rollArray = [];
    currentSet.rolls.forEach((currentRoll) => {
        rollArray.push(currentRoll.value);
    });
    let minOne = Math.min(...rollArray);
    let rollArrayMinusMinOne = [...rollArray]
    rollArrayMinusMinOne.splice(rollArray.indexOf(minOne), 1);
    let minTwo = Math.min(...rollArrayMinusMinOne);
    rollArray[rollArray.indexOf(minOne)] = `~~${minOne}~~`;
    rollArray[rollArray.indexOf(minTwo)] = `~~${minTwo}~~`;
    embed.addField(`__Stat ${intStrings[index]}__`, `**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`, true);
});

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: 'Instead of rolling 4d6 and keeping the highest 3d6, you roll 5d6 instead'})
  
  return embed;
}

// 4d4
export function rollDarkSun(){
  let diceRoll = new DiceRoll(`{4d4,4d4,4d4,4d4,4d4,4d4}`);
  let embed = new MessageEmbed();

  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: 'Rolls 4d4 for each Ability Score'});

  return embed;
}

// 5d4
export function rollDarkSunPlus(){
  let diceRoll = new DiceRoll(`{5d4,5d4,5d4,5d4,5d4,5d4}`);
  let embed = new MessageEmbed();

  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: 'Rolls 5d4 for each Ability Score'});

  return embed;
}

// Down the Line (3d6)
// Rolls stats in order instead of picking which stat for which
export function rollDownTheLine(){
  let diceRoll = new DiceRoll(`{3d6,3d6,3d6,3d6,3d6,3d6}`);
  let embed = new MessageEmbed();

  //@ts-expect-error
  diceRoll.rolls[0].results.forEach((roll: any, index: number)=>{
    let currentSet = roll.results[0];
    let rollArray: (number | string)[] = [];
    currentSet.rolls.forEach((currentRoll: RollResult)=>{
      rollArray.push(currentRoll.value);
    });
    embed.addField(`__${dtlNames[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${getMod(currentSet.value)}**__`,true);
  });

  embed.addField(`__**Stat Check**__`, `Check Value: __**${diceRoll.total}**__`);
  embed.setFooter({text: 'Instead of picking where each Ability Score you roll goes, you roll 3d6 for each Ability and you cannot swap them around'})

  return embed;
}

// 24d6dl6 pool
export function rollMunchkin(){
  let dice = new DiceRoll(`24d6dl6`).roll()[0].rolls;
  let embed = new MessageEmbed();
  let resultArray = [];
  let embedString = '';

  dice.forEach(currentDie => {
    resultArray.push(currentDie.value)
  });
  let resultArrayCopy = JSON.parse(JSON.stringify(resultArray));

  //"drop" lowest 6
  for(let i = 0; i < 6; i++){
    let lowest = Math.min(...resultArrayCopy);
    resultArray[resultArray.indexOf(lowest)] = `~~${lowest}~~`
    resultArrayCopy[resultArrayCopy.indexOf(lowest)] = 999; // some number that cannot naturally be the highest
  }

  for(let i = 0; i < 24;){
    embedString+=`[ ${resultArray[i++]}, ${resultArray[i++]}, ${resultArray[i++]}, ${resultArray[i++]} ]\n`
  }

  embed.addField('Your set of Munchkins:', `${embedString}`);
  embed.setFooter({text: `The Munchkin Method rolls 24d6dl6 and you pick sets of 3 for each of your Ability Scores from the remaining 18 dice!\n\nThe rolls here are broken into groups of 4 for ease of legibility`})
  return embed;  
}

export function getMod(args: string | number) {
  if (parseInt(args.toString()) >= 1 && parseInt(args.toString()) <= 30) {
    return Math.floor((parseInt(args.toString()) - 10) / 2);
  }
  throw 'You did not enter a valid ability score!';
}
import { MessageEmbed } from "discord.js";
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from "slash-create";
import { readFileSync } from "fs";
import { DiceRoll } from "rpg-dice-roller";
import { RollResult } from "rpg-dice-roller/types/results";
const _ = require('underscore');
const stats = require("../modules/statsModule");
const errorMod = require("../modules/error");
// const { hostGuildID } = require('../../config.json');

class RollStatsCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "rollstats",
      description:
        "Roll 4d6 and drop the lowest roll for a new character's statblock",
      options: [{
        type: CommandOptionType.STRING,
        name: "modifier",
        description: "Want a non-default condition for your stats?",
        choices: [
          {
            name: '70 Minimum',
            value: '70'
          },
          {
            name: '6d20',
            value: 'd20'
          },
          {
            name: 'Call of Cthulhu',
            value: 'cth'
          },
          {
            name: 'Pathfinder Classic',
            value: 'classic'
          },
          {
            name: 'Pathfinder Heroic',
            value: 'heroic'
          },
          {
            name: 'Dice Pool',
            value: 'pool'
          },
          {
            name: 'Standard (Default)',
            value: 'standard'
          }
        ].sort((a, b) => (a.name > b.name) ? 1 : -1),
        required: false
      }],
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }
  async run(ctx: CommandContext) {
    try {
      await ctx.defer();
      let intStrings = ["One", "Two", "Three", "Four", "Five", "Six"];

      let statBlock: DiceRoll, embed: MessageEmbed;
      switch (ctx.options.modifier) {
        case "70":
          statBlock = stats.rollStandardMin();
          break;
        case "d20":
          statBlock = stats.rollStats20();
          break;
        case "cth":
          statBlock = stats.rollcth();
          break;
        case "classic":
          statBlock = stats.rollClassic();
          break;
        case "heroic":
          statBlock = stats.rollHeroic();
          break;
        case "pool":
          statBlock = stats.rollDicePool();
          break;
        case "standard":
        default:
          statBlock = stats.rollStandard();
          break;
      }

      embed = new MessageEmbed()
        .setColor("RANDOM")
        .attachFiles([`./images/4d6.png`])
        .setThumbnail(`attachment://4d6.png`);

      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      statBlock.rolls[0].results.forEach((roll: any, index: number) => {
        let currentSet = roll.results[0];
        let rollArray: (number | string)[] = [];
        switch(ctx.options.modifier){
          // Drop Lowest
          case "70":
          case "standard":
          case undefined:
            currentSet.rolls.forEach((currentRoll: RollResult)=>{
              rollArray.push(currentRoll.value);
            });
            let min = Math.min.apply(Math, rollArray);
            rollArray[rollArray.indexOf(min)] = `~~${min}~~`;
            embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${stats.getMod(currentSet.value)}**__`,true);
            break;
          // Keep All (standard Format)
          case "d20":
          case "classic":
            currentSet.rolls.forEach((currentRoll: RollResult)=>{
              rollArray.push(currentRoll.value);
            });
            embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${stats.getMod(currentSet.value)}**__`,true);
            break;
          // Keep All (+6)
          case "heroic":
            currentSet.rolls.forEach((currentRoll: RollResult)=>{
              rollArray.push(currentRoll.value);
            });
            rollArray.push('**6**');
            embed.addField(`__Stat ${intStrings[index]}__`,`**${currentSet.value+6}**\nFrom [ ${rollArray.join(', ')} ]\nModifier: __**${stats.getMod(currentSet.value+6)}**__`,true);
            break;
          // Pool
          case "pool":
            currentSet.rolls.forEach((currentRoll: RollResult)=>{
              rollArray.push(currentRoll.value);
            });
              embed.addField(`Your Dice Pool`,`[ ${rollArray.join(', ')} ]`,true);
            break;
          // Cthulhu
          case "cth":
            let cocNames = ['Strength', 'Constitution', 'Size', 'Dexterity', 'Appearance', 'Intelligence', 'Power', 'Education'];
            rollArray = [];
            currentSet.rolls.forEach((roll: RollResult) => {
              rollArray.push(roll.value);
            });
            if ([2, 5, 7].includes(index)) rollArray.push('**6**');
            embed.addField(`__${cocNames[index]}__`, `**${(currentSet.value) * 5}**\nFrom: [ ${rollArray.join(' + ')} ] * 5`, true);
            break;
        }
      });
      ctx.options.modifier !== 'cth' ? embed.addField(`__**Stat Check**__`, `Check Value: __**${statBlock.total + (ctx.options.modifier==='heroic'?(6*6):0) }**__`) : void (0);

      return {
        embeds: [embed],
        file: {
          name: `4d6.png`,
          file: readFileSync(`./images/4d6.png`)
        }
      };
    } catch (err) {
      await ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        file: {
          name: `error.png`,
          file: readFileSync(`./images/error.png`)
        }
      });
    } finally {
    }
  }
  async onError(err: any, ctx: CommandContext) {
    await ctx.send(`An error occurred! Here is the message: \`${err}\``);
  }
}
module.exports = RollStatsCommand;

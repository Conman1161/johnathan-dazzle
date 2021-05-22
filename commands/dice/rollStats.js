const { MessageEmbed } = require("discord.js");
const stats = require("../modules/statsModule");
const errorMod = require("../modules/error");
const { SlashCommand, CommandOptionType } = require("slash-create");
const { readFileSync } = require("fs");
// const { hostGuildID } = require('../../config.json');

class RollStatsCommand extends SlashCommand {
  constructor(client) {
    super(client, {
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
          }
        ].sort((a, b) => (a.name > b.name) ? 1 : -1),
        required: false
      }],
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }
  async run(ctx) {
    await ctx.defer();
    let intStrings = ["One", "Two", "Three", "Four", "Five", "Six"];

    let statBlock, embed;

    try {
      switch (ctx.options.modifier) {
        case "70":
          statBlock = stats.rollStats("70");
          break;
        case "d20":
          statBlock = stats.rollStats20();
          break;
        case "cth":
          statBlock = stats.rollcth();
          break;
        default:
          statBlock = stats.rollStats();
          break;
      }

      embed = new MessageEmbed()
        .setColor("RANDOM")
        .attachFiles([`./images/4d6.png`])
        .setThumbnail(`attachment://4d6.png`);

      if (ctx.guildID) {
        embed.setAuthor(`${ctx.data.member.nick || ctx.data.member.user.username}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.data.user.username}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      if (ctx.options.modifier != "cth") {
        statBlock.rolls[0].results.forEach((currentRaw, index) => {
          let rolls = currentRaw.results[0].rolls;
          let rollArray = [];
          rolls.forEach(result => {
            rollArray.push(result.value);
          });
          embed.addField(
            `__Stat ${intStrings[index]}__`,
            `**${currentRaw.value}**\nFrom [ ${rollArray.join(', ').replace(Math.min.apply(Math, rollArray), `${ctx.options.modifier == 'd20' ? '' : '~~'}${Math.min.apply(Math, rollArray)}${ctx.options.modifier == 'd20' ? '' : '~~'}`)} ]\nModifier: __**${stats.getMod(currentRaw.value)}**__`,
            true
          );
        });
        embed.addField(
          `__Stat Check__`,
          `Check Value: __**${statBlock.total}**__`
        );

      } else {
        let cocNames = ['Strength', 'Constitution', 'Size', 'Dexterity', 'Appearance', 'Intelligence', 'Power', 'Education'];
        cocNames.forEach((statName, index) => {
          let rollArr = [];
          statBlock[index].rolls[0].rolls.forEach(roll => {
            rollArr.push(roll.value);
          });
          if ([2, 5, 7].includes(index)) rollArr.push('**6**');
          embed.addField(`__${statName}__`, `**${(statBlock[index].total) * 5}**\nFrom: [ ${rollArr.join(' + ')} ] * 5`, true);
        });
      }

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
  async onError(err, ctx) {
    await ctx.send(`An error occurred! Here is the message: \`${err}\``);
  }
}
module.exports = RollStatsCommand;

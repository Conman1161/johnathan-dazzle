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
        let totalSum = 0;
        for (let i = 0; i < statBlock.diceRaw.length; i++) {
          let currentStat = statBlock.diceRaw[i];
          let currentSum = statBlock.diceSums[i] - (ctx.options.modifier == "d20" ? 0 : Math.min.apply(Math, currentStat));
          totalSum += currentSum;
          embed.addField(
            `__Stat ${intStrings[i]}__`,
            `**${currentSum}**\nFrom [ ${currentStat.join(', ').replace(Math.min.apply(Math, currentStat), `${ctx.options.modifier == 'd20' ? '' : '~~'}${Math.min.apply(Math, currentStat)}${ctx.options.modifier == 'd20' ? '' : '~~'}`)} ]\nModifier: __**${stats.getMod(currentSum)}**__`,
            true
          );
        }
        embed.addField(
          `__Stat Check__`,
          `Check Value: __**${totalSum}**__`
        );

      } else {
        embed.addField('__Strength__', `**${(statBlock[0].roll) * 5}**\nFrom: [${statBlock[0].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Constitution__', `**${(statBlock[1].roll) * 5}**\nFrom: [${statBlock[1].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Size__', `**${(statBlock[2].roll + 6) * 5}**\nFrom: [${statBlock[2].diceRaw[0].join(' + ')} + **6**] * 5`, true);
        embed.addField('__Dexterity__', `**${(statBlock[3].roll) * 5}**\nFrom: [${statBlock[3].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Appearance__', `**${(statBlock[4].roll) * 5}**\nFrom: [${statBlock[4].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Intelligence__', `**${(statBlock[5].roll + 6) * 5}**\nFrom: [${statBlock[5].diceRaw[0].join(' + ')} + **6**] * 5`, true);
        embed.addField('__Power__', `**${(statBlock[6].roll) * 5}**\nFrom: [${statBlock[6].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Education__', `**${(statBlock[7].roll + 6) * 5}**\nFrom: [${statBlock[7].diceRaw[0].join(' + ')} + **6**] * 5`, true);
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

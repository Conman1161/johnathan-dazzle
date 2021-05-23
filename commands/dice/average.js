const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed } = require("discord.js");
const errorMod = require("../modules/error");
const { readFileSync } = require('fs');
const { DiceRoll } = require('rpg-dice-roller');
// const { hostGuildID } = require('../../config.json');

class AvgCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      name: "average",
      description: "Posts the average of dice given. Can take complex rolls (i.e. 2d20+1d6)",
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'What dice expression do you need the average of? Accepts the XdY+Z dice format',
        required: true
      }],
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    try {
      await ctx.defer();
      if (ctx.options.dice.charAt(0) == "-") throw 1;

      let allDice = new DiceRoll(ctx.options.dice);

      let embed = new MessageEmbed()
        .attachFiles([`./images/d20s/non-transp/d20.png`])
        .setThumbnail(`attachment://d20.png`)
        .addField(`__Average of ${allDice.notation}__`, `**${allDice.averageTotal}**`)
        .setColor("RANDOM");
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Die Average`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Die Averages`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      return {
        embeds: [embed],
        file: {
          name: `d20.png`,
          file: readFileSync(`./images/d20s/non-transp/d20.png`)
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

module.exports = AvgCommand;

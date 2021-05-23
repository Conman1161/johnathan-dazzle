const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed } = require("discord.js");
const errorMod = require("../modules/error");
const { DiceRoll } = require('rpg-dice-roller');
const { readFileSync } = require('fs');
// const { hostGuildID } = require('../../config.json');

class MaxCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      name: "max",
      description: "Find the largest possible result from a given die argument",
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'What dice expression do you need the maximum of? Accepts the XdY+Z dice format',
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
      do {
        ctx.options.dice = ctx.options.dice.replace(" ", "");
      } while (ctx.options.dice.includes(" "));

      let diceExpression = new DiceRoll(ctx.options.dice);

      let embed = new MessageEmbed()
        .attachFiles([`./images/d20s/non-transp/d20.png`])
        .setThumbnail(`attachment://d20.png`)
        .addField(`Maximum of __${diceExpression.notation}__:`, `__**${diceExpression.maxTotal}**__`)
        .setColor("RANDOM");
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Die Maximums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Die Maximums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
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

module.exports = MaxCommand;

import { MessageEmbed } from "discord.js";
import { DiceRoll } from 'rpg-dice-roller';
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from "slash-create";
import { readFileSync } from "fs";
import { errorMessage } from '../modules/error'

class MinCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      description: "Find the lowest possible result from a given die argument",
      name: "min",
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'What dice expression do you need the minimum of? Accepts the XdY+Z dice format',
        required: true
      }],
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    try {
      await ctx.defer();
      if (ctx.options.dice.toString().charAt(0) == "-") throw 1;
      do {
        ctx.options.dice = ctx.options.dice.toString().replace(" ", "");
      } while (ctx.options.dice.includes(" "));

      let diceExpression = new DiceRoll(ctx.options.dice);

      let embed = new MessageEmbed()
        .setThumbnail(`attachment://d20.png`)
        .addField(`Minimum of ${diceExpression.notation}`, `__**${diceExpression.minTotal}**__`)
        .setColor("RANDOM");
      if (ctx.member) {
        embed.setAuthor(`${ctx.member.displayName}'s Die Minimums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Die Minimums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      await ctx.send( {
        embeds: [embed.toJSON()],
        file: {
          name: `d20.png`,
          file: readFileSync(`./images/d20s/non-transp/d20.png`)
        }
      });
    } catch (err: any) {
      await ctx.send({
        embeds: [errorMessage(err).toJSON()],
        file: {
          name: `error.png`,
          file: readFileSync(`./images/error.png`)
        }
      });
    }
  }

  async onError(err :any, ctx: CommandContext) {
    await ctx.send(`An error occurred! Here is the message: \`${err}\``);
  }
}

module.exports = MinCommand;

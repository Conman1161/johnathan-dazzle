import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { MessageEmbed } from "discord.js";
import { DiceRoll } from 'rpg-dice-roller';
import { readFileSync } from 'fs';
import { errorMessage} from '../modules/error';

class MaxCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
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
        .addField(`Maximum of __${diceExpression.notation}__:`, `__**${diceExpression.maxTotal}**__`)
        .setColor("RANDOM");
      if (ctx.member) {
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
    } catch (err: any) {
      await ctx.send({
        embeds: [errorMessage(err).toJSON()],
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

module.exports = MaxCommand;

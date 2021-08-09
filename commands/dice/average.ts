import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { MessageEmbed } from "discord.js";
import { readFileSync } from 'fs';
import { DiceRoll } from 'rpg-dice-roller';
import { errorMessage } from '../modules/error'

class AvgCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
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

  async run(ctx: CommandContext) {
    try {
      await ctx.defer();
      if (ctx.options.dice.toString().charAt(0) == "-") throw 1;

      let allDice = new DiceRoll(ctx.options.dice.toString());

      let embed = new MessageEmbed()
        .setThumbnail(`attachment://d20.png`)
        .addField(`__Average of ${allDice.notation}__`, `**${allDice.averageTotal}**`)
        .setColor("RANDOM");
      if (ctx.member) {
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

module.exports = AvgCommand;

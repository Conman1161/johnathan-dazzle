import { MessageEmbed } from "discord.js";
import { DiceRoll } from 'rpg-dice-roller';
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { readFileSync } from "fs";
const errorMod = require("../modules/error-slash");
// const { hostGuildID } = require('../../config.json');

const attachPath = `${process.cwd()}/images/d20s/non-transp/`;

class RollCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'roll',
      description: 'Roll some dice',
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'See https://greenimp.github.io/rpg-dice-roller/guide/notation/ for supported notations',
        required: false
      }],
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    try {
      await ctx.defer();
      let dice = new DiceRoll(ctx.options.dice.toString() || "d20");

      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .attachFiles([`${attachPath}${dice.total < 21 && dice.total > 0 ? `d20-${dice.total}.png` : `d20.png`}`])
        .addField(`Evaluation:`, dice.output)
        .setThumbnail(`attachment://d20${dice.total <= 20 && dice.total >= 1 ? `-${dice.total}.png` : `.png`}`)
        .setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like`);

      //https://cdn.discordapp.com/avatars/{USERID}/{TOKENID}.png
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      embed.addField(
        `__Dice total__:`,
        `You rolled **${dice.total}**`
      );

      return {
        embeds: [embed],
        file: {
          name: `d20${dice.total <= 20 && dice.total >= 1 ? `-${dice.total}.png` : `.png`}`,
          file: readFileSync(`${attachPath}${dice.total < 21 && dice.total > 0 ? `d20-${dice.total}.png` : `d20.png`}`)
        }
      };
    } catch (err) {
      ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        file: {
          name: 'error.png',
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

module.exports = RollCommand;

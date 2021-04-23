const { MessageAttachment, MessageEmbed } = require("discord.js");
const dice = require("dice-expression-evaluator");
const fs = require('fs');
const errorMod = require("../modules/error-slash");
const attachPath = `${process.cwd()}/images/d20s/non-transp/`;

const { SlashCommand, CommandOptionType } = require('slash-create');

class RollCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'roll',
      description: 'Roll some dice. Use the XdY+Z format',
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'What dice are you rolling? Accepts the XdY+Z dice format.',
        required: false
      }]
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    try {
      await ctx.defer();
      let args = ctx.options.dice || "d20";
      if (args < 1 || args == "" || parseInt(args) > Number.MAX_SAFE_INTEGER) {
        throw 1;
      }
      const diceObj = new dice(args);

      for (let i = 0; i < diceObj.dice.length; i++) {
        if (diceObj.dice[i].diceCount >= 1000000) throw 20;
      }

      const diceRoll = diceObj.roll();
      if (diceRoll.roll.length > 1023) {
        throw 9;
      }
      const attachment = new MessageAttachment(`${attachPath}${diceRoll.roll < 21 && diceRoll.roll > 0 ? `d20-${diceRoll.roll}.png` : `d20.png`}`);

      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .attachFiles([attachment])
        .setThumbnail(`attachment://d20${diceRoll.roll <= 20 && diceRoll.roll >= 1 ? `-${diceRoll.roll}.png` : `.png`}`);

      //https://cdn.discordapp.com/avatars/{USERID}/{TOKENID}.png
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.data.member.nick || ctx.data.member.user.username}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.data.user.username}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      for (let i = 0; i < diceRoll.diceSums.length; i++) {
        let currentRaw = diceRoll.diceRaw[i];
        let rawString = currentRaw.join(', ');
        let currentSum = diceRoll.diceSums[i];
        let currentDice = diceObj.dice[i];

        if (
          `You rolled **${diceRoll.roll}**[ ${rawString} ]\n`.length > 1023 ||
          `__${currentDice.coefficient * currentDice.diceCount}d${currentDice.sideCount}__ Result:`.length > 1023) {
          throw 9;
        }

        if (diceObj.dice[i].constructor.name == "Dice") {
          embed.addField(
            `Result of __${currentDice.coefficient * currentDice.diceCount}d${currentDice.sideCount}__:`,
            `You rolled **${currentSum}**\n[ ${rawString} ]`,
            true
          );
        } else if (diceObj.dice[i].constructor.name == "ConstantDie") {
          embed.addField(
            `Constant __${currentSum}__:`,
            `You rolled **${currentSum}**\n[ ${rawString} ]`,
            true
          );
        }

      }
      if (diceRoll.diceSums.length > 1) {
        embed.addField(
          `__Dice total__:`,
          `You rolled **${diceRoll.roll}**`
        );
      }

      return {
        embeds: [embed],
        file: {
          name: `d20${diceRoll.roll <= 20 && diceRoll.roll >= 1 ? `-${diceRoll.roll}.png` : `.png`}`,
          file: fs.readFileSync(attachment.attachment)
        }
      };
    } catch (err) {
      ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        filePath: attachment
      });
    } finally {
      //message.channel.stopTyping();
    }
  }

  async onError(err, ctx) {
    ctx.send(`An error occurred! Here is the message: \`${err}\``);
  }
}

module.exports = RollCommand;

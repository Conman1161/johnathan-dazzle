const { MessageEmbed } = require("discord.js");
const dice = require("dice-expression-evaluator");
const errorMod = require("../modules/error-slash");
const attachPath = `${process.cwd()}/images/d20s/non-transp/`;
const { SlashCommand, CommandOptionType } = require('slash-create');
const { readFileSync } = require("fs");
// const { hostGuildID } = require('../../config.json');

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
      }],
      // guildIDs: [hostGuildID]
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

      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .attachFiles([`${attachPath}${diceRoll.roll < 21 && diceRoll.roll > 0 ? `d20-${diceRoll.roll}.png` : `d20.png`}`])
        .setThumbnail(`attachment://d20${diceRoll.roll <= 20 && diceRoll.roll >= 1 ? `-${diceRoll.roll}.png` : `.png`}`);

      //https://cdn.discordapp.com/avatars/{USERID}/{TOKENID}.png
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.data.member.nick || ctx.data.member.user.username}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.data.user.username}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      diceRoll.diceRaw.forEach((currentRaw, index) => {
        let rawString = currentRaw.join(', ');
        let currentSum = diceRoll.diceSums[index];
        let currentDice = diceObj.dice[index];

        if (
          `You rolled **${diceRoll.roll}**[ ${rawString} ]\n`.length > 1023 ||
          `__${currentDice.coefficient * currentDice.diceCount}d${currentDice.sideCount}__ Result:`.length > 1023) {
          throw 9;
        }

        if (currentDice.constructor.name == "Dice") {
          embed.addField(
            `Result of __${currentDice.coefficient * currentDice.diceCount}d${currentDice.sideCount}__:`,
            `You rolled **${currentSum}**\n[ ${rawString} ]`,
            true
          );
        } else if (currentDice.constructor.name == "ConstantDie") {
          embed.addField(
            `Constant __${currentSum}__:`,
            `You rolled **${currentSum}**\n[ ${rawString} ]`,
            true
          );
        }
      });

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
          file: readFileSync(`${attachPath}${diceRoll.roll < 21 && diceRoll.roll > 0 ? `d20-${diceRoll.roll}.png` : `d20.png`}`)
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

  async onError(err, ctx) {
    await ctx.send(`An error occurred! Here is the message: \`${err}\``);
  }
}

module.exports = RollCommand;

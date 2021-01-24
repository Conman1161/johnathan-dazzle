const commando = require("discord.js-commando");
const discord = require("discord.js");
const dice = require("dice-expression-evaluator");
const errorMod = require("../modules/error");
const attachPath = `${process.cwd()}/images/d20s/non-transp/`;

class RollCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: ["r"],
      description: "Roll some dice. Capable of rolling complex dice arguments. The largest total roll allowed is 1,000,000 due to memory constraints",
      examples: ["!roll", "!r d20", "!r 4d6", "!r d20+d4"].sort(),
      format: "{Dice Arguments}",
      group: "dice",
      memberName: "roll",
      name: "roll",
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    args = args.toLowerCase();
    args = args == "" ? "d20" : args;

    try {
      if (args < 1 || args == "" || parseInt(args) > Number.MAX_SAFE_INTEGER) {
        throw 1;
      }
      const diceObj = new dice(args);

      for (var i = 0; i < diceObj.dice.length; i++) {
        if (diceObj.dice[i].diceCount >= 1000000) throw 20;
      }

      const diceRoll = diceObj.roll();
      if (diceRoll.roll.length > 1023) {
        throw 9;
      }
      const attachment = new discord.MessageAttachment(`${attachPath}${diceRoll.roll < 21 && diceRoll.roll > 0 ? `d20-${diceRoll.roll}.png` : `d20.png`}`);

      var embed = new discord.MessageEmbed()
        .setColor("RANDOM")
        .attachFiles([attachment])
        .setThumbnail(`attachment://d20${diceRoll.roll < 21 && diceRoll.roll > 0 ? `-${diceRoll.roll}.png` : `.png`}`);

      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Die Roll`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Die Roll`, message.author.displayAvatarURL({ dynamic: true }));
      }

      for (var i = 0; i < diceRoll.diceSums.length; i++) {
        var currentRaw = diceRoll.diceRaw[i];
        var rawString = currentRaw.join(', ');
        var currentSum = diceRoll.diceSums[i];
        var currentDice = diceObj.dice[i];

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
      message.channel.send(embed);
    } catch (err) {
      message.channel.send(errorMod.errorMessage(err, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = RollCommand;

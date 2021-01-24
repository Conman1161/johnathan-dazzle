const commando = require("discord.js-commando");
const discord = require("discord.js");
const errorMod = require("../modules/error");
const dice = require("dice-expression-evaluator");
const { version } = require("../../package.json");
const attachment = new discord.MessageAttachment(
  "./images/d20s/non-transp/d20.png",
  "d20.png"
);

class MinCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description: "Find the lowest possible result from a given die argument. Can take complex die arguments (i.e. 2d20+1d6+3...)",
      examples: ["!min d20", "!min 2d6-d4", "!min d20-3+d4"].sort(),
      format: "{dice argument(s)...}",
      group: "dice",
      memberName: "min",
      name: "min",
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    try {
      if (args == "") throw 16; else if (args.charAt(0) == "-") throw 1;
      do {
        args = args.replace(" ", "");
      } while (args.includes(" "));

      var allDice = new dice(args);

      var embed = new discord.MessageEmbed()
        .setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Die Minimums`, message.author.displayAvatarURL({ dynamic: true }))
        .attachFiles([attachment])
        .setThumbnail("attachment://d20.png")
        .setColor("RANDOM");
      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Die Minimums`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Die Minimums`, message.author.displayAvatarURL({ dynamic: true }));
      }

      var finalString = [];
      for (let i = 0; i < allDice.dice.length; i++) {
        const currentDie = allDice.dice[i];
        switch (currentDie.constructor.name) {
          case "Dice":
            finalString.push(`${currentDie.min()}`);
            embed.addField(
              `__${currentDie.coefficient * currentDie.diceCount}d${currentDie.sideCount} Min:__`,
              `**${currentDie.min()}**`,
              true
            );
            break;
          case "ConstantDie":
            finalString.push(currentDie.value);
            embed.addField(
              `__Constant ${currentDie.value}:__`,
              `**${currentDie.value}**`,
              true
            );
            break;
        }
      }

      finalString = finalString.toString();
      while (finalString.includes("\"")) {
        finalString.replace("\"", '');
      }

      do {
        finalString = finalString.replace(",-", " - ").replace(",", " + ");
      } while (finalString.includes(","));

      embed.addField(
        `__Minimum of ${args}__:`,
        `${finalString} = __**${allDice.min()}**__`
      );

      message.channel.send(embed);
    } catch (error) {
      message.channel.send(errorMod.errorMessage(error, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = MinCommand;

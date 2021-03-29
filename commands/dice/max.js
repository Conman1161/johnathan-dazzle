const commando = require("discord.js-commando");
const discord = require("discord.js");
const errorMod = require("../modules/error");
const dice = require("dice-expression-evaluator");
const { version } = require("../../package.json");
const attachment = new discord.MessageAttachment(
  "./images/d20s/non-transp/d20.png",
  "d20.png"
);

class MaxCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description: "Find the largest possible result from a given die argument. Can take complex die arguments (i.e. 2d20+1d6+3...)",
      examples: ["!max d20", "!max 2d6-d4", "!max d20-3+d4"].sort(),
      format: "{dice argument(s)...}",
      group: "dice",
      memberName: "max",
      name: "max",
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    try {
      if (args == "") throw 18; else if (args.charAt(0) == "-") throw 1;
      do {
        args = args.replace(" ", "");
      } while (args.includes(" "));

      var allDice = new dice(args);

      var embed = new discord.MessageEmbed()
        .attachFiles([attachment])
        .setThumbnail("attachment://d20.png")
        .setColor("RANDOM");
      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Die Maximums`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Die Maximums`, message.author.displayAvatarURL({ dynamic: true }));
      }

      var finalString = [];
      for (let i = 0; i < allDice.dice.length; i++) {
        const currentDie = allDice.dice[i];
        switch (currentDie.constructor.name) {
          case "Dice":
            finalString.push(`${currentDie.max()}`);
            embed.addField(
              `__${currentDie.coefficient * currentDie.diceCount}d${currentDie.sideCount} Max:__`,
              `**${currentDie.max()}**`,
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
      do {
        finalString.replace("\"", '');
      } while (finalString.includes("\""));

      do {
        finalString = finalString.replace(",-", " - ").replace(",", " + ");
      } while (finalString.includes(","));

      embed.addField(
        `Maximum of __${args}__:`,
        `${finalString} = __**${allDice.max()}**__`
      );

      message.channel.send(embed);
    } catch (error) {
      message.channel.send(errorMod.errorMessage(error, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}

// module.exports = MaxCommand;

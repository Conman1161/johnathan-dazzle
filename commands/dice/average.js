const commando = require("discord.js-commando");
const discord = require("discord.js");
const errorMod = require("../modules/error");
const dice = require("dice-expression-evaluator");
const attachment = new discord.MessageAttachment(
  "./images/d20s/non-transp/d20.png",
  "d20.png"
);

class MinCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: ["avg"],
      description: "Posts the average of dice given. Can take complex rolls (i.e. 2d20+1d6)",
      examples: ["!average 2d6", "!avg 2d20+5d6+9"].sort(),
      format: "{dice argument(s)...}",
      group: "dice",
      memberName: "average",
      name: "average",
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    try {
      if (args == "") throw 14; else if (args.charAt(0) == "-") throw 1;
      do {
        args = args.replace(" ", "");
      } while (args.includes(" "));

      var allDice = new dice(args);

      var embed = new discord.MessageEmbed()
        .attachFiles([attachment])
        .setThumbnail("attachment://d20.png")
        .setColor("RANDOM");
      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Die Average`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Die Averages`, message.author.displayAvatarURL({ dynamic: true }));
      }


      var finalString = [];
      for (let i = 0; i < allDice.dice.length; i++) {
        const currentDie = allDice.dice[i];
        switch (currentDie.constructor.name) {
          case "Dice":
            const average = `${(currentDie.sideCount % 2 == 0 ? (currentDie.sideCount / 2 + (currentDie.sideCount / 2 + 1)) / 2 : currentDie.sideCount / currentDie.diceCount) * currentDie.diceCount}`;
            finalString.push(currentDie.coefficient * average);
            embed.addField(
              `__${currentDie.coefficient * currentDie.diceCount}d${currentDie.sideCount} Average:__`,
              `**${currentDie.coefficient * average}**`,
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

      var finalSum = finalString.reduce((a, b) => parseFloat(a) + parseFloat(b));
      finalString = finalString.toString();
      do {
        finalString = finalString.replace(",-", " - ").replace(",", " + ");
      } while (finalString.includes(","));

      if (allDice.dice.length > 1) {
        embed.addField(
          `__Sum of Averages__:`,
          `${finalString} = __**${finalSum}**__`
        );
      }


      message.channel.send(embed);
    } catch (error) {
      message.channel.send(errorMod.errorMessage(error, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}

// module.exports = MinCommand;

const commando = require("discord.js-commando");
const discord = require("discord.js");
const dice = require("dice-expression-evaluator");
const errorMod = require("../modules/error");
const attachment = new discord.MessageAttachment(
  "./images/2d20.png",
  "2d20.png)"
); //attaches d20 pic

class AdvRollCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description:
        "Rolls for (dis)advantage. The default roll is 2d20, but you can give an argument to roll 2 of the given die along with a modifier (d**X** +/- **Y**).",
      examples: ["!rolladv", "!rolladv d6", "!rolladv d20+2"].sort(),
      format: "{die} (+/-) {modifier}",
      group: "dice",
      memberName: "rolladv",
      name: "rolladv",
    });
  }

  async run(message, args) {
    message.channel.startTyping();

    try {
      if (args == '') args = 'd20';
      var diceExpr = new dice(`${args}`);
      if (diceExpr.dice[0].diceCount > 1) throw 10;
      if (diceExpr.dice.length > 2) throw 10;

      const dieOne = diceExpr.dice[0].roll().roll;
      const dieTwo = diceExpr.dice[0].roll().roll;
      const modifier = diceExpr.dice[1] != undefined ? diceExpr.dice[1].constructor.name == "ConstantDie" ? diceExpr.dice[1].value : diceExpr.dice[1].diceCount == 1 ? diceExpr.dice[1].roll().roll : (function () { throw 10; }()) : 0;

      var embed = new discord.MessageEmbed()
        .setColor("RANDOM")
        .attachFiles([attachment])
        .setThumbnail("attachment://2d20.png");

      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Advantage Rolls`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Advantage Rolls`, message.author.displayAvatarURL({ dynamic: true }));
      }

      embed.addField(
        `Die One:`,
        `Result: __**${dieOne + modifier}**__
        ${modifier != 0 ? `From: ${dieOne} ${modifier > 0 ? '+' : modifier < 0 ? '-' : ''}${modifier != 0 ? ` ${modifier}` : ''}` : ''}`,
        true
      );
      embed.addField(
        `Die Two:`,
        `Result: __**${dieTwo + modifier}**__
        ${modifier != 0 ? `From: ${dieTwo} ${modifier > 0 ? '+' : modifier < 0 ? '-' : ''}${modifier != 0 ? ` ${modifier}` : ''}` : ''}`,
        true
      );
      message.channel.send(embed);
    } catch (err) {
      message.channel.send(errorMod.errorMessage(err, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = AdvRollCommand;

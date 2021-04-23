const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed, MessageAttachment } = require("discord.js");
const errorMod = require("../modules/error");
const dice = require("dice-expression-evaluator");
const { readFileSync } = require('fs');
const attachment = new MessageAttachment(
  "./images/d20s/non-transp/d20.png",
  "d20.png"
);

class AvgCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      name: "average",
      description: "Posts the average of dice given. Can take complex rolls (i.e. 2d20+1d6)",
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'What dice expression do you need the average of? Accepts the XdY+Z dice format',
        required: true
      }]
    });
  }

  async run(ctx) {
    try {
      await ctx.defer();
      if (ctx.options.dice.charAt(0) == "-") throw 1;
      do {
        ctx.options.dice = ctx.options.dice.replace(" ", "");
      } while (ctx.options.dice.includes(" "));

      let allDice = new dice(ctx.options.dice);

      let embed = new MessageEmbed()
        .attachFiles([attachment])
        .setThumbnail("attachment://d20.png")
        .setColor("RANDOM");
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Die Average`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Die Averages`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      let finalString = [];
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

      let finalSum = finalString.reduce((a, b) => parseFloat(a) + parseFloat(b));
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

      ctx.send({
        embeds: [embed],
        file: {
          name: `d20.png`,
          file: readFileSync(attachment.attachment)
        }
      });
    } catch (err) {
      ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        file: {
          name: `error.png`,
          file: readFileSync(`./images/error.png`)
        }
      });
    } finally {
      // message.channel.stopTyping();
    }
  }

  async onError(err, ctx) {
    ctx.send(`An error occurred! Here is the message: \`${err}\``);
  }
}

module.exports = AvgCommand;

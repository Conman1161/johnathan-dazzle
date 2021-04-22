const discord = require("discord.js");
const errorMod = require("../modules/error");
const dice = require("dice-expression-evaluator");
const { SlashCommand, CommandOptionType } = require("slash-create");
const { readFileSync } = require("fs");
const attachment = new discord.MessageAttachment(
  "./images/d20s/non-transp/d20.png",
  "d20.png"
);

class MinCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description: "Find the lowest possible result from a given die argument.",
      name: "min",
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'What dice expression do you need the minimum of? Accepts the XdY+Z dice format',
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

      var allDice = new dice(ctx.options.dice);

      var embed = new discord.MessageEmbed()
        .attachFiles([attachment])
        .setThumbnail("attachment://d20.png")
        .setColor("RANDOM");
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Die Minimums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Die Minimums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
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
        `__Minimum of ${ctx.options.dice}__:`,
        `${finalString} = __**${allDice.min()}**__`
      );

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

module.exports = MinCommand;

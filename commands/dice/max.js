const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed } = require("discord.js");
const errorMod = require("../modules/error");
const dice = require("dice-expression-evaluator");
const { readFileSync } = require('fs');

class MaxCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      name: "max",
      description: "Find the largest possible result from a given die argument",
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'What dice expression do you need the maximum of? Accepts the XdY+Z dice format',
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
        .attachFiles([`./images/d20s/non-transp/d20.png`])
        .setThumbnail(`attachment://d20.png`)
        .setColor("RANDOM");
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Die Maximums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Die Maximums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      let finalString = [];
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
        `Maximum of __${ctx.options.dice}__:`,
        `${finalString} = __**${allDice.max()}**__`
      );

      return {
        embeds: [embed],
        file: {
          name: `d20.png`,
          file: readFileSync(`./images/d20s/non-transp/d20.png`)
        }
      };
    } catch (err) {
      await ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        file: {
          name: `error.png`,
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

module.exports = MaxCommand;

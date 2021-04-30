const { MessageEmbed } = require("discord.js");
const errorMod = require("../modules/error");
const { SlashCommand } = require("slash-create");
const { readFileSync } = require("fs");
// const { hostGuildID } = require('../../config.json');

class HelpCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description:
        "See a list of all commands",
      name: "help",
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    try {
      await ctx.defer();
      let lines = [];
      ctx.creator.commands.forEach(element => {
        lines.push(`**${element.commandName}** - \`${element.description}\``);
      });

      let helpEmbed = new MessageEmbed()
        .setAuthor("Help", `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
        .attachFiles(`./images/help.png`)
        .addField(`Command Name - Description`, lines.sort().join('\n'))
        .setColor("#fe00ff")
        .setThumbnail("attachment://help.png");

      return {
        embeds: [helpEmbed],
        file: {
          name: `help.png`,
          file: readFileSync(`./images/help.png`)
        }
      };
    } catch (err) {
      ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        file: {
          name: `error.png`,
          file: readFileSync(`./images/error.png`)
        }
      });
    } finally {
    }
  }
}

module.exports = HelpCommand;

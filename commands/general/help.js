const { MessageAttachment, MessageEmbed } = require("discord.js");
const errorMod = require("../modules/error");
const { SlashCommand } = require("slash-create");
const { readFileSync } = require("fs");
const attachment = new MessageAttachment(
  "./images/help.png",
  "help.png"
);

class HelpCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description:
        "See a list of all commands",
      name: "help"
    });
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
        .attachFiles(attachment)
        .addField(`Command Name - Description`, lines.sort().join('\n'))
        .setColor("#fe00ff")
        .setThumbnail("attachment://help.png");

      ctx.send({
        embeds: [helpEmbed],
        file: {
          name: 'help.png',
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

    }
  }
}

module.exports = HelpCommand;

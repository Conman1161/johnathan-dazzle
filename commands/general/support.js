const { MessageEmbed, MessageAttachment } = require("discord.js");
const { readFileSync } = require("fs");
const { SlashCommand } = require("slash-create");
const { ownerTag } = require('../../config.json');
const attachment = new MessageAttachment(
  "./images/support.png",
  "support.png"
);

class BotInfoCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description: "Support information for Dazzle",
      name: "support",
    });
  }

  async run(ctx) {
    await ctx.defer();
    var embed = new MessageEmbed()
      .setAuthor("Support Information", `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
      .addField(
        "Support Server",
        `The link to the support Discord server can be found [here](https://discord.gg/ZUJAMnh "Click me, I go to the server!")`
      )
      .addField(
        "Need more help?",
        `Contact ${ownerTag} if you have any further questions`
      )
      .setColor("#fe00ff")
      .attachFiles([attachment])
      .setURL("https://discord.gg/ZUJAMnh")
      .setThumbnail("attachment://support.png");

    ctx.send({
      embeds: [embed],
      file: {
        name: 'support.png',
        file: readFileSync(attachment.attachment)
      }
    })
  }
}

module.exports = BotInfoCommand;
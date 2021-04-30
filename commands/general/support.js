const { MessageEmbed } = require("discord.js");
const { readFileSync } = require("fs");
const { SlashCommand } = require("slash-create");
const { ownerTag, /* hostGuildID */ } = require('../../config.json');


class SupportCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description: "Support information for Dazzle",
      name: "support",
      // guildIDs: [hostGuildID]
    });
  }

  async run(ctx) {
    await ctx.defer();
    let embed = new MessageEmbed()
      .setAuthor("Support Information", `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
      .addField(
        "Support Server",
        `The link to the support Discord server can be found [here](https://discord.gg/ZUJAMnh "Click me, I go to the server!")`
      )
      .addField(
        "Need more help?",
        `Contact \`${ownerTag}\` if you have any further questions`
      )
      .setColor("#fe00ff")
      .attachFiles([`./images/support.png`])
      .setURL(`https://discord.gg/ZUJAMnh`)
      .setThumbnail(`attachment://support.png`);

    return {
      embeds: [embed],
      file: {
        name: 'support.png',
        file: readFileSync(`./images/support.png`)
      }
    };
  }
}

module.exports = SupportCommand;
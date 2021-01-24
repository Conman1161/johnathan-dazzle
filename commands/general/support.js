const commando = require("discord.js-commando");
const discord = require("discord.js");
const attachment = new discord.MessageAttachment(
  "./images/support.png",
  "support.png"
);

class BotInfoCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description: "Support information for Dazzle",
      examples: ["!support"].sort(),
      format: "",
      group: "general",
      memberName: "support",
      name: "support",
    });
  }

  async run(message) {
    message.channel.startTyping();
    var embed = new discord.MessageEmbed()
      .setAuthor("Support Information", message.client.user.displayAvatarURL({ dynamic: true }))
      .addField(
        "Support Server",
        `The link to the support Discord server can be found [here](https://discord.gg/ZUJAMnh "Click me, I go to the server!")`
      )
      .addField(
        "Need more help?",
        `Contact ${message.client.owners[0].tag} if you have any further questions`
      )
      .setColor("#fe00ff")
      .attachFiles([attachment])
      .setURL("https://discord.gg/ZUJAMnh")
      .setThumbnail("attachment://support.png");

    message.channel.send(embed);
    message.channel.stopTyping();
  }
}

module.exports = BotInfoCommand;

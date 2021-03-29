const commando = require("discord.js-commando");
const discord = require("discord.js");
const { version } = require("../../package.json");
const attachment = new discord.MessageAttachment(
  "./images/icon.png",
  "icon.png"
);

class BotInfoCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description: "List all the servers that Dazzle is currently in",
      examples: ["!servers"].sort(),
      format: "",
      group: "general",
      memberName: "servers",
      name: "servers",
      ownerOnly: true
    });
  }

  async run(message) {
    message.channel.startTyping();
    var myInfo = new discord.MessageEmbed()
      .setAuthor("Servers:", message.client.user.displayAvatarURL({ dynamic: true }))
      .setColor("#fe00ff")
      .attachFiles([attachment])
      .setThumbnail("attachment://icon.png");

    var servers = message.client.guilds.cache.toJSON();
    var serverString = "";
    servers.forEach(element => {
      if (serverString.length + element.name.length > 1023) {
        myInfo.addField(`Servers`, serverString);
      } else {
        serverString += `${element.name}\n`;
      }
    });
    if (serverString.length != 0) {
      myInfo.addField(`${servers.length} Servers`, serverString);
    }
    message.channel.send(myInfo);
    message.channel.stopTyping();
  }
}

// module.exports = BotInfoCommand;

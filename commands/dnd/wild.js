const commando = require("discord.js-commando");
const discord = require("discord.js");
const wild = require("../modules/wildModule");
const errorMod = require("../modules/error");

const attachment = new discord.MessageAttachment(
  "./images/wild.png",
  "wild.png"
);

class WildCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: ["w"],
      description:
        "Roll on one of the wild magic charts to get a wild magic effect. The default chart is 1.2.",
      examples: ["!wild", "!wild 2.0", "!wild 1.2 2755"].sort(),
      format: "{Chart Name} {Effect Number}",
      group: "dnd",
      memberName: "wild",
      name: "wild",
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    args = args.toLowerCase();

    var argArray = args.trim().split(" ");

    try {
      const embedInfo = wild.getEmbedInfo(argArray[0], argArray[1]);

      var embed = new discord.MessageEmbed()
        .addField("Chart Name: ", `**${embedInfo.name}**`)
        .addField("**Die Roll**", `You rolled **${embedInfo.effectNumber}**`)
        .addField("**Effect**", `**||${embedInfo.text}||**`)
        .attachFiles([attachment])
        .setThumbnail("attachment://wild.png")
        .setFooter(
          `If you think the roll has an error, message ${message.client.owners[0].tag} with the roll number and what the error is.`
        )
        .setColor("RANDOM");

      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Wild Magic ${argArray[1] == undefined ? 'Surge' : 'Lookup'}`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Wild Magic ${argArray[1] == undefined ? 'Surge' : 'Lookup'}`, message.author.displayAvatarURL({ dynamic: true }));
      }
      message.channel.send(embed);
    } catch (err) {
      message.channel.send(errorMod.errorMessage(err, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}
module.exports = WildCommand;

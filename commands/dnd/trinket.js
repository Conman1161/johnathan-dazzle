const commando = require("discord.js-commando");
const discord = require("discord.js");
const trinketMod = require("../modules/trinket");
const errorMod = require("../modules/error");

const attachment = new discord.MessageAttachment("./images/bag.png", "bag.png");

class TrinketCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: ["t"],
      description: `Rolls on a random trinket chart for a random trinket. There are currently __**${trinketMod.getChartCount()}**__ charts.`,
      examples: ["!trinket", `!trinket 1-${trinketMod.getChartCount()}`].sort(),
      format: "{Chart number}",
      group: "dnd",
      memberName: "trinket",
      name: "trinket",
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    //put args in var, see if(!args) to roll for table
    try {
      var trinket = trinketMod.getTrinketInfo(args);
      if (trinket[1] == "") {
        throw 7;
      }
      var embed = new discord.MessageEmbed()
        .addField("**Chart Number:**", `**${trinket[0]}**`)
        .addField("**Trinket**", `**||${trinket[1]}||**`)
        .attachFiles([attachment])
        .setThumbnail("attachment://bag.png")
        .setFooter(
          `If you think anything has an error, message ${message.client.owners[0].tag} with a screenshot and indicate what the error is.`
        )
        .setColor("RANDOM");
      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Trinket`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Trinket`, message.author.displayAvatarURL({ dynamic: true }));
      }

      message.channel.send(embed);
    } catch (err) {
      // Invalid chart
      message.channel.send(errorMod.errorMessage(err, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}

module.exports = TrinketCommand;

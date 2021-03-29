const commando = require("discord.js-commando");
const discord = require("discord.js");
const attachment = new discord.MessageAttachment(
  "./images/lookup.png",
  "lookup.png"
);

class ModifierKeyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description: "A legend for Ability Score Modifiers",
      examples: ["!modifiers"].sort(),
      format: "",
      name: "modifiers",
      group: "dnd",
      memberName: "modifiers",
    });
  }

  async run(message) {
    message.channel.startTyping();
    var modEmbed = new discord.MessageEmbed()
      .setAuthor("Modifier Chart", message.client.user.displayAvatarURL({ dynamic: true }))
      .addField("Format: ", "**Ability Score:** (Modifier)")
      .addField(
        "**Ability Score Modifier**",
        "**1:** (-5)\n**2-3:** (-4)\n**4-5:** (-3)\n**6-7:** (-2)\n**8-9:** (-1)\n**10-11:** (0)\n**12-13:** (+1)\n**14-15:** (+2)\n**16-17:** (+3)\n**18-19:** (+4)\n**20-21:** (+5)\n**22-23:** (+6)\n**24-25:** (+7)\n**26-27:** (+8)\n**28-29:** (+9)\n**30:** (+10)"
      )
      .setColor("RANDOM")
      .attachFiles([attachment])
      .setThumbnail("attachment://lookup.png");

    message.channel.send(modEmbed);
    message.channel.stopTyping();
  }
}

// module.exports = ModifierKeyCommand;

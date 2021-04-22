const discord = require("discord.js");
const { readFileSync } = require("fs");
const { SlashCommand } = require("slash-create");
const attachment = new discord.MessageAttachment(
  "./images/lookup.png",
  "lookup.png"
);

class ModifierKeyCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      name: "modifiers",
      description: "A legend for Ability Score Modifiers"
    });
  }

  async run(ctx) {
    await ctx.defer();
    let modEmbed = new discord.MessageEmbed()
      .addField("Format: ", "**Ability Score:** (Modifier)")
      .addField(
        "**Ability Score Modifier**",
        "**1:** (-5)\n**2-3:** (-4)\n**4-5:** (-3)\n**6-7:** (-2)\n**8-9:** (-1)\n**10-11:** (0)\n**12-13:** (+1)\n**14-15:** (+2)\n**16-17:** (+3)\n**18-19:** (+4)\n**20-21:** (+5)\n**22-23:** (+6)\n**24-25:** (+7)\n**26-27:** (+8)\n**28-29:** (+9)\n**30:** (+10)"
      )
      .setColor("RANDOM")
      .attachFiles([attachment])
      .setThumbnail("attachment://lookup.png");

    ctx.send({
      embeds: [modEmbed],
      file: {
        name: `lookup.png`,
        file: readFileSync(`./images/lookup.png`)
      }
    });
  }
}

module.exports = ModifierKeyCommand;

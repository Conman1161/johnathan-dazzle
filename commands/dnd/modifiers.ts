import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { CommandContext, SlashCommand, SlashCreator } from "slash-create";
// const { hostGuildID } = require('../../config.json');

class ModifierKeyCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "modifiers",
      description: "A legend for Ability Score Modifiers",
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    await ctx.defer();
    let modEmbed = new MessageEmbed()
      .addField("Format: ", "**Ability Score:** (Modifier)")
      .addField(
        "**Ability Score Modifier**",
        "**1:** (-5)\n**2-3:** (-4)\n**4-5:** (-3)\n**6-7:** (-2)\n**8-9:** (-1)\n**10-11:** (0)\n**12-13:** (+1)\n**14-15:** (+2)\n**16-17:** (+3)\n**18-19:** (+4)\n**20-21:** (+5)\n**22-23:** (+6)\n**24-25:** (+7)\n**26-27:** (+8)\n**28-29:** (+9)\n**30:** (+10)"
      )
      .setColor("RANDOM")
      .attachFiles([`./images/lookup.png`])
      .setThumbnail(`attachment://lookup.png`);

    ctx.send({
      embeds: [modEmbed.toJSON()],
      file: {
        name: `lookup.png`,
        file: readFileSync(`./images/lookup.png`)
      }
    });
  }
}

module.exports = ModifierKeyCommand;

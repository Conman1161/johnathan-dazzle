import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

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
    let embed = new MessageEmbed()
      .addField("Format: ", "**Ability Score:** (Modifier)")
      .addField(
        "**Ability Score Modifier**",
        "**1:** (-5)\n**2-3:** (-4)\n**4-5:** (-3)\n**6-7:** (-2)\n**8-9:** (-1)\n**10-11:** (0)\n**12-13:** (+1)\n**14-15:** (+2)\n**16-17:** (+3)\n**18-19:** (+4)\n**20-21:** (+5)\n**22-23:** (+6)\n**24-25:** (+7)\n**26-27:** (+8)\n**28-29:** (+9)\n**30:** (+10)"
      )
      .setColor("RANDOM")
      .setThumbnail(`attachment://lookup.png`);

    await ctx.send({
      embeds: [embed.toJSON()],
      file: {
        name: `lookup.png`,
        file: readFileSync(`./images/lookup.png`)
      }
    });
  }
}

module.exports = ModifierKeyCommand;

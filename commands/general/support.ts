import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { ButtonStyle, CommandContext, ComponentType, SlashCommand, SlashCreator } from "slash-create";
import { ownerTag } from '../../config.json';


class SupportCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      description: "Support information for Dazzle",
      name: "support",
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
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

    await ctx.send( {
      embeds: [embed.toJSON()],
      file: {
        name: 'support.png',
        file: readFileSync(`./images/support.png`)
      },
      components: [{
        type: ComponentType.ACTION_ROW,
        components: [{
          type: ComponentType.BUTTON,
          style: ButtonStyle.LINK,
          label: 'Support Discord Server',
          url: 'https://discord.gg/ZUJAMnh'
        }]
      }]
    });
  }
}

module.exports = SupportCommand;
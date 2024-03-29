import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { ButtonStyle, CommandContext, ComponentType, SlashCommand, SlashCreator } from "slash-create";

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
        "Need specific help?",
        `Join the Discord server below or contact \`${process.env.OWNER_TAG}\` if you have any further questions`
      )
      .setColor("#fe00ff")
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
        },
        {
          type: ComponentType.BUTTON,
          style: ButtonStyle.LINK,
          label: 'Message Conman for Support',
          url: 'discord://-/users/103639985294442496'
        }]
      }]
    });
  }
}

module.exports = SupportCommand;
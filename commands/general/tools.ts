import { MessageEmbed } from "discord.js";
import { ButtonStyle, CommandContext, ComponentType, SlashCommand, SlashCreator } from "slash-create";

class ToolsCommands extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      description: "A panel of tools for the bot process.env.OWNER",
      name: "tools",
      guildIDs: [`${process.env.HOST_GUILD_ID}`]
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    try{
      await ctx.defer(ctx.user.id === process.env.OWNER);
      if (ctx.user.id === process.env.OWNER) {
        let embed = new MessageEmbed()
        .setAuthor(`${process.env.OWNER} Control Panel`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
        .addField(`Panel`,`What do you want to do?`);

        await ctx.send({
          embeds: [embed.toJSON()],
          components: [{
            type: ComponentType.ACTION_ROW,
            components: [{
              type: ComponentType.BUTTON,
              style: ButtonStyle.DESTRUCTIVE,
              label: 'Restart Bot',
              custom_id: 'restart'
            }]
          }]
        });

        ctx.registerComponent('restart', async (btnCtx) => {
          await btnCtx.defer(ctx.user.id === process.env.OWNER);
          await btnCtx.send("Restarting...");
          //pm2 on host machine to auto-restart, this will simply end the bot process otherwise
          process.exit(0);
        });
      } else {
        await ctx.send('`You do not have permission to run this command!`');
      }
    }catch{

    }
  }
}

module.exports = ToolsCommands;

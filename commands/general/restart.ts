import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

import { hostGuildID, owner } from '../../config.json';

class RestartCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      description: "Restart the bot. Only available to the bot owner",
      name: "restart",
      guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    await ctx.defer();
    if (ctx.user.id === owner) {
      await ctx.send("Restarting...");
      //pm2 on host machine to auto-restart, this will simply end the bot process otherwise
      process.exit(0);
    } else {
      await ctx.send('`You do not have permission to run this command!`');
    }
  }
}

module.exports = RestartCommand;

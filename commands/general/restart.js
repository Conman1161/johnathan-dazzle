const { SlashCommand } = require("slash-create");
const { hostGuildID, owner } = require('../../config.json');


class RestartCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description: "Restart the bot. Only available to the bot owner",
      name: "restart",
      guildIDs: [hostGuildID]
    });
  }

  async run(ctx) {
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

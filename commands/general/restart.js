const { SlashCommand } = require("slash-create");

class RestartCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description: "Restart the bot. Only available to the bot owner",
      name: "restart",
    });
  }

  async run(ctx) {
    await ctx.send("Restarting...");
    //pm2 on host machine to auto-restart, this will simply end the bot process otherwise
    process.exit(0);
  }
}

// module.exports = RestartCommand;

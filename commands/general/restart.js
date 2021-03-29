const commando = require("discord.js-commando");

class RestartCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description: "Restart the bot. Only works if bot owner ",
      examples: ["!restart"].sort(),
      format: "",
      group: "general",
      memberName: "restart",
      name: "restart",
      ownerOnly: true,
    });
  }

  async run(message) {
    message.channel.startTyping();
    await message.channel.send("Restarting...");
    //pm2 on host machine to auto-restart, this will simply end the bot process otherwise
    message.channel.stopTyping();
    process.exit(0);
  }
}

// module.exports = RestartCommand;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slash_create_1 = require("slash-create");
const config_json_1 = require("../../config.json");
class RestartCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: "Restart the bot. Only available to the bot owner",
            name: "restart",
            guildIDs: [config_json_1.hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        await ctx.defer();
        if (ctx.user.id === config_json_1.owner) {
            await ctx.send("Restarting...");
            //pm2 on host machine to auto-restart, this will simply end the bot process otherwise
            process.exit(0);
        }
        else {
            await ctx.send('`You do not have permission to run this command!`');
        }
    }
}
module.exports = RestartCommand;

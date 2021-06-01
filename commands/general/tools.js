"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slash_create_1 = require("slash-create");
const config_json_1 = require("../../config.json");
class ToolsCommands extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: "A panel of tools for the bot owner",
            name: "tools",
            guildIDs: [config_json_1.hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer(ctx.user.id === config_json_1.owner);
            if (ctx.user.id === config_json_1.owner) {
                let embed = new discord_js_1.MessageEmbed()
                    .setAuthor(`Owner Control Panel`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
                    .addField(`Panel`, `What do you want to do?`);
                await ctx.send({
                    embeds: [embed.toJSON()],
                    components: [{
                            type: slash_create_1.ComponentType.ACTION_ROW,
                            components: [{
                                    type: slash_create_1.ComponentType.BUTTON,
                                    style: slash_create_1.ButtonStyle.DESTRUCTIVE,
                                    label: 'Restart Bot',
                                    custom_id: 'restart'
                                }]
                        }]
                });
                ctx.registerComponent('restart', async (btnCtx) => {
                    await btnCtx.defer(ctx.user.id === config_json_1.owner);
                    await btnCtx.send("Restarting...");
                    //pm2 on host machine to auto-restart, this will simply end the bot process otherwise
                    process.exit(0);
                });
            }
            else {
                await ctx.send('`You do not have permission to run this command!`');
            }
        }
        catch {
        }
    }
}
module.exports = ToolsCommands;

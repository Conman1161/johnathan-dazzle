"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const slash_create_1 = require("slash-create");
const config_json_1 = require("../../config.json");
class SupportCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: "Support information for Dazzle",
            name: "support",
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        await ctx.defer();
        let embed = new discord_js_1.MessageEmbed()
            .setAuthor("Support Information", `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
            .addField("Support Server", `The link to the support Discord server can be found [here](https://discord.gg/ZUJAMnh "Click me, I go to the server!")`)
            .addField("Need more help?", `Contact \`${config_json_1.ownerTag}\` if you have any further questions`)
            .setColor("#fe00ff")
            .attachFiles([`./images/support.png`])
            .setURL(`https://discord.gg/ZUJAMnh`)
            .setThumbnail(`attachment://support.png`);
        await ctx.send({
            embeds: [embed.toJSON()],
            file: {
                name: 'support.png',
                file: fs_1.readFileSync(`./images/support.png`)
            },
            components: [{
                    type: slash_create_1.ComponentType.ACTION_ROW,
                    components: [{
                            type: slash_create_1.ComponentType.BUTTON,
                            style: slash_create_1.ButtonStyle.LINK,
                            label: 'Support Discord Server',
                            url: 'https://discord.gg/ZUJAMnh'
                        }]
                }]
        });
    }
}
module.exports = SupportCommand;

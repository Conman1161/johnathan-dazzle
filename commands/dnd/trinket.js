"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slash_create_1 = require("slash-create");
const config_json_1 = require("../../config.json");
const fs_1 = require("fs");
const trinketMod = require("../modules/trinket");
const errorMod = require("../modules/error");
class TrinketCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: `Rolls on a random trinket chart for a random trinket. There are currently ${trinketMod.getChartCount()} charts`,
            name: "trinket",
            options: [{
                    type: slash_create_1.CommandOptionType.INTEGER,
                    name: 'chart',
                    description: 'Do you want to use a specific chart?',
                    required: false,
                    choices: [{
                            name: '1',
                            value: 1
                        }, {
                            name: '2',
                            value: 2
                        }, {
                            name: '3',
                            value: 3
                        }, {
                            name: '4',
                            value: 4
                        }, {
                            name: '5',
                            value: 5
                        }, {
                            name: '6',
                            value: 6
                        }, {
                            name: '7',
                            value: 7
                        }, {
                            name: '8',
                            value: 8
                        }, {
                            name: '9',
                            value: 9
                        }, {
                            name: '10',
                            value: 10
                        }, {
                            name: '11',
                            value: 11
                        }, {
                            name: '12',
                            value: 12
                        }]
                }],
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            let trinket = trinketMod.getTrinketInfo(ctx.options.chart);
            if (trinket[1] == "") {
                throw 7;
            }
            let embed = new discord_js_1.MessageEmbed()
                .addField("**Chart Number:**", `**${trinket[0]}**`)
                .addField("**Trinket**", `**||${trinket[1]}||**`)
                .attachFiles([`./images/bag.png`])
                .setThumbnail(`attachment://bag.png`)
                .setFooter(`If you think anything has an error, message ${config_json_1.ownerTag} with a screenshot and indicate what the error is.`)
                .setColor("RANDOM");
            if (ctx.guildID) {
                embed.setAuthor(`${ctx.member.displayName}'s Trinket`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            else {
                embed.setAuthor(`${ctx.user.username}'s Trinket`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            return {
                embeds: [embed],
                file: {
                    name: `bag.png`,
                    file: fs_1.readFileSync(`./images/bag.png`)
                }
            };
        }
        catch (err) {
            await ctx.send({
                embeds: [errorMod.errorMessage(err, ctx)],
                file: {
                    name: `error.png`,
                    file: fs_1.readFileSync(`./images/error.png`)
                }
            });
        }
        finally {
        }
    }
    async onError(err, ctx) {
        await ctx.send(`An error occurred! Here is the message: \`${err}\``);
    }
}
module.exports = TrinketCommand;

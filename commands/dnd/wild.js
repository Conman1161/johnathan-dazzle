"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("../../config.json");
const slash_create_1 = require("slash-create");
const fs_1 = require("fs");
const { getEmbedInfo } = require("../modules/wildModule");
const errorMod = require("../modules/error");
class WildCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: "Roll on one of the wild magic charts to get a wild magic effect. The default chart is 1.2",
            name: "wild",
            options: [{
                    type: slash_create_1.CommandOptionType.SUB_COMMAND,
                    name: 'roll',
                    description: 'Roll on the Wild Magic Surge table!',
                    required: false,
                    options: [{
                            type: slash_create_1.CommandOptionType.STRING,
                            name: 'chart',
                            description: 'Which chart would you like to roll on?',
                            required: false,
                            choices: [{
                                    name: 'Net Libram 1.2 (Default)',
                                    value: '1.2'
                                }, {
                                    name: 'Net Libram 2.0',
                                    value: '2.0'
                                }, {
                                    name: 'D&D 5e',
                                    value: '5e'
                                }].sort((a, b) => (a.name > b.name) ? 1 : -1)
                        }]
                }, {
                    type: slash_create_1.CommandOptionType.SUB_COMMAND,
                    name: 'lookup',
                    description: 'Lookup an effect on one of the Wild Magic Surge tables!',
                    required: false,
                    options: [{
                            type: slash_create_1.CommandOptionType.STRING,
                            name: 'chart',
                            description: 'Which chart do you want to lookup from?',
                            required: true,
                            choices: [{
                                    name: 'Net Libram 1.2',
                                    value: '1.2'
                                }, {
                                    name: 'Net Libram 2.0',
                                    value: '2.0'
                                }, {
                                    name: 'D&D 5e',
                                    value: '5e'
                                }].sort((a, b) => (a.name > b.name) ? 1 : -1)
                        }, {
                            type: slash_create_1.CommandOptionType.INTEGER,
                            name: 'effect_number',
                            description: 'Which effect are you looking up?',
                            required: true
                        }]
                }].sort((a, b) => (a.name > b.name) ? 1 : -1),
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            const embedInfo = getEmbedInfo(Object.keys(ctx.options)[0] === 'roll' ? ctx.options.roll.chart : ctx.options.lookup.chart, Object.keys(ctx.options)[0] === 'lookup' ? ctx.options.lookup.effect_number : null);
            let embed = new discord_js_1.MessageEmbed()
                .addField("Chart Name: ", `**${embedInfo.name}**`)
                .addField("**Die Roll**", `You rolled **${embedInfo.effectNumber}**`)
                .addField("**Effect**", `**||${embedInfo.text}||**`)
                .attachFiles([`./images/wild.png`])
                .setThumbnail(`attachment://wild.png`)
                .setFooter(`If you think the roll has an error, message ${config_json_1.ownerTag} with the roll number and what the error is.`)
                .setColor("RANDOM");
            if (ctx.member) {
                embed.setAuthor(`${ctx.member.displayName}'s Wild Magic ${Object.keys(ctx.options).length < 2 ? 'Surge' : 'Lookup'}`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            else {
                embed.setAuthor(`${ctx.user.username}'s Wild Magic ${Object.keys(ctx.options).length < 2 ? 'Surge' : 'Lookup'}`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            return {
                embeds: [embed],
                file: {
                    name: `wild.png`,
                    file: fs_1.readFileSync(`./images/wild.png`)
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
module.exports = WildCommand;

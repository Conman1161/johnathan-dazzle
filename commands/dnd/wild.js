"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slash_create_1 = require("slash-create");
const fs_1 = require("fs");
const wild_1 = require("../modules/wild");
const error_1 = require("../modules/error");
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
            let embedInfo = (0, wild_1.getEmbedInfo)(Object.keys(ctx.options)[0] === 'roll' ? ctx.options.roll.chart : ctx.options.lookup.chart, Object.keys(ctx.options)[0] === 'lookup' ? ctx.options.lookup.effect_number : null);
            let embed = new discord_js_1.MessageEmbed()
                .addField("Chart Name", `**${embedInfo.name}**`)
                .addField("Die Roll", `You rolled **${embedInfo.effectNumber}**`)
                .addField("Effect", `**||${embedInfo.text}||**`)
                .setThumbnail(`attachment://wild.png`)
                .setFooter(`If you think the roll has an error, message ${process.env.OWNER_ID} with the roll number and what the error is.`)
                .setColor("RANDOM");
            if (ctx.member) {
                embed.setAuthor(`${ctx.member.displayName}'s Wild Magic ${Object.keys(ctx.options).length < 2 ? 'Surge' : 'Lookup'}`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            else {
                embed.setAuthor(`${ctx.user.username}'s Wild Magic ${Object.keys(ctx.options).length < 2 ? 'Surge' : 'Lookup'}`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            await ctx.send({
                embeds: [embed.toJSON()],
                file: {
                    name: `wild.png`,
                    file: (0, fs_1.readFileSync)(`./images/wild.png`)
                },
                components: [{
                        type: slash_create_1.ComponentType.ACTION_ROW,
                        components: [{
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.PRIMARY,
                                label: 'New Effect',
                                custom_id: 'reroll',
                                disabled: typeof ctx.options.lookup === 'object'
                            }]
                    }]
            });
            ctx.registerComponent('reroll', async (btnCtx) => {
                if (ctx.user.id === btnCtx.user.id) {
                    embedInfo = (0, wild_1.getEmbedInfo)(Object.keys(ctx.options)[0] === 'roll' ? ctx.options.roll.chart : ctx.options.lookup.chart, Object.keys(ctx.options)[0] === 'lookup' ? ctx.options.lookup.effect_number : null);
                    embed.spliceFields(0, 3, [
                        {
                            name: `Chart Name`,
                            value: `**${embedInfo.name}**`
                        },
                        {
                            name: `Die Roll`,
                            value: `You rolled **${embedInfo.effectNumber}**`
                        },
                        {
                            name: `Effect`,
                            value: `**||${embedInfo.text}||**`
                        }
                    ]);
                    btnCtx.editParent({
                        embeds: [embed.toJSON()],
                        components: [{
                                type: slash_create_1.ComponentType.ACTION_ROW,
                                components: [{
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'New Effect',
                                        custom_id: 'reroll',
                                        disabled: typeof ctx.options.lookup === 'object'
                                    }]
                            }]
                    });
                }
                else {
                    await btnCtx.defer(true);
                    await btnCtx.send('You did not make this wild magic surge, so you do not have permission to get a new one!');
                }
            });
        }
        catch (err) {
            await ctx.send({
                embeds: [(0, error_1.errorMessage)(err).toJSON()],
                file: {
                    name: `error.png`,
                    file: (0, fs_1.readFileSync)(`./images/error.png`)
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

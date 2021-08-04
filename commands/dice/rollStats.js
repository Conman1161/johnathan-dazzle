"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slash_create_1 = require("slash-create");
const fs_1 = require("fs");
const error_1 = require("../modules/error");
const statsModule_1 = require("../modules/statsModule");
class RollStatsCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "rollstats",
            description: "Roll 4d6 and drop the lowest roll for a new character's statblock",
            options: [{
                    type: slash_create_1.CommandOptionType.STRING,
                    name: "style",
                    description: "Not using 4d6kh3? Pick a different rolling style!",
                    choices: [
                        {
                            name: '70 Minimum',
                            value: '70'
                        },
                        {
                            name: '6d20',
                            value: 'd20'
                        },
                        {
                            name: 'Call of Cthulhu',
                            value: 'cth'
                        },
                        {
                            name: 'Pathfinder Classic',
                            value: 'classic'
                        },
                        {
                            name: 'Pathfinder Heroic',
                            value: 'heroic'
                        },
                        {
                            name: 'Dice Pool',
                            value: 'pool'
                        },
                        {
                            name: '4d6kh3 (Default)',
                            value: 'standard'
                        }
                    ].sort((a, b) => (a.name > b.name) ? 1 : -1),
                    required: false
                }],
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            let embed;
            switch (ctx.options.style) {
                case "70":
                    embed = statsModule_1.rollStandardMin(); // [x]
                    break;
                case "d20":
                    embed = statsModule_1.rollStats20(); // [x]
                    break;
                case "cth":
                    embed = statsModule_1.rollcth(); // [x]
                    break;
                case "classic":
                    embed = statsModule_1.rollClassic(); // [x]
                    break;
                case "heroic":
                    embed = statsModule_1.rollHeroic(); // [x]
                    break;
                case "pool":
                    embed = statsModule_1.rollDicePool(); // [x]
                    break;
                case "standard":
                default:
                    embed = statsModule_1.rollStandard(); // [x]
                    break;
            }
            embed.setColor("RANDOM")
                .attachFiles([`./images/4d6.png`])
                .setThumbnail(`attachment://4d6.png`);
            if (ctx.member) {
                embed.setAuthor(`${ctx.member.displayName}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            else {
                embed.setAuthor(`${ctx.user.username}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            await ctx.send({
                embeds: [embed.toJSON()],
                file: {
                    name: `4d6.png`,
                    file: fs_1.readFileSync(`./images/4d6.png`)
                },
                components: [{
                        type: slash_create_1.ComponentType.ACTION_ROW,
                        components: [{
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.PRIMARY,
                                label: 'Reroll',
                                custom_id: 'reroll'
                            }]
                    }]
            });
            ctx.registerComponent('reroll', async (btnCtx) => {
                if (ctx.user.id === btnCtx.user.id) {
                    // Reroll a stat block according to ctx, then edit embed accordingly
                    switch (ctx.options.style) {
                        case "70":
                            embed = statsModule_1.rollStandardMin();
                            break;
                        case "d20":
                            embed = statsModule_1.rollStats20();
                            break;
                        case "cth":
                            embed = statsModule_1.rollcth();
                            break;
                        case "classic":
                            embed = statsModule_1.rollClassic();
                            break;
                        case "heroic":
                            embed = statsModule_1.rollHeroic();
                            break;
                        case "pool":
                            embed = statsModule_1.rollDicePool();
                            break;
                        case "standard":
                        default:
                            embed = statsModule_1.rollStandard();
                            break;
                    }
                    embed.setColor("RANDOM")
                        .setThumbnail(`attachment://4d6.png`);
                    if (ctx.member) {
                        embed.setAuthor(`${ctx.member.displayName}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    else {
                        embed.setAuthor(`${ctx.user.username}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    btnCtx.editParent({
                        embeds: [embed.toJSON()],
                        components: [{
                                type: slash_create_1.ComponentType.ACTION_ROW,
                                components: [{
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'Reroll',
                                        custom_id: 'reroll'
                                    }]
                            }]
                    });
                }
                else {
                    await btnCtx.defer(true);
                    await btnCtx.send('You are not the person rolling these dice, so you cannot reroll them!');
                }
            });
        }
        catch (err) {
            await ctx.send({
                embeds: [error_1.errorMessage(err).toJSON()],
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
module.exports = RollStatsCommand;

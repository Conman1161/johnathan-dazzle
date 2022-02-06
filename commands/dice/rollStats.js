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
                        },
                        // {
                        //   name: 'Bingo Card',
                        //   value: 'bingo'
                        // },
                        {
                            name: 'Power Roll',
                            value: 'power'
                        },
                        {
                            name: 'Dark Sun',
                            value: 'dark-sun'
                        },
                        {
                            name: 'Dark Sun Plus',
                            value: 'dark-sun-plus'
                        },
                        {
                            name: 'Down the Line',
                            value: 'dtl'
                        },
                        {
                            name: 'Munchkin',
                            value: 'munchkin'
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
            let rerollCount = 0;
            let embed;
            switch (ctx.options.style) {
                case "70":
                    embed = (0, statsModule_1.rollStandardMin)();
                    break;
                case "d20":
                    embed = (0, statsModule_1.rollStats20)();
                    break;
                // case "bingo":
                //   embed = rollBingo();
                //   break;
                case "cth":
                    embed = (0, statsModule_1.rollcth)();
                    break;
                case "classic":
                    embed = (0, statsModule_1.rollClassic)();
                    break;
                case "dark-sun":
                    embed = (0, statsModule_1.rollDarkSun)();
                    break;
                case "dark-sun-plus":
                    embed = (0, statsModule_1.rollDarkSunPlus)();
                    break;
                case "dtl":
                    embed = (0, statsModule_1.rollDownTheLine)();
                    break;
                case "heroic":
                    embed = (0, statsModule_1.rollHeroic)();
                    break;
                case "munchkin":
                    embed = (0, statsModule_1.rollMunchkin)();
                    break;
                case "pool":
                    embed = (0, statsModule_1.rollDicePool)();
                    break;
                case "power":
                    embed = (0, statsModule_1.rollPower)();
                    break;
                case "standard":
                default:
                    embed = (0, statsModule_1.rollStandard)();
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
            await ctx.send({
                embeds: [embed.toJSON()],
                file: {
                    name: `4d6.png`,
                    file: (0, fs_1.readFileSync)(`./images/4d6.png`)
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
                            embed = (0, statsModule_1.rollStandardMin)();
                            break;
                        case "d20":
                            embed = (0, statsModule_1.rollStats20)();
                            break;
                        // case "bingo":
                        //   embed = rollBingo();
                        //   break;
                        case "cth":
                            embed = (0, statsModule_1.rollcth)();
                            break;
                        case "classic":
                            embed = (0, statsModule_1.rollClassic)();
                            break;
                        case "dark-sun":
                            embed = (0, statsModule_1.rollDarkSun)();
                            break;
                        case "dark-sun-plus":
                            embed = (0, statsModule_1.rollDarkSunPlus)();
                            break;
                        case "dtl":
                            embed = (0, statsModule_1.rollDownTheLine)();
                            break;
                        case "heroic":
                            embed = (0, statsModule_1.rollHeroic)();
                            break;
                        case "munchkin":
                            embed = (0, statsModule_1.rollMunchkin)();
                            break;
                        case "pool":
                            embed = (0, statsModule_1.rollDicePool)();
                            break;
                        case "power":
                            embed = (0, statsModule_1.rollPower)();
                            break;
                        case "standard":
                        default:
                            embed = (0, statsModule_1.rollStandard)();
                            break;
                    }
                    embed.setColor("RANDOM")
                        .setThumbnail(`attachment://4d6.png`);
                    if (ctx.member) {
                        embed.setAuthor(`${ctx.member.displayName}'s Rerolled Stat Block [${++rerollCount}]`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    else {
                        embed.setAuthor(`${ctx.user.username}'s Rerolled Stat Block [${++rerollCount}]`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
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
module.exports = RollStatsCommand;

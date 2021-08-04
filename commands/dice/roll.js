"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rpg_dice_roller_1 = require("rpg-dice-roller");
const slash_create_1 = require("slash-create");
const fs_1 = require("fs");
const error_1 = require("../modules/error");
// const { hostGuildID } = require('../../config.json');
const attachPath = `${process.cwd()}/images/d20s/non-transp/`;
class RollCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'roll',
            description: 'Roll some dice',
            options: [{
                    type: slash_create_1.CommandOptionType.STRING,
                    name: "dice",
                    description: 'See https://greenimp.github.io/rpg-dice-roller/guide/notation/ for supported notations',
                    required: false
                }],
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            let dice = new rpg_dice_roller_1.DiceRoll(ctx.options.dice || "d20");
            let advDice = new rpg_dice_roller_1.DiceRoll(ctx.options.dice || "d20");
            let embed = new discord_js_1.MessageEmbed()
                .setColor("RANDOM")
                .attachFiles([`${attachPath}${dice.total < 21 && dice.total > 0 ? `d20-${dice.total}.png` : `d20.png`}`])
                .addField(`Evaluation:`, dice.output, true)
                .setThumbnail(`attachment://d20${dice.total <= 20 && dice.total >= 1 ? `-${dice.total}.png` : `.png`}`)
                .setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like`);
            //https://cdn.discordapp.com/avatars/{USERID}/{TOKENID}.png
            if (ctx.member) {
                embed.setAuthor(`${ctx.member.displayName}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            else {
                embed.setAuthor(`${ctx.user.username}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            embed.addField(`__Dice total__:`, `You rolled **${dice.total}**`);
            await ctx.send({
                embeds: [embed.toJSON()],
                file: {
                    name: `d20${dice.total <= 20 && dice.total >= 1 ? `-${dice.total}.png` : `.png`}`,
                    file: fs_1.readFileSync(`${attachPath}${dice.total < 21 && dice.total > 0 ? `d20-${dice.total}.png` : `d20.png`}`)
                },
                components: [{
                        type: slash_create_1.ComponentType.ACTION_ROW,
                        components: [{
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.PRIMARY,
                                label: 'Reroll',
                                custom_id: 'reroll'
                            },
                            {
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.PRIMARY,
                                label: 'Add Advantage Dice',
                                custom_id: 'advantage'
                            }]
                    }]
            });
            ctx.registerComponent('reroll', async (btnCtx) => {
                if (ctx.user.id === btnCtx.user.id) {
                    // await btnCtx.defer();
                    dice.roll();
                    embed.setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like\n\nEmbed thumbnails will show the sum of your original roll (or a ? if it was greater than 20)`);
                    if (ctx.member) {
                        embed.setAuthor(`${ctx.member.displayName}'s Die Roll (Rerolled)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    else {
                        embed.setAuthor(`${ctx.user.username}'s Die Roll (Rerolled)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    embed.spliceFields(0, embed.fields.length);
                    embed.addFields([
                        {
                            name: `Evaluation`,
                            value: `${dice.output}`,
                            inline: true
                        },
                        {
                            name: `__Dice Total__`,
                            value: dice.total
                        }
                    ]);
                    await btnCtx.editParent({
                        embeds: [embed.toJSON()],
                        components: [{
                                type: slash_create_1.ComponentType.ACTION_ROW,
                                components: [{
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'Reroll',
                                        custom_id: 'reroll'
                                    },
                                    {
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'Add Advantage Dice',
                                        custom_id: 'advantage',
                                        disabled: embed.fields.length > 2
                                    }]
                            }]
                    });
                }
                else {
                    await btnCtx.defer(true);
                    await btnCtx.send('You are not the person rolling these dice, so you cannot reroll them!');
                }
            });
            ctx.registerComponent('advantage', async (btnCtx) => {
                if (ctx.user.id === btnCtx.user.id) {
                    let oldTotal = dice.total;
                    dice.roll();
                    embed.setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like\n\nEmbed thumbnails will show the sum of your original roll (or a ? if it was greater than 20)`);
                    if (ctx.member) {
                        embed.setAuthor(`${ctx.member.displayName}'s Die Roll (Advantage Added)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    else {
                        embed.setAuthor(`${ctx.user.username}'s Die Roll (Advantage Added)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    embed.spliceFields(1, embed.fields.length - 1);
                    embed.addFields([
                        {
                            name: `Advantage Evaluation`,
                            value: dice.output,
                            inline: true
                        },
                        {
                            name: `__Dice Total__`,
                            value: oldTotal + dice.total
                        },
                    ]);
                    await btnCtx.editParent({
                        embeds: [embed.toJSON()],
                        components: [{
                                type: slash_create_1.ComponentType.ACTION_ROW,
                                components: [{
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'Reroll',
                                        custom_id: 'adv_reroll',
                                        // disabled: true
                                    },
                                    {
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'Add Advantage Dice',
                                        custom_id: 'advantage',
                                        disabled: embed.fields.length > 2
                                    }]
                            }]
                    });
                }
                else {
                    await btnCtx.defer(true);
                    await btnCtx.send('You are not the person rolling these dice, so you cannot add advantage dice!');
                }
            });
            ctx.registerComponent('adv_reroll', async (btnCtx) => {
                if (ctx.user.id === btnCtx.user.id) {
                    dice.roll();
                    advDice.roll();
                    embed.setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like\n\nEmbed thumbnails will show the sum of your original roll (or a ? if it was greater than 20)`);
                    if (ctx.member) {
                        embed.setAuthor(`${ctx.member.displayName}'s Die Roll (Advantage Added)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    else {
                        embed.setAuthor(`${ctx.user.username}'s Die Roll (Advantage Added)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
                    }
                    embed.spliceFields(0, embed.fields.length);
                    embed.addFields([
                        {
                            name: `Evaluation`,
                            value: dice.output,
                            inline: true
                        },
                        {
                            name: `Advantage Evaluation`,
                            value: advDice.output,
                            inline: true
                        },
                        {
                            name: `__Dice Total__`,
                            value: dice.total + advDice.total,
                        },
                    ]);
                    await btnCtx.editParent({
                        embeds: [embed.toJSON()],
                        components: [{
                                type: slash_create_1.ComponentType.ACTION_ROW,
                                components: [{
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'Reroll',
                                        custom_id: 'adv_reroll',
                                        // disabled: true
                                    },
                                    {
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'Add Advantage Dice',
                                        custom_id: 'advantage',
                                        disabled: embed.fields.length > 2
                                    }]
                            }]
                    });
                }
                else {
                    await btnCtx.defer(true);
                    await btnCtx.send('You are not the person rolling these dice, so you cannot add advantage dice!');
                }
            });
        }
        catch (err) {
            ctx.send({
                embeds: [error_1.errorMessage(err).toJSON()],
                file: {
                    name: 'error.png',
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
module.exports = RollCommand;

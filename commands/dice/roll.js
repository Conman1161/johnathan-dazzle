"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rpg_dice_roller_1 = require("rpg-dice-roller");
const slash_create_1 = require("slash-create");
const fs_1 = require("fs");
const errorMod = require("../modules/error");
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
            let dice = new rpg_dice_roller_1.DiceRoll(ctx.options.dice.toString() || "d20");
            let embed = new discord_js_1.MessageEmbed()
                .setColor("RANDOM")
                .attachFiles([`${attachPath}${dice.total < 21 && dice.total > 0 ? `d20-${dice.total}.png` : `d20.png`}`])
                .addField(`Evaluation:`, dice.output)
                .setThumbnail(`attachment://d20${dice.total <= 20 && dice.total >= 1 ? `-${dice.total}.png` : `.png`}`)
                .setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like`);
            //https://cdn.discordapp.com/avatars/{USERID}/{TOKENID}.png
            if (ctx.guildID) {
                embed.setAuthor(`${ctx.member.displayName}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            else {
                embed.setAuthor(`${ctx.user.username}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            embed.addField(`__Dice total__:`, `You rolled **${dice.total}**`);
            return {
                embeds: [embed],
                file: {
                    name: `d20${dice.total <= 20 && dice.total >= 1 ? `-${dice.total}.png` : `.png`}`,
                    file: fs_1.readFileSync(`${attachPath}${dice.total < 21 && dice.total > 0 ? `d20-${dice.total}.png` : `d20.png`}`)
                }
            };
        }
        catch (err) {
            ctx.send({
                embeds: [errorMod.errorMessage(err, ctx)],
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

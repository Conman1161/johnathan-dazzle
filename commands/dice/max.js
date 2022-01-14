"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slash_create_1 = require("slash-create");
const discord_js_1 = require("discord.js");
const rpg_dice_roller_1 = require("rpg-dice-roller");
const fs_1 = require("fs");
const error_1 = require("../modules/error");
class MaxCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "max",
            description: "Find the largest possible result from a given die argument",
            options: [{
                    type: slash_create_1.CommandOptionType.STRING,
                    name: "dice",
                    description: 'What dice expression do you need the maximum of? Accepts the XdY+Z dice format',
                    required: true
                }],
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            if (ctx.options.dice.toString().charAt(0) == "-")
                throw 1;
            do {
                ctx.options.dice = ctx.options.dice.toString().replace(" ", "");
            } while (ctx.options.dice.includes(" "));
            let diceExpression = new rpg_dice_roller_1.DiceRoll(ctx.options.dice);
            let embed = new discord_js_1.MessageEmbed()
                .setThumbnail(`attachment://d20.png`)
                .addField(`Maximum of __${diceExpression.notation}__:`, `__**${diceExpression.maxTotal}**__`)
                .setColor("RANDOM");
            if (ctx.member) {
                embed.setAuthor(`${ctx.member.displayName}'s Die Maximums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            else {
                embed.setAuthor(`${ctx.user.username}'s Die Maximums`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            return {
                embeds: [embed],
                file: {
                    name: `d20.png`,
                    file: (0, fs_1.readFileSync)(`./images/d20s/non-transp/d20.png`)
                }
            };
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
module.exports = MaxCommand;

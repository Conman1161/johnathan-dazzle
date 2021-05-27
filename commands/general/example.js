"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const slash_create_1 = require("slash-create");
const errorMod = require('../modules/error');
// const { hostGuildID } = require('../../config.json');
class ExampleCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: "A template for commands",
            name: "example",
            options: [{
                    name: 'exampleOne',
                    description: `Here's an example option with choices`,
                    type: slash_create_1.CommandOptionType.STRING,
                    choices: [{
                            name: 'Choice One',
                            value: 'I can be lots of things!',
                        }].sort((a, b) => (a.name > b.name) ? 1 : -1),
                }],
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            let embed = new discord_js_1.MessageEmbed().setColor('RANDOM');
            embed.setAuthor(`An example title!`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            return {
                embeds: [embed],
                file: {
                    name: `fileName.png`,
                    file: fs_1.readFileSync(`filePath`)
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
// module.exports = ExampleCommand;

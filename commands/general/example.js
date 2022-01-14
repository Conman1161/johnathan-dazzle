"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const slash_create_1 = require("slash-create");
const error_1 = require("../modules/error");
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
            await ctx.send({
                embeds: [embed.toJSON()],
                file: {
                    name: `fileName.png`,
                    file: (0, fs_1.readFileSync)(`filePath`)
                },
                components: [{
                        type: slash_create_1.ComponentType.ACTION_ROW,
                        components: [{
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.PRIMARY,
                                label: 'Primary',
                                custom_id: 'one'
                            }, {
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.LINK,
                                label: 'Link',
                                url: 'https://github.com/Conman1161/johnathan-dazzle'
                            }]
                    }]
            });
            ctx.registerComponent('one', async (btnCtx) => {
                if (ctx.user.id === btnCtx.user.id) {
                    // Do something to the embed here
                    // Or something else...
                }
                else {
                    await btnCtx.defer(true);
                    await btnCtx.send('You are not the person who originally used this component, so you cannot use this button!');
                }
            });
        }
        catch (err) {
            await ctx.send({
                embeds: [(0, error_1.errorMessage)(err).toJSON()],
                file: {
                    name: `error.png`,
                    file: (0, fs_1.readFileSync)(`./images/error.png`)
                },
                components: [{
                        type: slash_create_1.ComponentType.ACTION_ROW,
                        components: [{
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.PRIMARY,
                                label: 'Primary',
                                custom_id: 'one'
                            }, {
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.LINK,
                                label: 'Link',
                                url: 'https://github.com/Conman1161/johnathan-dazzle'
                            }]
                    }]
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

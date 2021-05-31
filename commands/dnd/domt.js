"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMod = require('../modules/error');
const domtMod = require('../modules/domt');
const imageDir = `${process.cwd()}/images/domt/`;
const discord_js_1 = require("discord.js");
const slash_create_1 = require("slash-create");
const fs_1 = require("fs");
// const { hostGuildID } = require('../../config.json');
class DoMTCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: "Draws a card from the Deck of Many Things",
            name: "domt",
            options: [{
                    type: slash_create_1.CommandOptionType.SUB_COMMAND,
                    name: 'draw',
                    description: 'Draw a card from the Deck of Many Things',
                    required: false,
                    options: [{
                            type: slash_create_1.CommandOptionType.STRING,
                            name: 'deck',
                            description: 'Which deck do you want to draw from?',
                            required: true,
                            choices: [{
                                    name: '13 Card Deck',
                                    value: '13'
                                }, {
                                    name: '22 Card Deck',
                                    value: '22'
                                }].sort((a, b) => (a.name > b.name) ? 1 : -1)
                        }]
                }, {
                    type: slash_create_1.CommandOptionType.SUB_COMMAND,
                    name: 'lookup',
                    description: 'Lookup one of the cards in the Deck of Many Things',
                    required: false,
                    options: [{
                            type: slash_create_1.CommandOptionType.STRING,
                            name: 'card',
                            description: 'Which card are you looking for?',
                            required: true,
                            choices: [{
                                    name: 'Euryale',
                                    value: 'Euryale'
                                }, {
                                    name: 'Flames',
                                    value: 'Flames'
                                }, {
                                    name: 'Jester',
                                    value: 'Jester'
                                }, {
                                    name: 'Key',
                                    value: 'Key'
                                }, {
                                    name: 'Knight',
                                    value: 'Knight'
                                }, {
                                    name: 'Moon',
                                    value: 'Moon'
                                }, {
                                    name: 'Rogue',
                                    value: 'Rogue'
                                }, {
                                    name: 'Ruin',
                                    value: 'Ruin'
                                }, {
                                    name: 'Skull',
                                    value: 'Skull'
                                }, {
                                    name: 'Star',
                                    value: 'Star'
                                }, {
                                    name: 'Sun',
                                    value: 'Sun'
                                }, {
                                    name: 'The Void',
                                    value: 'The Void'
                                }, {
                                    name: 'Throne',
                                    value: 'Throne'
                                }, {
                                    name: 'Balance',
                                    value: 'Balance'
                                }, {
                                    name: 'Comet',
                                    value: 'Comet'
                                }, {
                                    name: 'Donjon',
                                    value: 'Donjon'
                                }, {
                                    name: 'Fool',
                                    value: 'Fool'
                                }, {
                                    name: 'Gem',
                                    value: 'Gem'
                                }, {
                                    name: 'Idiot',
                                    value: 'Idiot'
                                }, {
                                    name: 'Talons',
                                    value: 'Talons'
                                }, {
                                    name: 'The Fates',
                                    value: 'The Fates'
                                }, {
                                    name: 'Vizier',
                                    value: 'Vizier'
                                }].sort((a, b) => (a.name > b.name) ? 1 : -1)
                        }]
                }],
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            let embed = new discord_js_1.MessageEmbed().setColor('RANDOM');
            if (ctx.member) {
                embed.setAuthor(`${ctx.member.displayName}'s Card`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            else {
                embed.setAuthor(`${ctx.user.username}'s Card`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
            }
            let card = domtMod.draw(ctx.options.draw.deck);
            // sub-command switch statement
            switch (Object.keys(ctx.options)[0]) {
                case 'draw':
                    embed.attachFiles([`${imageDir}${card.replace(' ', '')}.png`]);
                    embed.addField('Card: ', card);
                    embed.setImage(`attachment://${card.replace(' ', '')}.png`);
                    break;
                case 'lookup':
                    let effect = domtMod.lookup(ctx.options.lookup.card);
                    embed.attachFiles([`${imageDir}${ctx.options.lookup.card.replace(' ', '')}.png`]);
                    embed.addField('Card: ', ctx.options.lookup.card);
                    embed.addField('Effect: ', effect);
                    embed.setImage(`attachment://${ctx.options.lookup.card.replace(' ', '')}.png`);
                    break;
            }
            await ctx.send({
                embeds: [embed.toJSON()],
                file: {
                    name: `${embed.image.url.replace('attachment://', '')}`,
                    file: fs_1.readFileSync(`./images/domt/${embed.image.url.replace('attachment://', '')}`)
                },
                components: [{
                        type: slash_create_1.ComponentType.ACTION_ROW,
                        components: [{
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.PRIMARY,
                                label: 'Get Effect',
                                custom_id: 'effect',
                                disabled: Object.keys(ctx.options)[0] === 'lookup'
                            }]
                    }]
            });
            ctx.registerComponent('effect', async (btnCtx) => {
                if (ctx.user.id === btnCtx.user.id) {
                    embed.addField('Effect: ', domtMod.lookup(card));
                    btnCtx.editParent({
                        embeds: [embed.toJSON()],
                        components: [{
                                type: slash_create_1.ComponentType.ACTION_ROW,
                                components: [{
                                        type: slash_create_1.ComponentType.BUTTON,
                                        style: slash_create_1.ButtonStyle.PRIMARY,
                                        label: 'Get Effect',
                                        custom_id: 'effect',
                                        disabled: true
                                    }]
                            }]
                    });
                }
                else {
                    await btnCtx.defer(true);
                    await btnCtx.send('You did not draw this card from the deck, so you do not have permission to get the effect!');
                }
            });
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
module.exports = DoMTCommand;

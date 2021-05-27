"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const package_json_1 = require("../../package.json");
const config_json_1 = require("../../config.json");
const slash_create_1 = require("slash-create");
const fs_1 = require("fs");
const owoify = require('owoifyx');
class BotInfoCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: "A little information Johnathon Dazzle",
            name: "info",
            options: [{
                    name: 'force_catboy',
                    description: 'Force the help command into catboy mode. You did this to yourself',
                    type: slash_create_1.CommandOptionType.BOOLEAN
                }]
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        await ctx.defer();
        let myInfo = new discord_js_1.MessageEmbed()
            .setAuthor(`${config_json_1.catboy || ctx.options.force_catboy ? owoify('Johnathan Dazzle') : 'Johnathan Dazzle'}`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
            .addField(`${config_json_1.catboy || ctx.options.force_catboy ? `${owoify('Bot Info')}` : `Bot Info`}`, `${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`Hello, I'm Johnathon Dazzle! I roll the dice around here. I've got a few tricks up my sleeve, so check them out with`)}` : `Hello, I'm Johnathon Dazzle! I roll the dice around here. I've got a few tricks up my sleeve, so check them out with`} \`/help\`!`)
            .addField(`${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`__**WORK IN PROGRESS**__`)}` : `__**WORK IN PROGRESS**__`}`, `${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`Dazzle is currently in development, meaning some functions and features are not finished or completely implemented yet. Please keep this in mind when using Dazzle`)}` : `Dazzle is currently in development, meaning some functions and features are not finished or completely implemented yet. Please keep this in mind when using Dazzle`}`)
            .addField(`${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`Bot Support`)}` : `Bot Support`}`, `${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`If you find an issue, message __**${config_json_1.ownerTag}**__ with a screenshot and a short description of the issue or join`)} [this](https://discord.gg/ZUJAMnh) ${owoify('discord server')}`
            : `If you find an issue, message __ ** ${config_json_1.ownerTag}** __ with a screenshot and a short description of the issue or join [this](https://discord.gg/ZUJAMnh) discord server`}`, true)
            .addField(`${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`Command Ideas`)}` : `Command Ideas`} `, `${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`If you have any ideas for commands, message __**${config_json_1.ownerTag}**__ with them`)}` : `If you have any ideas for commands, message __**${config_json_1.ownerTag}**__ with them`} `, true)
            .addField(`${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`Bot Version`)}` : `Bot Version`} `, `${config_json_1.catboy || ctx.options.force_catboy ? `${owoify(`Currently running v**${package_json_1.version}**`)}` : `Currently running v**${package_json_1.version}**`} `)
            .addField("Artwork/Assets", 'All artwork has been commissioned and made by **Kai**. They can be found on [`Twitter`](https://twitter.com/ckttle_ "@ckttle_") and [`Instagram`](https://instagram.com/ckttle "@ckttle").')
            .setColor(config_json_1.catboy || ctx.options.force_catboy ? "#e073c1" : "#fe00ff")
            .attachFiles([config_json_1.catboy || ctx.options.force_catboy ? "./images/catboy/Background.png" : "./images/icon.png"])
            .setThumbnail(`attachment://${config_json_1.catboy || ctx.options.force_catboy ? "Background.png" : "icon.png"}`);
        return {
            embeds: [myInfo],
            file: {
                name: `${config_json_1.catboy || ctx.options.force_catboy ? 'Background.png' : 'icon.png'}`,
                file: fs_1.readFileSync(config_json_1.catboy || ctx.options.force_catboy ? `./images/catboy/Background.png` : `./images/icon.png`)
            }
        };
    }
}
module.exports = BotInfoCommand;

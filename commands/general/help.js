"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slash_create_1 = require("slash-create");
const fs_1 = require("fs");
const config_json_1 = require("../../config.json");
const errorMod = require("../modules/error");
class HelpCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            description: "See a list of all commands",
            name: "help",
            options: [{
                    name: 'command',
                    description: 'Need help with a specific command? Enter that command here!',
                    type: slash_create_1.CommandOptionType.STRING,
                    required: false
                }]
            // guildIDs: [hostGuildID]
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            //Get all folder groups
            let groups = fs_1.readdirSync('./commands');
            //Remove modules folder
            groups.splice(groups.indexOf('modules'), 1);
            let helpEmbed = new discord_js_1.MessageEmbed()
                .setAuthor("Help", `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
                .attachFiles([`./images/help.png`])
                .setColor("#fe00ff")
                .setThumbnail("attachment://help.png")
                .setFooter('For more information about how to use a command, use /<command> to start using that command!\nIf you don\'t see a command with /<command> and it\'s listed here, wait about an hour until Discord syncs with their API!');
            let commands = ctx.creator.commands.array();
            // If no option
            if (!ctx.options.command) {
                commands.forEach(command => {
                    let category = command.filePath.split('commands').pop().toLowerCase().split(command.commandName)[0];
                    category = category.slice(1, category.length - 1);
                    // If no field with current command's group
                    if (!helpEmbed.fields.some(commandCategory => commandCategory.name === category)) {
                        helpEmbed.addField(category, `[${command.commandName}](https://github.com/Conman1161/johnathan-dazzle "${command.description}${command.guildIDs ? `\n${command.guildIDs}` : ''}")`, true);
                    }
                    // If field with current command's group exists
                    else if (helpEmbed.fields.some(commandCategory => commandCategory.name === category)) {
                        let index = helpEmbed.fields.findIndex(obj => obj.name === category);
                        let currentField = helpEmbed.fields[index];
                        helpEmbed.spliceFields(index, 1, [{
                                name: currentField.name,
                                value: `${currentField.value}, [${command.commandName}](https://github.com/Conman1161/johnathan-dazzle "${command.description}${command.guildIDs ? `\nOnly in guild(s): ${command.guildIDs.join(',')}` : ''}")`,
                                inline: true
                            }]);
                    }
                    else {
                        throw `If you see this, something very bad happened! Contact ${config_json_1.ownerTag} to get this resolved!`;
                    }
                });
                // If valid command option
            }
            else if (commands.some(command => command.commandName === ctx.options.command)) {
                let command = commands.find(command => command.commandName === ctx.options.command);
                helpEmbed.addField('Command', ctx.options.command);
                if (command.description) {
                    helpEmbed.addField('Description', command.description);
                }
                if (command.options) {
                    let names = command.options.map(currentCommand => currentCommand.name);
                    let descriptions = command.options.map(currentCommand => currentCommand.description);
                    let output = '';
                    names.forEach((name, index) => {
                        output += `**${name}:** ${descriptions[index]}\n`;
                    });
                    helpEmbed.addField(`Options`, output);
                }
                if (command.guildIDs) {
                    helpEmbed.addField('Available in guild(s)', command.guildIDs.join(','));
                }
                if (command.requiredPermissions) {
                    helpEmbed.addField('Required Permissions', command.requiredPermissions.join(','));
                }
                if (command.throttling) {
                    helpEmbed.addField('Throttled', command.throttling);
                }
                if (command.unknown) {
                    helpEmbed.addField('Used for unknown commands?', command.unknown);
                }
                if (command.deferEphemeral) {
                    helpEmbed.addField('Defer ephemerally?', command.deferEphemeral);
                }
                if (command.defaultPermission) {
                    helpEmbed.addField('Default permissions?', command.defaultPermission);
                }
            }
            else {
                throw `The command ${ctx.options.command} was not found!`;
            }
            helpEmbed.fields.sort();
            await ctx.send({
                embeds: [helpEmbed.toJSON()],
                file: {
                    name: `help.png`,
                    file: fs_1.readFileSync(`./images/help.png`)
                },
                components: [{
                        type: slash_create_1.ComponentType.ACTION_ROW,
                        components: [{
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.LINK,
                                label: 'Support Discord Server',
                                url: 'https://discord.gg/ZUJAMnh'
                            },
                            {
                                type: slash_create_1.ComponentType.BUTTON,
                                style: slash_create_1.ButtonStyle.LINK,
                                label: 'Dice Notation',
                                url: 'https://greenimp.github.io/rpg-dice-roller/guide/notation/'
                            }]
                    }]
            });
        }
        catch (err) {
            ctx.send({
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
}
module.exports = HelpCommand;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const slash_create_1 = require("slash-create");
const error_1 = require("../modules/error");
let maxChars = 5; // int
class CharactersCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "character",
            description: "Interact with your characters, or make a new one!",
            options: [
                {
                    name: 'new',
                    description: `Create a new character! (Max ${maxChars.toString()} characters)`,
                    type: slash_create_1.CommandOptionType.SUB_COMMAND,
                    options: [{
                            name: 'name',
                            description: 'The name of the character',
                            type: slash_create_1.CommandOptionType.STRING,
                            required: true
                        },
                        {
                            name: 'race',
                            description: `Your character's race`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: true
                        },
                        {
                            name: 'class',
                            description: 'The primary class of the character',
                            type: slash_create_1.CommandOptionType.STRING,
                            required: true
                        },
                        {
                            name: 'level',
                            description: 'The level of the character in their primary class',
                            type: slash_create_1.CommandOptionType.INTEGER,
                            required: true,
                            min_value: 1,
                            max_value: 20
                        },
                        {
                            name: 'strength',
                            description: `Your character's strength score`,
                            type: slash_create_1.CommandOptionType.INTEGER,
                            required: true,
                            min_value: 1,
                            max_value: 30
                        },
                        {
                            name: 'dexterity',
                            description: `Your character's dexterity score`,
                            type: slash_create_1.CommandOptionType.INTEGER,
                            required: true,
                            min_value: 1,
                            max_value: 30
                        },
                        {
                            name: 'constitution',
                            description: `Your character's constitution score`,
                            type: slash_create_1.CommandOptionType.INTEGER,
                            required: true,
                            min_value: 1,
                            max_value: 30
                        },
                        {
                            name: 'intelligence',
                            description: `Your character's intelligence score`,
                            type: slash_create_1.CommandOptionType.INTEGER,
                            required: true,
                            min_value: 1,
                            max_value: 30
                        },
                        {
                            name: 'wisdom',
                            description: `Your character's wisdom score`,
                            type: slash_create_1.CommandOptionType.INTEGER,
                            required: true,
                            min_value: 1,
                            max_value: 30
                        },
                        {
                            name: 'charisma',
                            description: `Your character's charsima score`,
                            type: slash_create_1.CommandOptionType.INTEGER,
                            required: true,
                            min_value: 1,
                            max_value: 30
                        }].sort().concat([
                        {
                            name: 'background',
                            description: `Your character's background`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'alignment',
                            description: `Your character's alignment`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'faith',
                            description: `Your character's faith`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'hair',
                            description: `Your character's hair color`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'height',
                            description: `Your character's height`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'weight',
                            description: `Your character's weight`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'age',
                            description: `Your character's age`,
                            type: slash_create_1.CommandOptionType.INTEGER,
                            required: false,
                        },
                        {
                            name: 'eyes',
                            description: `Your character's eye color`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'gender',
                            description: `Your character's gender`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'personality_traits',
                            description: `Your character's personality traits`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'ideals',
                            description: `Your character's ideals`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'bonds',
                            description: `Your character's bonds`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'flaws',
                            description: `Your character's flaws`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'backstory',
                            description: `A brief about your characters backstory`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        },
                        {
                            name: 'other',
                            description: `Other information about your character`,
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false
                        }
                    ].sort((a, b) => (a.name > b.name) ? 1 : -1))
                }
            ],
        });
        this.filePath = __filename;
    }
    async run(ctx) {
        try {
            await ctx.defer();
            // create character from ctx
            // create embed
            // add note to edit character for chosen features (see Aetherborn)
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
module.exports = CharactersCommand;

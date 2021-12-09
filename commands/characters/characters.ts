import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from "slash-create";
import { errorMessage } from '../modules/error'

let maxChars: number = 5; // int

class CharactersCommand extends SlashCommand {
   constructor(creator: SlashCreator) {
      super(creator, {
         name: "character",
         description: "Interact with your characters, or make a new one!",
         options: [
            {
            name: 'new',
            description: `Create a new character! (Max ${maxChars.toString()} characters)`,
            type: CommandOptionType.SUB_COMMAND,
            options: [{
               name: 'name',
               description: 'The name of the character',
               type: CommandOptionType.STRING,
               required: true
            },
            {
               name: 'race',
               description: `Your character's race`,
               type: CommandOptionType.STRING,
               required: true
            },
            {
               name: 'class',
               description: 'The primary class of the character',
               type: CommandOptionType.STRING,
               required: true
            },
            {
               name: 'level',
               description: 'The level of the character in their primary class',
               type: CommandOptionType.INTEGER,
               required: true,
               min_value: 1,
               max_value: 20
            },
            {
               name: 'strength',
               description: `Your character's strength score`,
               type: CommandOptionType.INTEGER,
               required: true,
               min_value: 1,
               max_value: 30
            },
            {
               name: 'dexterity',
               description: `Your character's dexterity score`,
               type: CommandOptionType.INTEGER,
               required: true,
               min_value: 1,
               max_value: 30
            },
            {
               name: 'constitution',
               description: `Your character's constitution score`,
               type: CommandOptionType.INTEGER,
               required: true,
               min_value: 1,
               max_value: 30
            },
            {
               name: 'intelligence',
               description: `Your character's intelligence score`,
               type: CommandOptionType.INTEGER,
               required: true,
               min_value: 1,
               max_value: 30
            },
            {
               name: 'wisdom',
               description: `Your character's wisdom score`,
               type: CommandOptionType.INTEGER,
               required: true,
               min_value: 1,
               max_value: 30
            },
            {
               name: 'charisma',
               description: `Your character's charsima score`,
               type: CommandOptionType.INTEGER,
               required: true,
               min_value: 1,
               max_value: 30
            }].sort().concat([ // Optional options
               {
                  name: 'background',
                  description: `Your character's background`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'alignment',
                  description: `Your character's alignment`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'faith',
                  description: `Your character's faith`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'hair',
                  description: `Your character's hair color`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'height',
                  description: `Your character's height`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'weight',
                  description: `Your character's weight`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'age',
                  description: `Your character's age`,
                  type: CommandOptionType.INTEGER,
                  required: false,
               },
               {
                  name: 'eyes',
                  description: `Your character's eye color`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'gender',
                  description: `Your character's gender`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'personality_traits',
                  description: `Your character's personality traits`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'ideals',
                  description: `Your character's ideals`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'bonds',
                  description: `Your character's bonds`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'flaws',
                  description: `Your character's flaws`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'backstory',
                  description: `A brief about your characters backstory`,
                  type: CommandOptionType.STRING,
                  required: false
               },
               {
                  name: 'other',
                  description: `Other information about your character`,
                  type: CommandOptionType.STRING,
                  required: false
               }
            ].sort((a, b) => (a.name > b.name) ? 1 : -1))
         }],
      });
      this.filePath = __filename;
   }

   async run(ctx: CommandContext) {
      try {
         await ctx.defer();

         // create character from ctx

         // create embed

         // add note to edit character for chosen features (see Aetherborn)
         
      } catch (err: any) {
         await ctx.send({
            embeds: [errorMessage(err).toJSON()],
            file: {
               name: `error.png`,
               file: readFileSync(`./images/error.png`)
            }
         });
      } finally {
      }
   }
   async onError(err: any, ctx: CommandContext) {
      await ctx.send(`An error occurred! Here is the message: \`${err}\``);
   }
}

module.exports = CharactersCommand;
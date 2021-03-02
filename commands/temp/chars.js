const { SlashCommand, CommandOptionType } = require('slash-create');
const errorMod = require('../modules/error');
const fs = require('fs');
const request = require('request');
const { MessageEmbed, resolveColor } = require("discord.js");

class CharacterCommand extends SlashCommand {
   constructor(creator) {
      super(creator, {
         name: 'character',
         description: 'Edit your characters',
         options: [{
            type: CommandOptionType.SUB_COMMAND,
            name: 'add',
            description: 'Add a new character! (Max 5 per user)',
            required: false,
            options: [{
               name: 'name',
               description: 'What is your character\'s name?',
               type: CommandOptionType.STRING,
               required: true
            },
            {
               name: 'race',
               description: 'What is your character\'s race?',
               type: CommandOptionType.STRING,
               required: true
            },
            {
               name: 'class',
               description: 'What is your character\'s primary class?',
               type: CommandOptionType.STRING,
               required: true
            },
            {
               name: 'level',
               description: 'What level is your character in your primary class?',
               type: CommandOptionType.INTEGER,
               required: true
            },
            {
               name: 'strength',
               description: 'What is your character\'s Strength score before ANY modifiers?',
               type: CommandOptionType.INTEGER,
               required: true
            },
            {
               name: 'dexterity',
               description: 'What is your character\'s Dexterity score before ANY modifiers?',
               type: CommandOptionType.INTEGER,
               required: true
            },
            {
               name: 'constitution',
               description: 'What is your character\'s Constitution score before ANY modifiers?',
               type: CommandOptionType.INTEGER,
               required: true
            },
            {
               name: 'intelligence',
               description: 'What is your character\'s Dexterity score before ANY modifiers?',
               type: CommandOptionType.INTEGER,
               required: true
            },
            {
               name: 'wisdom',
               description: 'What is your character\'s Dexterity score before ANY modifiers?',
               type: CommandOptionType.INTEGER,
               required: true
            },
            {
               name: 'charisma',
               description: 'What is your character\'s Dexterity score before ANY modifiers?',
               type: CommandOptionType.INTEGER,
               required: true
            },
            ]
         },
         {
            type: CommandOptionType.SUB_COMMAND,
            name: 'remove',
            description: 'Remove one of your characters',
            required: false,
            options: [{
               type: CommandOptionType.STRING,
               name: 'name',
               description: 'The name of the character you want to delete',
               required: true
            }]
         },
         {
            type: CommandOptionType.SUB_COMMAND,
            name: 'edit',
            description: 'Edit a part of your character sheet',
            required: false
         }]
      });
      this.filePath = __filename;
   }

   async run(ctx) {
      console.log(ctx);
   }
}

module.exports = CharacterCommand;

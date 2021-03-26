const { MessageEmbed } = require('discord.js');
const { SlashCommand, CommandOptionType } = require('slash-create');
const errorMod = require('../modules/error');
const charMod = require('../modules/');

class CharacterCommand extends SlashCommand {
   constructor(creator) {
      super(creator, {
         name: 'character',
         description: 'Edit your character(s)',
         options: [
            {
               type: CommandOptionType.SUB_COMMAND,
               name: 'add',
               description: 'Add a new character! (Max 5 per user)',
               required: false,
               options: [
                  {
                     type: CommandOptionType.STRING,
                     name: 'name',
                     description: 'The name of your character',
                     required: true
                  },
                  {
                     type: CommandOptionType.STRING,
                     name: 'race',
                     description: 'The race of your character',
                     required: true
                  },
                  {
                     type: CommandOptionType.STRING,
                     name: 'class',
                     description: 'Your character\'s primary class',
                     required: true
                  },
                  {
                     type: CommandOptionType.INTEGER,
                     name: 'level',
                     description: 'Your character\'s level in their primary class',
                     required: true
                  },
                  {
                     type: CommandOptionType.INTEGER,
                     name: 'strength',
                     description: 'Your character\'s strength ability score',
                     required: true
                  },
                  {
                     type: CommandOptionType.INTEGER,
                     name: 'dexterity',
                     description: 'Your character\'s dexterity ability score',
                     required: true
                  },
                  {
                     type: CommandOptionType.INTEGER,
                     name: 'constitution',
                     description: 'Your character\'s constitution ability score',
                     required: true
                  },
                  {
                     type: CommandOptionType.INTEGER,
                     name: 'intelligence',
                     description: 'Your character\'s intelligence ability score',
                     required: true
                  },
                  {
                     type: CommandOptionType.INTEGER,
                     name: 'wisdom',
                     description: 'Your character\'s wisdom ability score',
                     required: true
                  },
                  {
                     type: CommandOptionType.INTEGER,
                     name: 'charisma',
                     description: 'Your character\'s charisma ability score',
                     required: true
                  }
               ]
            }
         ],
      });
      this.filePath = __filename;
   }

   async run(ctx) {
      try {
         let subCommand = Object.entries(ctx.options)[0][0];
         switch (subCommand) {
            case 'add':
               let newSheet = require('../characters/sheets/template.json');
               newSheet.Name = ctx.options.add.name;
               newSheet.Race = ctx.options.add.race;
               newSheet.Classes.push({ "name": ctx.options.add.class, "level": ctx.options.add.level, "subclass": ctx.options.add.subclass });
               newSheet.Strength = ctx.options.add.strength;
               newSheet.Dexterity = ctx.options.add.dexterity;
               newSheet.Intelligence = ctx.options.add.intelligence;
               newSheet.Constitution = ctx.options.add.constitution;
               newSheet.Charisma = ctx.options.add.charisma;
               newSheet.owner = ctx.user.id;
               break;
         }
         return 'finished!';
      } catch (err) {

      }
   }
}

module.exports = CharacterCommand;

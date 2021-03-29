const { SlashCommand, CommandOptionType } = require("slash-create");

class SkillCheck extends SlashCommand {
   constructor(creator) {
      super(creator, {
         name: "skill_check",
         description: "Make a skill check using your character sheet(s)",
         options: [{
            type: CommandOptionType.STRING,
            name: 'skill',
            description: "The skill you want to roll for",
            required: true,
            choices: [
               { name: "Acrobatics", value: "acrobatics" },
               { name: "Animal Handling", value: "animal_handling" },
               { name: "Arcana", value: "arcana" },
               { name: "Athletics", value: "athletics" },
               { name: "Deception", value: "deception" },
               { name: "History", value: "history" },
               { name: "Insight", value: "insight" },
               { name: "Intimidation", value: "intimidation" },
               { name: "Investigation", value: "investigation" },
               { name: "Medicine", value: "medicine" },
               { name: "Nature", value: "nature" },
               { name: "Perception", value: "perception" },
               { name: "Performance", value: "performance" },
               { name: "Persuasion", value: "persuasion" },
               { name: "Religion", value: "religion" },
               { name: "Sleight of Hand", value: "sleight_of_hand" },
               { name: "Stealth", value: "stealth" },
               { name: "Survival", value: "survival" },
            ]
         },
         {
            type: CommandOptionType.STRING,
            name: 'roll_type',
            description: 'Do you have Advantage or Disadvantage?',
            required: false,
            choices: [
               { name: "Advantage", value: "advantage" },
               { name: 'Disadvantage', value: 'disadvantage' }
            ]
         },
         {
            type: CommandOptionType.STRING,
            name: 'character_name',
            description: 'Which character of your do you want to roll for?',
            required: false
         }]
      });
      this.filePath = __filename;
   }
   async run(ctx) {
      return 'Hello, world!';
   }
}

module.exports = SkillCheck;
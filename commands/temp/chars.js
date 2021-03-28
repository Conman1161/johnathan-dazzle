const { MessageEmbed } = require("discord.js");
const { SlashCommand, CommandOptionType } = require("slash-create");
const errorMod = require("../modules/error");
const charMod = require("../modules/chars");
const template = require("../characters/sheets/template.json");

class CharacterCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "character",
      description: "Edit your character(s)",
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: "add",
          description: "Add a new character! (Max 5 per user)",
          required: false,
          options: [
            {
              type: CommandOptionType.STRING,
              name: "name",
              description: "The name of your character",
              required: true,
            },
            {
              type: CommandOptionType.STRING,
              name: "race",
              description: "The race of your character",
              required: true,
            },
            {
              type: CommandOptionType.STRING,
              name: "class",
              description: "Your character's primary class",
              required: true,
            },
            {
              type: CommandOptionType.INTEGER,
              name: "level",
              description: "Your character's level in their primary class",
              required: true,
            },
            {
              type: CommandOptionType.INTEGER,
              name: "strength",
              description: "Your character's strength ability score",
              required: true,
            },
            {
              type: CommandOptionType.INTEGER,
              name: "dexterity",
              description: "Your character's dexterity ability score",
              required: true,
            },
            {
              type: CommandOptionType.INTEGER,
              name: "constitution",
              description: "Your character's constitution ability score",
              required: true,
            },
            {
              type: CommandOptionType.INTEGER,
              name: "intelligence",
              description: "Your character's intelligence ability score",
              required: true,
            },
            {
              type: CommandOptionType.INTEGER,
              name: "wisdom",
              description: "Your character's wisdom ability score",
              required: true,
            },
            {
              type: CommandOptionType.INTEGER,
              name: "charisma",
              description: "Your character's charisma ability score",
              required: true,
            },
            {
              type: CommandOptionType.STRING,
              name: "subclass",
              description: "Your character's subclass in their primary class",
              required: false,
            },
            {
              type: CommandOptionType.STRING,
              name: "background",
              description: "Your character's background",
              required: false,
            },
            {
              type: CommandOptionType.STRING,
              name: "alignment",
              description: "Your character's alignment",
              required: false,
            },
            {
              type: CommandOptionType.STRING,
              name: "languages",
              description:
                "Extra languages your character knows (fill out if using homebrew/unsupported content)",
              required: false,
            },
            {
              type: CommandOptionType.STRING,
              name: "skill_proficiencies",
              description:
                "Extra skill proficiencies your character has, separated by commas. Include selected proficiencies",
              required: false,
            },
            {
              type: CommandOptionType.STRING,
              name: "armor_proficiencies",
              description:
                "Extra armor proficiencies your character has, separated by commas.",
              required: false,
            },
            {
              type: CommandOptionType.STRING,
              name: "weapon_proficiencies",
              description:
                "Extra proficiencies your character has, separated by commas.s",
              required: false,
            },
            {
              type: CommandOptionType.STRING,
              name: "tool_proficiencies",
              description:
                "Extra tool proficiencies your character has, separated by commas. Include selected proficiencies",
              required: false,
            },
            {
              type: CommandOptionType.STRING,
              name: "racial_traits",
              description:
                "Extra racial traits your character has (fill out if using homebrew/unsupported content)",
              required: false,
            },
          ],
        },
      ],
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    try {
      let subCommand = Object.entries(ctx.options)[0][0];
      switch (subCommand) {
        case "add":
          let newSheet = JSON.parse(JSON.stringify(template)); //"copies" the template json
          newSheet.Name = ctx.options.add.name;
          newSheet.Race = ctx.options.add.race;
          newSheet.Classes.push({
            name: ctx.options.add.class,
            level: ctx.options.add.level,
            subclass: ctx.options.add.subclass || "",
          });
          newSheet.Strength = ctx.options.add.strength;
          newSheet.Dexterity = ctx.options.add.dexterity;
          newSheet.Intelligence = ctx.options.add.intelligence;
          newSheet.Constitution = ctx.options.add.constitution;
          newSheet.Charisma = ctx.options.add.charisma;
          newSheet.owner = ctx.user.id;
          newSheet = charMod.setAllFeatures(newSheet);
          break;
      }
      return "finished!";
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = CharacterCommand;

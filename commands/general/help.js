const { MessageEmbed } = require("discord.js");
const errorMod = require("../modules/error");
const { SlashCommand, CommandOptionType } = require("slash-create");
const { readFileSync, readdirSync } = require("fs");
const { ownerTag } = require('../../config.json');

class HelpCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description:
        "See a list of all commands",
      name: "help",
      options: [{
        name: 'command',
        description: 'Need help with a specific command? Enter that command here!',
        type: CommandOptionType.STRING,
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
      let groups = readdirSync('./commands');
      //Remove modules folder
      groups.pop('modules');
      let helpEmbed = new MessageEmbed()
        .setAuthor("Help", `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
        .attachFiles(`./images/help.png`)
        .setColor("#fe00ff")
        .setThumbnail("attachment://help.png")
        .setFooter('For more information about how to use a command, use /<command> to start using that command!');

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
          } else {
            throw `If you see this, something very bad happened! Contact ${ownerTag} to get this resolved!`;
          }
        });
        // If valid command option
      } else if (commands.some(command => command.commandName === ctx.options.command)) {
        let command = commands.find(command => command.commandName === ctx.options.command);
        helpEmbed.addField('Command', ctx.options.command);
        if (command.description) {
          helpEmbed.addField('Description', command.description);
        }
        if (command.options) {
          let names = command.options.map(currentCommand => currentCommand.name);
          let descriptions = command.options.map(currentCommand => currentCommand.description);
          let output = '';
          for (let i = 0; i < names.length; i++) {
            output += `**${names[i]}:** ${descriptions[i]}\n`;
          }
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
        if (command.defaultPermissions) {
          helpEmbed.addField('Default permissions?', command.defaultPermissions);
        }
      } else {
        throw `The command ${ctx.options.command} was not found!`;
      }

      helpEmbed.fields.sort();

      return {
        embeds: [helpEmbed],
        file: {
          name: `help.png`,
          file: readFileSync(`./images/help.png`)
        }
      };
    } catch (err) {
      ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        file: {
          name: `error.png`,
          file: readFileSync(`./images/error.png`)
        }
      });
    } finally {
    }
  }
}

module.exports = HelpCommand;

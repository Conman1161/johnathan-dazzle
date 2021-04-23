// Current approach to long fields for help does not allow for more than 1 "layer" of extra commands. With having long URLs linking to documentation, this needs to be fixed. Maybe make an array that holds arrays of "popped" commands?

const commando = require("discord.js-commando");
const discord = require("discord.js");
const errorMod = require("../modules/error");
const attachment = new discord.MessageAttachment(
  "./images/help.png",
  "help.png"
);
const hiddenGroups = ["commands"];
const hiddenCommands = ["restart", "servers"];

class HelpCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description:
        "Gives general information about commands, along with what commands there are",
      examples: ["!help"].sort(),
      format: "",
      group: "general",
      memberName: "help",
      name: "help",
    });
  }

  async run(message, args) {
    message.channel.startTyping();

    try {
      args = args.toLowerCase();
      const commandGroups = this.client.registry.groups;
      let currentCommands = [];
      let poppedCommands = [];
      let hasRun = false;
      let isMod = message.author.presence.member.permissions.has(
        "ADMINISTRATOR"
      );
      let helpEmbed = new discord.MessageEmbed()
        .setAuthor("Help", message.client.user.displayAvatarURL({ dynamic: true }))
        .attachFiles(attachment)
        .setColor("#fe00ff")
        .setThumbnail("attachment://help.png");
      // all commands
      if (args == "") {
        helpEmbed.addField(
          "What's all this?",
          "Above all the commands are their respective groups. If you want to see all commands in a group, do `!help {Group Name}`. If you want help with a specific command, do `!help {Command}`.\n\nAll links go to the documentation. Currently, commands in the **Commands** and **Utility** categories are undocumented since they are built into Discord.JS"
        );
        for (let [groupKey, groupObject] of commandGroups) {
          if (hiddenGroups.includes(groupObject.name.toLowerCase()) && !isMod) {
            continue;
          }
          currentCommands = [];
          for (let [commandKey, commandObject] of groupObject.commands) {
            if (hiddenCommands.includes(commandKey.toLowerCase() && !isMod)) {
              continue;
            }
            currentCommands.push(
              `[${commandKey}](https://conman1161.github.io/Dazzle/#${commandObject.name
              } "${commandObject.description}\n${commandObject.aliases.length == 0
                ? ""
                : `Aliases: ${commandObject.aliases
                  .toString()
                  .replace(",", ", ")}`
              }")`
            );
          }
          if (currentCommands.toString() != "") {
            for (let i = 0; i < currentCommands.length; i++) {
              currentCommands[i] = ` ${currentCommands[i]}`;
            }
            if (currentCommands.toString().length >= 1024) {
              while (currentCommands.toString().length >= 1024) {
                poppedCommands.push(
                  currentCommands[currentCommands.length - 1]
                );
                currentCommands.pop(currentCommands.length - 1);
              }
            }

            helpEmbed.addField(
              `__${groupObject.name}__`,
              currentCommands.toString(),
              true
            );

            if (poppedCommands.length > 0) {
              helpEmbed.addField(
                `__${groupObject.name} cont.__`,
                poppedCommands.toString(),
                true
              );
            }
            poppedCommands = [];
            hasRun = true;
          }
        }
        //commands in given group
      } else if (commandGroups.has(args)) {
        if (hiddenGroups.includes(args) && !isMod) {
          throw 13;
        }
        let currentCommandsMap = commandGroups.get(args).commands;
        for (let [commandName, commandObject] of currentCommandsMap) {
          if (hiddenCommands.includes(commandName.toLowerCase()) && !isMod) {
            continue;
          }
          currentCommands.push(
            `**[${commandName}](https://conman1161.github.io/Dazzle/#${commandObject.name
            } "${commandObject.aliases.length == 0
              ? ""
              : `Aliases: ${commandObject.aliases
                .toString()
                .replace(",", ", ")}`
            }")** - ${commandObject.description}\n\n`
          );
        }
        if (currentCommandsMap.toString() != "") {
          if (currentCommands.toString().length >= 1024) {
            while (currentCommands.toString().length >= 1024) {
              poppedCommands.push(currentCommands[currentCommands.length - 1]);
              currentCommands.pop(currentCommands.length - 1);
            }
          }

          let outputString = "";
          for (let i = 0; i < currentCommands.length; i++) {
            outputString += `${currentCommands[i]}`;
          }

          helpEmbed.addField(`${args} \n`, outputString);

          if (poppedCommands.length > 0) {
            helpEmbed.addField(
              `${Array.from(currentCommandsMap.entries())[0][1].groupID
              } cont.`,
              poppedCommands.toString(),
              true
            );
          }

          hasRun = true;
        }
        // determine if given command exists, else throw
      } else {
        let currentExamples = [];
        for (let [groupKey, groupObject] of commandGroups) {
          for (let [commandKey, commandObject] of groupObject.commands) {
            if (commandKey == args) {
              if (
                hiddenGroups.includes(groupObject.name.toLowerCase()) &&
                !isMod
              ) {
                throw 13;
              } else if (
                hiddenCommands.includes(commandKey.toLowerCase()) &&
                !isMod
              ) {
                throw 13;
              }
              helpEmbed.setAuthor(`Command Help: ${commandKey} `, message.client.user.displayAvatarURL({ dynamic: true }));

              //If...
              //...aliases is not null,
              //length of aliases array isn't 0, and
              //first element isn't a blank string
              if (
                commandObject.aliases != null &&
                commandObject.aliases.length != 0 &&
                commandObject.aliases[0] != ""
              ) {
                let aliasesString = "";
                for (let i = 0; i < commandObject.aliases.length; i++) {
                  aliasesString += `${commandObject.aliases[i]} \n`;
                }
                helpEmbed.addField("Aliases:", `${aliasesString} `);
              }

              //...description isn't null, description isn't a blank string
              if (
                commandObject.description != null &&
                commandObject.description != ""
              ) {
                helpEmbed.addField(
                  "Description:",
                  `${commandObject.description} `
                );
              }

              //...details isn't null, details isn't a blank string
              if (
                commandObject.details != null &&
                commandObject.details != ""
              ) {
                helpEmbed.addField(
                  `Details:`,
                  `70: Sets the minimum threshold for the sum of your statblock to 70\nd20: Rolls 6d20 for your statblock\ncth: Rolls a statblock for Call of Cthulhu`
                );
              }

              //...examples are not null,         length of examples array isn't 0,      first element isn't a blank string
              if (
                commandObject.examples !== null &&
                commandObject.examples.length != 0 &&
                commandObject.examples[0] != ""
              ) {
                currentExamples = commandObject.examples;
                let currentExamplesString = "";
                for (let x = 0; x < commandObject.examples.length; x++) {
                  currentExamplesString += `${currentExamples[x]} \n`;
                }
                helpEmbed.addField(
                  "Examples:",
                  `${currentExamplesString} `,
                  true
                );
              }

              //...format isn't null,             format isn't a blank string
              if (commandObject.format != null && commandObject.format != "") {
                helpEmbed.addField(
                  "Format:",
                  `!${commandObject.name} ${commandObject.format} `,
                  true
                );
              }

              //...group isn't null (should never miss, all commands need groups to be registered)
              if (commandObject.group != null) {
                helpEmbed.addField("Group:", `${commandObject.group.name} `);
              }

              //break from loop, since command has been found
              hasRun = true;
              break;
            }
          }
          if (hasRun) {
            break;
          }
        }
      }
      if (hasRun) {
        message.channel.send(helpEmbed);
      } else {
        throw 12;
      }
    } catch (err) {
      message.channel.send(errorMod.errorMessage(err, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}

// module.exports = HelpCommand;

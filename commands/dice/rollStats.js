const commando = require("discord.js-commando");
const discord = require("discord.js");
const stats = require("../modules/statsModule");
const errorMod = require("../modules/error");

const attachment = new discord.MessageAttachment("./images/4d6.png", "4d6.png");

class RollStatsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: ["rs"],
      description:
        "Roll 4d6 and drop the lowest roll for a new character's statblock.",
      details: "70: Sets the minimum threshold for the sum of your statblock to 70\nd20: Rolls 6d20 for your statblock\ncth: Rolls a statblock for Call of Cthulhu",
      examples: [
        "!rs",
        "!rollstats",
        "!rollstats 70",
        "!rollstats d20",
        "!rollstats cth"
      ].sort(),
      format: "{70, d20, cth}",
      group: "dice",
      memberName: "rollstats",
      name: "rollstats",
    });
  }
  async run(message, args) {
    message.channel.startTyping();
    var intStrings = ["One", "Two", "Three", "Four", "Five", "Six"];

    var statBlock, embed;
    args = args.toLowerCase();

    try {
      switch (args) {
        case "":
          statBlock = stats.rollStats();
          break;
        case "70":
          statBlock = stats.rollStats("70");
          break;
        case "d20":
          statBlock = stats.rollStats20();
          break;
        case "cth":
          statBlock = stats.rollcth();
          break;
        default:
          throw 5;
      }

      embed = new discord.MessageEmbed()
        .setColor("RANDOM")
        .attachFiles([attachment])
        .setThumbnail("attachment://4d6.png");

      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Stat Block`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Stat Block`, message.author.displayAvatarURL({ dynamic: true }));
      }

      if (args != "cth") {
        var totalSum = 0;
        for (let i = 0; i < statBlock.diceRaw.length; i++) {
          var currentStat = statBlock.diceRaw[i];
          var currentSum = statBlock.diceSums[i] - (args == "d20" ? 0 : Math.min.apply(Math, currentStat));
          totalSum += currentSum;
          embed.addField(
            `__Stat ${intStrings[i]}__`,
            `**${currentSum}**\nFrom [ ${currentStat.join(', ').replace(Math.min.apply(Math, currentStat), `${args == 'd20' ? '' : '~~'}${Math.min.apply(Math, currentStat)}${args == 'd20' ? '' : '~~'}`)} ]\nModifier: __**${stats.getMod(currentSum)}**__`,
            true
          );
        }
        embed.addField(
          `__Stat Check__`,
          `Check Value: __**${totalSum}**__`
        );

      } else {
        embed.addField('__Strength__', `**${(statBlock[0].roll) * 5}**\nFrom: [${statBlock[0].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Constitution__', `**${(statBlock[1].roll) * 5}**\nFrom: [${statBlock[1].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Size__', `**${(statBlock[2].roll + 6) * 5}**\nFrom: [${statBlock[2].diceRaw[0].join(' + ')} **+ 6**] * 5`, true);
        embed.addField('__Dexterity__', `**${(statBlock[3].roll) * 5}**\nFrom: [${statBlock[3].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Appearance__', `**${(statBlock[4].roll) * 5}**\nFrom: [${statBlock[4].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Intelligence__', `**${(statBlock[5].roll + 6) * 5}**\nFrom: [${statBlock[5].diceRaw[0].join(' + ')} **+ 6**] * 5`, true);
        embed.addField('__Power__', `**${(statBlock[6].roll) * 5}**\nFrom: [${statBlock[6].diceRaw[0].join(' + ')}] * 5`, true);
        embed.addField('__Education__', `**${(statBlock[7].roll + 6) * 5}**\nFrom: [${statBlock[7].diceRaw[0].join(' + ')} **+ 6**] * 5`, true);
      }

      message.channel.send(embed).catch(console.error);
    } catch (err) {
      message.channel.send(errorMod.errorMessage(err, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}
// module.exports = RollStatsCommand;

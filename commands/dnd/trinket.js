const { MessageAttachment, MessageEmbed } = require("discord.js");
const trinketMod = require("../modules/trinket");
const errorMod = require("../modules/error");
const { SlashCommand, CommandOptionType } = require("slash-create");
const { ownerTag } = require('../../config.json');
const { readFileSync } = require("fs");

const attachment = new MessageAttachment("./images/bag.png", "bag.png");

class TrinketCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description: `Rolls on a random trinket chart for a random trinket. There are currently ${trinketMod.getChartCount()} charts`,
      name: "trinket",
      options: [{
        type: CommandOptionType.INTEGER,
        name: 'chart',
        description: 'Do you want to use a specific chart?',
        required: false,
        choices: [{
          name: '1',
          value: 1
        }, {
          name: '2',
          value: 2
        }, {
          name: '3',
          value: 3
        }, {
          name: '4',
          value: 4
        }, {
          name: '5',
          value: 5
        }, {
          name: '6',
          value: 6
        }, {
          name: '7',
          value: 7
        }, {
          name: '8',
          value: 8
        }, {
          name: '9',
          value: 9
        }, {
          name: '10',
          value: 10
        }, {
          name: '11',
          value: 11
        }, {
          name: '12',
          value: 12
        }].sort((a, b) => (a.name > b.name) ? 1 : -1)
      }]
    });
  }

  async run(ctx) {
    try {
      await ctx.defer();
      let trinket = trinketMod.getTrinketInfo(ctx.options.chart);
      if (trinket[1] == "") {
        throw 7;
      }
      let embed = new MessageEmbed()
        .addField("**Chart Number:**", `**${trinket[0]}**`)
        .addField("**Trinket**", `**||${trinket[1]}||**`)
        .attachFiles([attachment])
        .setThumbnail("attachment://bag.png")
        .setFooter(
          `If you think anything has an error, message ${ownerTag} with a screenshot and indicate what the error is.`
        )
        .setColor("RANDOM");
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Trinket`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Trinket`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      ctx.send({
        embeds: [embed],
        file: {
          name: `bag.png`,
          file: readFileSync(attachment.attachment)
        }
      });
    } catch (err) {
      ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        file: {
          name: `error.png`,
          file: readFileSync(`./images/error.png`)
        }
      });
    } finally {
      // message.channel.stopTyping();
    }
  }
  async onError(err, ctx) {
    ctx.send(`An error occurred! Here is the message: \`${err}\``);
  }
}

module.exports = TrinketCommand;

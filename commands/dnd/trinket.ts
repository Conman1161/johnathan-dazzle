import { MessageEmbed } from "discord.js";
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext, ComponentType, ButtonStyle } from "slash-create";
import { readFileSync } from "fs";
const trinketMod = require("../modules/trinket");
const errorMod = require("../modules/error");

class TrinketCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
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
        }]
      }],
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    try {
      await ctx.defer();
      let trinket = trinketMod.getTrinketInfo(ctx.options.chart);
      if (trinket[1] == "") {
        throw 7;
      }
      let embed = new MessageEmbed()
        .addField("Chart Number", `**${trinket[0]}**`)
        .addField("Trinket", `${trinket[1]}`)
        .setThumbnail(`attachment://bag.png`)
        .setFooter(
          `If you think anything has an error, message ${process.env.OWNER_TAG} with a screenshot and indicate what the error is.`
        )
        .setColor("RANDOM");
      if (ctx.member) {
        embed.setAuthor(`${ctx.member.displayName}'s Trinket`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Trinket`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      await ctx.send( {
        embeds: [embed.toJSON()],
        file: {
          name: `bag.png`,
          file: readFileSync(`./images/bag.png`)
        },
        components: [{
          type: ComponentType.ACTION_ROW,
          components: [{
            type: ComponentType.BUTTON,
            style: ButtonStyle.PRIMARY,
            label: 'Get a new trinket',
            custom_id: 'new_trinket'
          }]
        }]
      });

      ctx.registerComponent('new_trinket', async (btnCtx) => {
        if(ctx.user.id === btnCtx.user.id){
          // Edit embed to new trinket
          trinket = trinketMod.getTrinketInfo(ctx.options.chart);
          embed.spliceFields(0,2,[
            {
              name: `Chart Number`,
              value: `**${trinket[0]}**`
            },
            {
              name: `Trinket`,
              value: trinket[1]
            }
          ]);
          await btnCtx.editParent({
            embeds: [embed.toJSON()],
            components: [{
              type: ComponentType.ACTION_ROW,
              components: [{
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'Get a new trinket',
                custom_id: 'new_trinket'
              }]
            }]
          });
        }else{
          await btnCtx.defer(true);
          await btnCtx.send('You did not draw this card from the deck, so you do not have permission to get the effect!');
        }
      });
      
    } catch (err) {
      await ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
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

module.exports = TrinketCommand;

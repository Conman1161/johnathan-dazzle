import { MessageEmbed } from "discord.js";
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext, ComponentType, ButtonStyle } from "slash-create";
import { readFileSync } from "fs";
import { errorMessage } from '../modules/error';
import { rollStandardMin, rollStats20, rollcth, rollClassic, rollHeroic, rollDicePool, rollStandard } from '../modules/statsModule';

class RollStatsCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "rollstats",
      description:
        "Roll 4d6 and drop the lowest roll for a new character's statblock",
      options: [{
        type: CommandOptionType.STRING,
        name: "style",
        description: "Not using 4d6kh3? Pick a different rolling style!",
        choices: [
          {
            name: '70 Minimum',
            value: '70'
          },
          {
            name: '6d20',
            value: 'd20'
          },
          {
            name: 'Call of Cthulhu',
            value: 'cth'
          },
          {
            name: 'Pathfinder Classic',
            value: 'classic'
          },
          {
            name: 'Pathfinder Heroic',
            value: 'heroic'
          },
          {
            name: 'Dice Pool',
            value: 'pool'
          },
          {
            name: '4d6kh3 (Default)',
            value: 'standard'
          }
        ].sort((a, b) => (a.name > b.name) ? 1 : -1),
        required: false
      }],
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }
  async run(ctx: CommandContext) {
    try {
      await ctx.defer();

      let embed: MessageEmbed;
      switch (ctx.options.style) {
        case "70":
          embed = rollStandardMin(); // [x]
          break;
        case "d20":
          embed = rollStats20(); // [x]
          break;
        case "cth":
          embed = rollcth(); // [x]
          break;
        case "classic":
          embed = rollClassic(); // [x]
          break;
        case "heroic":
          embed = rollHeroic(); // [x]
          break;
        case "pool":
          embed = rollDicePool(); // [x]
          break;
        case "standard":
        default:
          embed = rollStandard(); // [x]
          break;
      }

      embed.setColor("RANDOM")
        .attachFiles([`./images/4d6.png`])
        .setThumbnail(`attachment://4d6.png`);

      if (ctx.member) {
        embed.setAuthor(`${ctx.member.displayName}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      await ctx.send({
        embeds: [embed.toJSON()],
        file: {
          name: `4d6.png`,
          file: readFileSync(`./images/4d6.png`)
        }, 
        components: [{
          type: ComponentType.ACTION_ROW,
          components: [{
            type: ComponentType.BUTTON,
            style: ButtonStyle.PRIMARY,
            label: 'Reroll',
            custom_id: 'reroll'
          }]
        }]
      });
      ctx.registerComponent('reroll', async (btnCtx) => { 
        if(ctx.user.id === btnCtx.user.id){
          // Reroll a stat block according to ctx, then edit embed accordingly
          switch (ctx.options.style) {
            case "70":
              embed = rollStandardMin(); 
              break;
            case "d20":
              embed = rollStats20(); 
              break;
            case "cth":
              embed = rollcth(); 
              break;
            case "classic":
              embed = rollClassic(); 
              break;
            case "heroic":
              embed = rollHeroic(); 
              break;
            case "pool":
              embed = rollDicePool(); 
              break;
            case "standard":
            default:
              embed = rollStandard(); 
              break;
          }
    
          embed.setColor("RANDOM")
            .setThumbnail(`attachment://4d6.png`);
    
          if (ctx.member) {
            embed.setAuthor(`${ctx.member.displayName}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
          } else {
            embed.setAuthor(`${ctx.user.username}'s Stat Block`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
          }

          btnCtx.editParent({
            embeds: [embed.toJSON()],
            components: [{
              type: ComponentType.ACTION_ROW,
              components: [{
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'Reroll',
                custom_id: 'reroll'
              }]
            }]
          });
        }else{
          await btnCtx.defer(true);
          await btnCtx.send('You are not the person rolling these dice, so you cannot reroll them!');
        }
      });
    } catch (err) {
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
module.exports = RollStatsCommand;

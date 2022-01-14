import { MessageEmbed } from "discord.js";
import { DiceRoll } from 'rpg-dice-roller';
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext, ComponentType, ButtonStyle } from 'slash-create';
import { readFileSync } from "fs";
import { errorMessage } from '../modules/error'

class RollCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'roll',
      description: 'Roll some dice',
      options: [{
        type: CommandOptionType.STRING,
        name: "dice",
        description: 'See https://greenimp.github.io/rpg-dice-roller/guide/notation/ for supported notations',
        required: false
      }],
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    try {
      await ctx.defer();

      let attachPath = `${process.cwd()}/images/d20s/non-transp/`;
      
      let dice = new DiceRoll(ctx.options.dice || "d20");
      let advDice = new DiceRoll(ctx.options.dice || "d20");

      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .addField(`Evaluation:`, dice.output, true)
        .setThumbnail(`attachment://d20${dice.total <= 20 && dice.total >= 1 ? `-${dice.total}.png` : `.png`}`)
        .setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like`);

      //https://cdn.discordapp.com/avatars/{USERID}/{TOKENID}.png
      if (ctx.member) {
        embed.setAuthor(`${ctx.member.displayName}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Die Roll`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      embed.addField(
        `__Dice total__:`,
        `**${dice.total}**`
      );

      await ctx.send({
        embeds: [embed.toJSON()],
        file: {
          name: `d20${dice.total <= 20 && dice.total >= 1 ? `-${dice.total}.png` : `.png`}`,
          file: readFileSync(`${attachPath}${dice.total < 21 && dice.total > 0 ? `d20-${dice.total}.png` : `d20.png`}`)
        },
        components: [{
          type: ComponentType.ACTION_ROW,
          components: [{
            type: ComponentType.BUTTON,
            style: ButtonStyle.PRIMARY,
            label: 'Reroll',
            custom_id: 'reroll'
          },
          {
            type: ComponentType.BUTTON,
            style: ButtonStyle.PRIMARY,
            label: 'Add Advantage Dice',
            custom_id: 'advantage'
          }]
        }]
      });

      ctx.registerComponent('reroll', async (btnCtx) => { 
        if(ctx.user.id === btnCtx.user.id){
          // await btnCtx.defer();
          dice.roll();
          embed.setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like\n\nEmbed thumbnails will show the sum of your original roll (or a ? if it was greater than 20)`);
          if (ctx.member) {
            embed.setAuthor(`${ctx.member.displayName}'s Die Roll (Rerolled)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
          } else {
            embed.setAuthor(`${ctx.user.username}'s Die Roll (Rerolled)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
          }
          embed.spliceFields(0,embed.fields.length);
          embed.setFields(
            [
              {
              name: `Evaluation`,
              value: `${dice.output}`,
              inline: true
            },
            {
              name: `__Dice Total__`,
              value: `**${dice.total.toString()}**`
            }]
          );
          await btnCtx.editParent({
            embeds: [embed.toJSON()],
            components: [{
              type: ComponentType.ACTION_ROW,
              components: [{
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'Reroll',
                custom_id: 'reroll'
              },
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'Add Advantage Dice',
                custom_id: 'advantage',
                disabled: embed.fields.length > 2
              }]
            }]
          });
        }else{
          await btnCtx.defer(true);
          await btnCtx.send('You are not the person rolling these dice, so you cannot reroll them!');
        }
      });

      ctx.registerComponent('advantage', async (btnCtx) => { 
        if(ctx.user.id === btnCtx.user.id){
          let oldOutput = dice.output;
          let oldTotal = dice.total;
          dice.roll();
          embed.setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like\n\nEmbed thumbnails will show the sum of your original roll (or a ? if it was greater than 20)`);
          if (ctx.member) {
            embed.setAuthor(`${ctx.member.displayName}'s Die Roll (Advantage Added)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
          } else {
            embed.setAuthor(`${ctx.user.username}'s Die Roll (Advantage Added)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
          }
          embed.spliceFields(1,embed.fields.length-1);
          embed.setFields([
            {
              name: 'Evaluation:',
              value: oldOutput.toString(),
              inline: true
            },
          {
            name: 'Advantage Evaluation',
            value: dice.output.toString(),
            inline: true
          },
          {
            name: `__Dice Total__`,
            value: (oldTotal + dice.total).toString()
          },
            ]
        );
          await btnCtx.editParent({
            embeds: [embed.toJSON()],
            components: [{
              type: ComponentType.ACTION_ROW,
              components: [{
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'Reroll',
                custom_id: 'adv_reroll',
                // disabled: true
              },
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'Add Advantage Dice',
                custom_id: 'advantage',
                disabled: embed.fields.length > 2
              }]
            }]
          });
        }else{
          await btnCtx.defer(true);
          await btnCtx.send('You are not the person rolling these dice, so you cannot add advantage dice!');
        }
      });

      ctx.registerComponent('adv_reroll', async (btnCtx) => { 
        if(ctx.user.id === btnCtx.user.id){
          dice.roll();
          advDice.roll();
          embed.setFooter(`Need some help understanding your result notation? Use /help roll to find supported notation and what they look like\n\nEmbed thumbnails will show the sum of your original roll (or a ? if it was greater than 20)`);
          if (ctx.member) {
            embed.setAuthor(`${ctx.member.displayName}'s Die Roll (Advantage Added)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
          } else {
            embed.setAuthor(`${ctx.user.username}'s Die Roll (Advantage Added)`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
          }
          embed.spliceFields(0,embed.fields.length);
          embed.addFields(
            {
              name: `Evaluation`,
              value: dice.output,
              inline: true
            },
            {
              name: `Advantage Evaluation`,
              value: advDice.output,
              inline: true
            },
            {
              name: `__Dice Total__`,
              value: (dice.total + advDice.total).toString()
            },
          );
          await btnCtx.editParent({
            embeds: [embed.toJSON()],
            components: [{
              type: ComponentType.ACTION_ROW,
              components: [{
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'Reroll',
                custom_id: 'adv_reroll',
                // disabled: true
              },
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'Add Advantage Dice',
                custom_id: 'advantage',
                disabled: embed.fields.length > 2
              }]
            }]
          });
        }else{
          await btnCtx.defer(true);
          await btnCtx.send('You are not the person rolling these dice, so you cannot add advantage dice!');
        }
      });
    } catch (err: any) {
      ctx.send({
        embeds: [errorMessage(err).toJSON()],
        file: {
          name: 'error.png',
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

module.exports = RollCommand;

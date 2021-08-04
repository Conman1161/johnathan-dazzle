import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext, ComponentType, ButtonStyle } from "slash-create";
import { errorMessage } from '../modules/error'
// const { hostGuildID } = require('../../config.json');

class ExampleCommand extends SlashCommand {
   constructor(creator: SlashCreator) {
      super(creator, {
         description: "A template for commands",
         name: "example",
         options: [{
            name: 'exampleOne',
            description: `Here's an example option with choices`,
            type: CommandOptionType.STRING,
            choices: [{
               name: 'Choice One',
               value: 'I can be lots of things!',
            }].sort((a, b) => (a.name > b.name) ? 1 : -1),
         }],
         // guildIDs: [hostGuildID]
      });
      this.filePath = __filename;
   }

   async run(ctx: CommandContext) {
      try {
         await ctx.defer();
         let embed = new MessageEmbed().setColor('RANDOM');
         embed.setAuthor(`An example title!`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
         await ctx.send({
            embeds: [embed.toJSON()],
            file: {
               name: `fileName.png`,
               file: readFileSync(`filePath`)
            },
            components: [{
               type: ComponentType.ACTION_ROW,
               components: [{
                  type: ComponentType.BUTTON,
                  style: ButtonStyle.PRIMARY,
                  label: 'Primary',
                  custom_id: 'one'
               },{
                  type: ComponentType.BUTTON,
                  style: ButtonStyle.LINK,
                  label: 'Link',
                  url: 'https://github.com/Conman1161/johnathan-dazzle'
               }]
            }]
         });

         ctx.registerComponent('one', async (btnCtx) => {
            if(ctx.user.id === btnCtx.user.id){
               // Do something to the embed here
               // Or something else...
            }else{
               await btnCtx.defer(true);
               await btnCtx.send('You are not the person who originally used this component, so you cannot use this button!');
            }
         });
      } catch (err) {
         await ctx.send({
            embeds: [errorMessage(err).toJSON()],
            file: {
               name: `error.png`,
               file: readFileSync(`./images/error.png`)
            },
            components: [{
               type: ComponentType.ACTION_ROW,
               components: [{
                  type: ComponentType.BUTTON,
                  style: ButtonStyle.PRIMARY,
                  label: 'Primary',
                  custom_id: 'one'
               },{
                  type: ComponentType.BUTTON,
                  style: ButtonStyle.LINK,
                  label: 'Link',
                  url: 'https://github.com/Conman1161/johnathan-dazzle'
               }]
            }]
         });
      } finally {
      }
   }
   async onError(err: any, ctx: CommandContext) {
      await ctx.send(`An error occurred! Here is the message: \`${err}\``);
   }
}

// module.exports = ExampleCommand;
const { MessageEmbed } = require("discord.js");
const { readFileSync } = require("fs");
const { SlashCommand, CommandOptionType } = require("slash-create");
const errorMod = require('../modules/error');
// const { hostGuildID } = require('../../config.json');

class ExampleCommand extends SlashCommand {
   constructor(client) {
      super(client, {
         description: "A template for commands",
         name: "example",
         options: [{
            name: 'exampleOne',
            description: `Here's an example option with choices`,
            type: CommandOptionType.STRING,
            choices: [{
               name: 'Choice One',
               description: 'My name can be capitalized and have spaces!'
            }].sort((a, b) => (a.name > b.name) ? 1 : -1),
            // guildIDs: [hostGuildID]
         }]
      });
      this.filePath = __filename;
   }

   async run(ctx) {
      try {
         await ctx.defer();
         let embed = new MessageEmbed().setColor('RANDOM');
         embed.setTitle(`An example title!`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
         return {
            embeds: [embed],
            file: {
               name: `fileName.png`,
               file: readFileSync(`filePath`)
            }
         };
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
   async onError(err, ctx) {
      await ctx.send(`An error occurred! Here is the message: \`${err}\``);
   }
}

// module.exports = ExampleCommand;
import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from "slash-create";
import { errorMessage } from '../modules/error'

let maxChars: number = 5; // int

class CharactersCommand extends SlashCommand {
   constructor(creator: SlashCreator) {
      super(creator, {
         description: "Interact with your characters, or make a new one!",
         name: "character",
         options: [{
            name: 'new',
            description: `Create a new character! (Max ${maxChars.toString()} characters)`,
            type: CommandOptionType.SUB_COMMAND
         }],
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
            }
         });

      } catch (err: any) {
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

module.exports = CharactersCommand;
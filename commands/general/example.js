const { SlashCommand, CommandOptionType } = require("slash-create");
const errorMod = require('../modules/error');

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
            }].sort((a, b) => (a.name > b.name) ? 1 : -1)
         }]
      });
   }

   async run(ctx) {
      try {
         await ctx.defer();
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
   async onError(err, ctx) {
      ctx.send(`An error occurred! Here is the message: \`${err}\``);
   }
}

// module.exports = ExampleCommand;

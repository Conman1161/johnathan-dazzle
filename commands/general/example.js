const commando = require("discord.js-commando");
const errorMod = require('../modules/error');

class ExampleCommand extends commando.Command {
   constructor(client) {
      super(client, {
         aliases: [],
         description: "A template for commands",
         examples: ["!example"].sort(),
         format: "",
         group: "Example",
         memberName: "Example",
         name: "Example",
      });
   }

   async run(message) {
      message.channel.startTyping();
      try {

      } catch (err) {
         message.channel.send(errorMod.errorMessage(err, message));
      } finally { message.channel.stopTyping(); }
   }
}

// module.exports = ExampleCommand;

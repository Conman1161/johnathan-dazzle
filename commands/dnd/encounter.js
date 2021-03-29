const commando = require("discord.js-commando");
const discord = require("discord.js");
const dice = require("dice-expression-evaluator");
const errorMod = require("../modules/error");

const encountersDir = `${process.cwd()}/commands/dnd/charts/encounters/`;

const attachment = new discord.MessageAttachment("./images/encounter.png", "encounter.png");

class EncounterCommand extends commando.Command {
   constructor(client) {
      super(client, {
         aliases: [],
         description: ``,
         examples: ["!encounter", "!encounter city", "!encounter city show"].sort(),
         format: "{Encounter Type} {Show}",
         group: "dnd",
         memberName: "encounter",
         name: "encounter",
      });
   }

   async run(message, args) {
      message.channel.startTyping();
      //put args in var, see if(!args) to roll for table
      try {
         args = args.split(' ');
         if (args[1]) args[1] = args[1].replace(/\s/g, '');
         var encounters = require(`${encountersDir}/${args[0]}.json`);
         const diceExpr = new dice(`d${Object.keys(encounters).length}`);
         var embed = new discord.MessageEmbed()
            .setAuthor("A new encounter appears!", message.client.user.displayAvatarURL({ dynamic: true }))
            .addField(`**Here's the deal...**`, `${encounters[diceExpr.roll().roll]}`)
            .attachFiles([attachment])
            .setThumbnail("attachment://encounter.png")
            .setFooter(
               `If you think anything has an error, message ${message.client.owners[0].tag} with a screenshot and indicate what the error is.`
            )
            .setColor("RANDOM");
         if (args[1] == "show" || message.channel.type == "dm") {
            message.channel.send(embed);
         } else {
            await message.author.send(embed);
            message.reply("I just messaged you your encounter!");
         }

      } catch (err) {
         if (err.code === "MODULE_NOT_FOUND") {
            message.channel.send(errorMod.errorMessage(21, message));
         } else {
            message.channel.send(errorMod.errorMessage(err, message));
         }
      } finally {
         message.channel.stopTyping();
      }
   }
}

// module.exports = EncounterCommand;

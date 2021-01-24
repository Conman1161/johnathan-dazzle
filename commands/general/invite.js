const commando = require("discord.js-commando");
const discord = require("discord.js");
const attachment = new discord.MessageAttachment(
   "./images/support.png",
   "support.png"
);

class BotInfoCommand extends commando.Command {
   constructor(client) {
      super(client, {
         aliases: [],
         description: "Get a link to invite Dazzle to your server",
         examples: ["!invite"].sort(),
         format: "",
         group: "general",
         memberName: "invite",
         name: "invite",
      });
   }

   async run(message) {
      message.channel.startTyping();
      var embed = new discord.MessageEmbed()
         .setAuthor("Invite", message.client.user.displayAvatarURL({ dynamic: true }))
         .addField(
            `Link`,
            `The invite for Dazzle can be found [here](https://discord.com/oauth2/authorize?client_id=484780670556831763&permissions=117760&scope=bot "Click me, I invite Dazzle!")!`
         )
         .setColor("#fe00ff")
         .attachFiles([attachment])
         .setURL("https://discord.gg/ZUJAMnh")
         .setThumbnail("attachment://support.png");

      message.channel.send(embed);
      message.channel.stopTyping();
   }
}

module.exports = BotInfoCommand;

const { MessageAttachment, MessageEmbed } = require("discord.js");
const { readFileSync } = require("fs");
const { SlashCommand } = require("slash-create");
const attachment = new MessageAttachment(
   "./images/support.png",
   "support.png"
);

class InviteBotCommand extends SlashCommand {
   constructor(client) {
      super(client, {
         description: "Get a link to invite Dazzle to your server",
         name: "invite",
      });
   }

   async run(ctx) {
      let embed = new MessageEmbed()
         .setAuthor("Invite", `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
         .addField(
            `Link`,
            `The invite for Dazzle can be found [here](https://discord.com/api/oauth2/authorize?client_id=484780670556831763&permissions=2147535872&scope=bot%20applications.commands "Click me, I invite Dazzle!")!`
         )
         .setColor("#fe00ff")
         .attachFiles([attachment])
         .setURL("https://discord.gg/ZUJAMnh")
         .setThumbnail("attachment://support.png");

      ctx.send({
         embeds: [embed],
         file: {
            name: 'support.png',
            file: readFileSync(attachment.attachment)
         }
      });
   }
}

module.exports = InviteBotCommand;

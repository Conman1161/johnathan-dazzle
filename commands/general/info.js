const commando = require("discord.js-commando");
const discord = require("discord.js");
const { version } = require("../../package.json");
const { catboy } = require('../../config.json');
const owoify = require('owoifyx');
const attachment = new discord.MessageAttachment(
  catboy ? "./images/catboy/Background.png" : "./images/icon.png",
  "icon.png"
);

class BotInfoCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description: "A little information Johnathon Dazzle.",
      examples: ["!info"].sort(),
      format: "",
      group: "general",
      memberName: "info",
      name: "info",
    });
  }

  async run(message) {
    message.channel.startTyping();
    var myInfo = new discord.MessageEmbed()
      .setAuthor(`${catboy ? owoify('Johnathan Dazzle') : 'Johnathan Dazzle'}`, message.client.user.displayAvatarURL({ dynamic: true }))
      .addField(
        `${catboy ? `${owoify('Bot Info')}` : `Bot Info`}`,
        `${catboy ? `${owoify(`Hello, I'm Johnathon Dazzle! I roll the dice around here. I've got a few tricks up my sleeve, so check them out with`)}` : `Hello, I'm Johnathon Dazzle! I roll the dice around here. I've got a few tricks up my sleeve, so check them out with`} \`!help\`!`
      )
      .addField(
        `${catboy ? `${owoify(`__**WORK IN PROGRESS**__`)}` : `__**WORK IN PROGRESS**__`}`,
        `${catboy ? `${owoify(`Dazzle is currently in a **Work in Progress** state, meaning some functions and features are not finished or completely implemented yet. Please keep this in mind when using Dazzle`)}` : `Dazzle is currently in a **Work in Progress** state, meaning some functions and features are not finished or completely implemented yet. Please keep this in mind when using Dazzle`}`
      )
      .addField(
        `${catboy ? `${owoify(`Bot Support`)}` : `Bot Support`}`,
        `${catboy ? `${owoify(`If you find an issue, message __**${message.client.owners[0].tag}**__ with a screenshot and a short description of the issue`)}` : `If you find an issue, message __**${message.client.owners[0].tag}**__ with a screenshot and a short description of the issue`}`,
        true
      )
      .addField(
        `${catboy ? `${owoify(`Command Ideas`)}` : `Command Ideas`}`,
        `${catboy ? `${owoify(`If you have any ideas for commands, message __**${message.client.owners[0].tag}**__ with them`)}` : `If you have any ideas for commands, message __**${message.client.owners[0].tag}**__ with them`}`,
        true
      )
      .addField(
        `${catboy ? `${owoify(`Bot Version`)}` : `Bot Version`}`,
        `${catboy ? `${owoify(`Currently running v**${version}**`)}` : `Currently running v**${version}**`}`)
      .addField(
        "Artwork/Assets",
        'All artwork has been commissioned and made by **Kai**. They can be found on [`Twitter`](https://twitter.com/ckttle_ "@ckttle_") and [`Instagram`](https://instagram.com/ckttle "@ckttle").'
      )
      .setColor(catboy ? "#e073c1" : "#fe00ff")
      .attachFiles([attachment])
      .setThumbnail("attachment://icon.png");

    message.channel.send(myInfo);
    message.channel.stopTyping();
  }
}

// module.exports = BotInfoCommand;

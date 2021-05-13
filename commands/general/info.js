const { MessageEmbed } = require("discord.js");
const { version } = require("../../package.json");
const { catboy, ownerTag, /* hostGuildID */ } = require('../../config.json');
const owoify = require('owoifyx');
const { SlashCommand, CommandOptionType } = require("slash-create");
const { readFileSync } = require("fs");

class BotInfoCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description: "A little information Johnathon Dazzle",
      name: "info",
      options: [{
        name: 'force_catboy',
        description: 'Force the help command into catboy mode. You did this to yourself',
        type: CommandOptionType.BOOLEAN
      }]
      // guildIDs: [hostGuildID]
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    await ctx.defer();
    let myInfo = new MessageEmbed()
      .setAuthor(`${catboy || ctx.options.force_catboy ? owoify('Johnathan Dazzle') : 'Johnathan Dazzle'}`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
      .addField(
        `${catboy || ctx.options.force_catboy ? `${owoify('Bot Info')}` : `Bot Info`}`,
        `${catboy || ctx.options.force_catboy ? `${owoify(`Hello, I'm Johnathon Dazzle! I roll the dice around here. I've got a few tricks up my sleeve, so check them out with`)}` : `Hello, I'm Johnathon Dazzle! I roll the dice around here. I've got a few tricks up my sleeve, so check them out with`} \`/help\`!`
      )
      .addField(
        `${catboy || ctx.options.force_catboy ? `${owoify(`__**WORK IN PROGRESS**__`)}` : `__**WORK IN PROGRESS**__`}`,
        `${catboy || ctx.options.force_catboy ? `${owoify(`Dazzle is currently in development, meaning some functions and features are not finished or completely implemented yet. Please keep this in mind when using Dazzle`)}` : `Dazzle is currently in development, meaning some functions and features are not finished or completely implemented yet. Please keep this in mind when using Dazzle`}`
      )
      .addField(
        `${catboy || ctx.options.force_catboy ? `${owoify(`Bot Support`)}` : `Bot Support`}`,
        `${catboy || ctx.options.force_catboy ? `${owoify(`If you find an issue, message __**${ownerTag}**__ with a screenshot and a short description of the issue or join`)} [this](https://discord.gg/ZUJAMnh) ${owoify('discord server')}`
          : `If you find an issue, message __ ** ${ownerTag}** __ with a screenshot and a short description of the issue or join [this](https://discord.gg/ZUJAMnh) discord server`}`,
        true
      )
      .addField(
        `${catboy || ctx.options.force_catboy ? `${owoify(`Command Ideas`)}` : `Command Ideas`} `,
        `${catboy || ctx.options.force_catboy ? `${owoify(`If you have any ideas for commands, message __**${ownerTag}**__ with them`)}` : `If you have any ideas for commands, message __**${ownerTag}**__ with them`} `,
        true
      )
      .addField(
        `${catboy || ctx.options.force_catboy ? `${owoify(`Bot Version`)}` : `Bot Version`} `,
        `${catboy || ctx.options.force_catboy ? `${owoify(`Currently running v**${version}**`)}` : `Currently running v**${version}**`} `)
      .addField(
        "Artwork/Assets",
        'All artwork has been commissioned and made by **Kai**. They can be found on [`Twitter`](https://twitter.com/ckttle_ "@ckttle_") and [`Instagram`](https://instagram.com/ckttle "@ckttle").'
      )
      .setColor(catboy || ctx.options.force_catboy ? "#e073c1" : "#fe00ff")
      .attachFiles([catboy || ctx.options.force_catboy ? "./images/catboy/Background.png" : "./images/icon.png"])
      .setThumbnail(`attachment://${catboy || ctx.options.force_catboy ? "Background.png" : "icon.png"}`);

    return {
      embeds: [myInfo],
      file: {
        name: `${catboy || ctx.options.force_catboy ? 'Background.png' : 'icon.png'}`,
        file: readFileSync(catboy || ctx.options.force_catboy ? `./images/catboy/Background.png` : `./images/icon.png`)
      }
    };
  }
}

module.exports = BotInfoCommand;

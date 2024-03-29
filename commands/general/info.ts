import { MessageEmbed } from "discord.js";
import { version } from "../../package.json";
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext, ComponentType, ButtonStyle } from "slash-create";
import { readFileSync } from "fs";
const owoify = require('owoifyx');

class BotInfoCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
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

  async run(ctx: CommandContext) {
    await ctx.defer();
    let catboy = process.env.CATBOY == 'true' || ctx.options.force_catboy === true;
    let embed = new MessageEmbed()
      .setAuthor(`${catboy ? owoify('Johnathan Dazzle') : 'Johnathan Dazzle'}`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`)
      .addField(
        `${catboy ? `${owoify('Bot Info')}` : `Bot Info`}`,
        `${catboy ? `${owoify(`Hello, I'm Johnathon Dazzle! I roll the dice around here. I've got a few tricks up my sleeve, so check them out with`)}` : `Hello, I'm Johnathon Dazzle! I roll the dice around here. I've got a few tricks up my sleeve, so check them out with`} \`/help\`!`
      )
      .addField(
        `${catboy ? `${owoify(`__**WORK IN PROGRESS**__`)}` : `__**WORK IN PROGRESS**__`}`,
        `${catboy ? `${owoify(`Dazzle is currently in development, meaning some functions and features are not finished or completely implemented yet. Please keep this in mind when using Dazzle`)}` : `Dazzle is currently in development, meaning some functions and features are not finished or completely implemented yet. Please keep this in mind when using Dazzle`}`
      )
      .addField(
        `${catboy ? `${owoify(`Bot Support`)}` : `Bot Support`}`,
        `${catboy ? `${owoify(`If you find an issue, message __**${process.env.OWNER_TAG}**__ with a screenshot and a short description of the issue or join`)} [this](https://discord.gg/ZUJAMnh) ${owoify('discord server')}`
          : `If you find an issue, message __ ** ${process.env.OWNER_TAG}** __ with a screenshot and a short description of the issue or join [this](https://discord.gg/ZUJAMnh) discord server`}`,
        true
      )
      .addField(
        `${catboy ? `${owoify(`Command Ideas`)}` : `Command Ideas`} `,
        `${catboy ? `${owoify(`If you have any ideas for commands, message __**${process.env.OWNER_TAG}**__ with them`)}` : `If you have any ideas for commands, message __**${process.env.OWNER_TAG}**__ with them`} `,
        true
      )
      .addField(
        `${catboy ? `${owoify(`Bot Version`)}` : `Bot Version`} `,
        `${catboy ? `${owoify(`Currently running v**${version}**`)}` : `Currently running v**${version}**`} `)
      .addField(
        "Artwork/Assets",
        'All artwork has been commissioned and made by **Kai**. They can be found on [`Twitter`](https://twitter.com/ckttle_ "@ckttle_") and [`Instagram`](https://instagram.com/ckttle "@ckttle").'
      )
      .setColor(catboy ? "#e073c1" : "#fe00ff")
      .setThumbnail(`attachment://${catboy ? "Background.png" : "icon.png"}`);

    await ctx.send( {
      embeds: [embed.toJSON()],
      file: {
        name: `${catboy ? 'Background.png' : 'icon.png'}`,
        file: readFileSync(catboy ? `./images/catboy/Background.png` : `./images/icon.png`)
      },
      components: [{
        type: ComponentType.ACTION_ROW,
        components: [{
          type: ComponentType.BUTTON,
          style: ButtonStyle.LINK,
          label: 'Support Discord Server',
          url: 'https://discord.gg/ZUJAMnh'
        },
        {
          type: ComponentType.BUTTON,
          style: ButtonStyle.LINK,
          label: 'Dazzle Invite link',
          url: 'https://discord.com/oauth2/authorize?client_id=484780670556831763&permissions=2147609600&scope=bot%20applications.commands'
        },
        {
          type: ComponentType.BUTTON,
          style: ButtonStyle.LINK,
          label: 'Github Repository',
          url: 'https://github.com/Conman1161/johnathan-dazzle'
        },
        {
          type: ComponentType.BUTTON,
          style: ButtonStyle.LINK,
          label: 'Message Conman for Support',
          url: 'discord://-/users/103639985294442496'
        }]
      }]
    });
  }
}

module.exports = BotInfoCommand;

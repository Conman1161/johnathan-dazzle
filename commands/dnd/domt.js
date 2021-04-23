const errorMod = require('../modules/error');
const domtMod = require('../modules/domt');
const imageDir = `${process.cwd()}/images/domt/`;
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { SlashCommand, CommandOptionType } = require("slash-create");
const { readFileSync } = require('fs');

class DoMTCommand extends SlashCommand {
  constructor(client) {
    super(client, {
      description: "Draws a card from the Deck of Many Things",
      name: "domt",
      options: [{
        type: CommandOptionType.SUB_COMMAND,
        name: 'draw',
        description: 'Draw a card from the Deck of Many Things',
        required: false,
        options: [{
          type: CommandOptionType.STRING,
          name: 'deck',
          description: 'Which deck do you want to draw from?',
          required: true,
          choices: [{
            name: '13 Card Deck',
            value: '13'
          }, {
            name: '22 Card Deck',
            value: '22'
          }].sort((a, b) => (a.name > b.name) ? 1 : -1)
        }]
      }, {
        type: CommandOptionType.SUB_COMMAND,
        name: 'lookup',
        description: 'Lookup one of the cards in the Deck of Many Things',
        required: false,
        options: [{
          type: CommandOptionType.STRING,
          name: 'card',
          description: 'Which card are you looking for?',
          required: true,
          choices: [{
            name: 'Euryale',
            value: 'Euryale'
          }, {
            name: 'Flames',
            value: 'Flames'
          }, {
            name: 'Jester',
            value: 'Jester'
          }, {
            name: 'Key',
            value: 'Key'
          }, {
            name: 'Knight',
            value: 'Knight'
          }, {
            name: 'Moon',
            value: 'Moon'
          }, {
            name: 'Rogue',
            value: 'Rogue'
          }, {
            name: 'Ruin',
            value: 'Ruin'
          }, {
            name: 'Skull',
            value: 'Skull'
          }, {
            name: 'Star',
            value: 'Star'
          }, {
            name: 'Sun',
            value: 'Sun'
          }, {
            name: 'The Void',
            value: 'The Void'
          }, {
            name: 'Throne',
            value: 'Throne'
          }, {
            name: 'Balance',
            value: 'Balance'
          }, {
            name: 'Comet',
            value: 'Comet'
          }, {
            name: 'Donjon',
            value: 'Donjon'
          }, {
            name: 'Fool',
            value: 'Fool'
          }, {
            name: 'Gem',
            value: 'Gem'
          }, {
            name: 'Idiot',
            value: 'Idiot'
          }, {
            name: 'Talons',
            value: 'Talons'
          }, {
            name: 'The Fates',
            value: 'The Fates'
          }, {
            name: 'Vizier',
            value: 'Vizier'
          }].sort((a, b) => (a.name > b.name) ? 1 : -1)
        }]
      }]
    });
  }

  async run(ctx) {
    try {
      await ctx.defer();

      let embed = new MessageEmbed().setColor('RANDOM');
      if (ctx.guildID) {
        embed.setAuthor(`${ctx.member.displayName}'s Card`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      } else {
        embed.setAuthor(`${ctx.user.username}'s Card`, `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`);
      }

      // subcommand switch statement
      switch (Object.keys(ctx.options)[0]) {
        case 'draw':
          let card = domtMod.draw(ctx.options.draw.deck);
          let attachmentDraw = new MessageAttachment(`${imageDir}${card.replace(' ', '')}.png`, `${card.replace(' ', '')}.png`);
          embed.attachFiles(attachmentDraw);
          embed.addField('Card: ', card);
          embed.setImage(`attachment://${card.replace(' ', '')}.png`);
          console.log(card);
          break;
        case 'lookup':
          let effect = domtMod.lookup(ctx.options.lookup.card);
          let attachmentLookup = new MessageAttachment(`${imageDir}${ctx.options.lookup.card.replace(' ', '')}.png`, `${ctx.options.lookup.card.replace(' ', '')}.png`);
          embed.attachFiles(attachmentLookup);
          embed.addField('Card: ', ctx.options.lookup.card);
          embed.addField('Effect: ', effect);
          embed.setImage(`attachment://${ctx.options.lookup.card.replace(' ', '')}.png`);
          break;
      }

      ctx.send({
        embeds: [embed],
        file: {
          name: `${embed.image.url.replace('attachment://', '')}`,
          file: readFileSync(`./images/domt/${embed.image.url.replace('attachment://', '')}`)
        }
      });
    } catch (err) {
      ctx.send({
        embeds: [errorMod.errorMessage(err, ctx)],
        file: {
          name: `error.png`,
          file: readFileSync(`./images/error.png`)
        }
      });
    } finally {
      // message.channel.stopTyping();
    }
  }
  async onError(err, ctx) {
    ctx.send(`An error occurred! Here is the message: \`${err}\``);
  }
}

module.exports = DoMTCommand;

const commando = require("discord.js-commando");
const dice = require('dice-expression-evaluator');
const errorMod = require('../modules/error');
const domtMod = require('../modules/domt');
const deckThirteen = ["Sun", "Moon", "Star", "Throne", "Key", "Knight", "The Void", "Flames", "Skull", "Ruin", "Euryale", "Rogue", "Jester"].sort();
const deckTwentyTwo = ["Vizier", "Comet", "The Fates", "Gem", "Talons", "Idiot", "Donjon", "Balance", "Fool"].sort();
const deckMaster = deckThirteen.concat(deckTwentyTwo);
const imageDir = `${process.cwd()}/images/domt/`;
const cards = require('./charts/domt/cards.json');
const { MessageEmbed, MessageAttachment } = require("discord.js");

class DoMTCommand extends commando.Command {
  constructor(client) {
    super(client, {
      aliases: [],
      description: "Draws a card from the Deck of Many Things. Draws from the 13 card list by default. Enter a card name to get the effect.",
      examples: ["!domt", "!domt", "!domt 22", "!domt {card name}"].sort(),
      format: "",
      group: "dnd",
      memberName: "domt",
      name: "domt"
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    try {
      args = args.toLowerCase();
      var pool = [];
      pool = pool.concat(deckThirteen);
      if (args == "22") {
        pool = pool.concat(deckTwentyTwo);
      }

      var embed = new MessageEmbed().setColor('RANDOM');
      if (message.channel.type == "dm") {
        embed.setAuthor(`${message.author.username}'s Draw`, message.author.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setAuthor(`${message.member.nickname == null ? `${message.author.username}` : `${message.member.nickname}`}'s Draw`, message.author.displayAvatarURL({ dynamic: true }));
      }

      // if default or 22, roll for card
      if (args == "" || args == "22") {
        const card = domtMod.roll(pool);
        const attachment = new MessageAttachment(`${imageDir}${card[0].replace(' ', '')}.png`, `${card[0].replace(' ', '')}.png`);
        embed.attachFiles(attachment);
        embed.addField('Card: ', deckMaster[card[1]]);
        embed.setImage(`attachment://${card[0].replace(' ', '')}.png`);
        if (card[0] == "Fool" || card[0] == "Jester") {
          embed.setFooter('If you\'ve already drawn this card, draw again');
        }
      }
      // if card in all cards, send effect
      else if (args in cards) {
        const card = domtMod.lookup(args);
        const attachment = new MessageAttachment(`${imageDir}${deckMaster[card[1]].replace(' ', '')}.png`, `${deckMaster[card[1]].replace(' ', '')}.png`);
        embed.attachFiles(attachment);
        embed.addField('Card: ', deckMaster[card[1]]);
        embed.addField('Effect: ', card[0]);
        embed.setImage(`attachment://${deckMaster[card[1]].replace(' ', '')}.png`);
      } else {
        throw 22;
      }
      message.channel.send(embed);
    } catch (error) {
      message.channel.send(errorMod.errorMessage(error, message));
    } finally {
      message.channel.stopTyping();
    }
  }
}

// module.exports = DoMTCommand;

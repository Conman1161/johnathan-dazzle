const Commando = require("discord.js-commando");
const Config = require("./config.json");
const Discord = require('discord.js');
const Client = new Discord.Client();
const Bot = new Commando.Client({
  owner: Config.owner
});

const io = require('@pm2/io');
const { GatewayServer, SlashCreator } = require("slash-create");
var guildCount = io.metric({
  name: 'Guild count: '
});


const Creator = new SlashCreator({
  applicationID: Config.appID,
  publicKey: Config.publicKey,
  token: Config.token
});
Creator.registerCommandsIn(`${__dirname}/commands/temp`).syncCommands();

Creator.withServer(
  new GatewayServer(
    (handler) => Bot.ws.on('INTERACTION_CREATE', handler)
  )
);

Creator.on('debug', m => console.log('slash-create debug:', m));
Creator.on('warn', m => console.log('slash-create warn:', m));
Creator.on('error', m => console.error('slash-create error: ', m));


// Bot.registry.registerDefaultTypes(`${__dirname}/commands"`);

// Bot.registry.registerGroup("characters", "Characters");
// Bot.registry.registerGroup("dice", "Dice");
// Bot.registry.registerGroup("dnd", "DnD");
// Bot.registry.registerGroup("general", "General");
// //Bot.registry.registerCommandsIn(`${__dirname}/commands`);

// Bot.registry.registerDefaultGroups();
// Bot.registry.registerDefaultCommands({
//   help: false,
//   unknownCommand: false,
//   eval: false,
// });


Bot.on("ready", function () {
  Bot.user.setPresence({
    activity: {
      name: `${Config.presenceText}`,
      type: "PLAYING"
    },
    status: `${Config.presenceStatus}`
  });

  console.log(`${Bot.settings.client.user.username} live on ${process.env.USERDOMAIN}`);
  console.log(`Currently live in ${Bot.guilds.cache.size} guilds: `);
  var allGuilds = Bot.guilds.cache.entries();
  for (var i = 0; i < Bot.guilds.cache.size; i++) {
    console.log(`- ${allGuilds.next().value[1].name}`);
  }
  guildCount.set(Bot.guilds.cache.size);
  //Bot.guilds.find("id", '').leave();
});

Bot.on("guildCreate", guild => {
  console.log(`Joined a new guild: ${guild.name}. New guild count: ${Bot.guilds.cache.size}`);
  guildCount.set(Bot.guilds.cache.size);
});

Bot.on("guildDelete", guild => {
  console.log(`Left a guild: ${guild.name}. New guild count: ${Bot.guilds.cache.size}`);
  guildCount.set(Bot.guilds.cache.size);
});

Bot.login(Config.token);

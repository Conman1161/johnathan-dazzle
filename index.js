const { Client } = require("discord.js-commando");
let { owner, appID, publicKey, token, presenceStatus, presenceText } = require('./config.json');
const Bot = new Client({
  owner: owner
});

const io = require('@pm2/io');
const { GatewayServer, SlashCreator } = require("slash-create");
let guildCount = io.metric({
  name: 'Guild count: '
});


const Creator = new SlashCreator({
  applicationID: appID,
  publicKey: publicKey,
  token: token
});
// Creator.registerCommandsIn(`${__dirname}/commands/characters`).syncCommands();
Creator.registerCommandsIn(`${__dirname}/commands/dice`);
Creator.registerCommandsIn(`${__dirname}/commands/dnd`);
Creator.registerCommandsIn(`${__dirname}/commands/general`);
Creator.syncCommands();

Creator.withServer(
  new GatewayServer(
    (handler) => Bot.ws.on('INTERACTION_CREATE', handler)
  )
);

Creator.on('debug', m => console.log('slash-create debug:', m));
Creator.on('warn', m => console.log('slash-create warn:', m));
Creator.on('error', m => console.error('slash-create error: ', m));


Bot.on("ready", function () {
  Bot.user.setPresence({
    activity: {
      name: `${presenceText}`,
      type: "PLAYING"
    },
    status: `${presenceStatus}`
  });

  console.log(`${Bot.settings.client.user.username} live on ${process.env.USERDOMAIN}`);
  console.log(`Currently live in ${Bot.guilds.cache.size} guilds: `);
  let allGuilds = Bot.guilds.cache.entries();
  for (let i = 0; i < Bot.guilds.cache.size; i++) {
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

Bot.login(token);
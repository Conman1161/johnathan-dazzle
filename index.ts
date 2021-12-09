import { Guild, Client } from "discord.js";
import { GatewayServer, SlashCreator } from "slash-create";
import io from '@pm2/io'
import dotenv from 'dotenv';

dotenv.config();
const Bot = new Client({
  intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'DIRECT_MESSAGES'],
  presence: {
    status: 'online',
    activities: [{
      name: process.env.PRESENCE_TEXT,
      type: 'PLAYING'
    }]
  }
});

let guildCount = io.metric({
  name: 'Guild count: '
});

const Creator = new SlashCreator({
  applicationID: process.env.APP_ID!,
  token: process.env.TOKEN
});
// Creator.registerCommandsIn(`${__dirname}/commands/characters`);
Creator.registerCommandsIn(`${__dirname}/commands/dice`);
Creator.registerCommandsIn(`${__dirname}/commands/dnd`);
Creator.registerCommandsIn(`${__dirname}/commands/general`);
Creator.registerCommandsIn(`${__dirname}/commands/characters`);
Creator.syncCommands();

Creator.withServer(
  new GatewayServer(
    (handler: Function) => {
      Bot.ws.on('INTERACTION_CREATE', (data) => {handler(data)})
    }
  )
);

Creator.on('debug', (m: Object) => console.log('slash-create debug:', m));
Creator.on('warn', (m: Object) => console.log('slash-create warn:', m));
Creator.on('error', (m: Object) => console.error('slash-create error: ', m));
// Creator.on('rawREST', (m: Object) => console.log('slash-create REST: ', m));

Bot.on("ready", function () {

  console.log(`${Bot.user!.username} live on ${process.env.USERDOMAIN}`);
  console.log(`Currently live in ${Bot.guilds.cache.size} guilds: `);
  Bot.guilds.cache.forEach((server: Guild) => {
    console.log(`- ${server.name} : ${server.id}`);
  });
  guildCount.set(Bot.guilds.cache.size);
  //Bot.guilds.find("id", '').leave();
});

Bot.on("guildCreate", (guild: Guild) => {
  console.log(`Joined a new guild: ${guild.name}. New guild count: ${Bot.guilds.cache.size}`);
  guildCount.set(Bot.guilds.cache.size);
});

Bot.on("guildDelete", (guild: Guild) => {
  console.log(`Left a guild: ${guild.name}. New guild count: ${Bot.guilds.cache.size}`);
  guildCount.set(Bot.guilds.cache.size);
});

Bot.login(process.env.TOKEN);
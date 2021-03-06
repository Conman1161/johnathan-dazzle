import { Guild, PresenceData } from "discord.js";
import { Client } from "discord.js-commando";
import io from '@pm2/io';
import { GatewayServer, SlashCreator } from "slash-create";

import { owner, appID, token, presenceText } from './config.json';
const Bot = new Client({
  owner: owner
});


let guildCount = io.metric({
  name: 'Guild count: '
});


const Creator = new SlashCreator({
  applicationID: appID,
  token: token
});
// Creator.registerCommandsIn(`${__dirname}/commands/characters`).syncCommands();
Creator.registerCommandsIn(`${__dirname}/commands/dice`);
Creator.registerCommandsIn(`${__dirname}/commands/dnd`);
Creator.registerCommandsIn(`${__dirname}/commands/general`);
Creator.syncCommands();

Creator.withServer(
  new GatewayServer(
    (handler: Function) => {
      Bot.ws.on('INTERACTION_CREATE', handler)
    }
  )
);

Creator.on('debug', (m: Object) => console.log('slash-create debug:', m));
Creator.on('warn', (m: Object) => console.log('slash-create warn:', m));
Creator.on('error', (m: Object) => console.error('slash-create error: ', m));
// Creator.on('rawREST', (m: Object) => console.log('slash-create REST: ', m));

Bot.on("ready", function () {
  let status: PresenceData = {
      activity: {
        name: `${presenceText}`,
        type: "PLAYING"
      },
      status: 'online'
  };
  Bot.user!.setPresence(status);

  console.log(`${Bot.settings.client.user!.username} live on ${process.env.USERDOMAIN}`);
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

Bot.login(token);
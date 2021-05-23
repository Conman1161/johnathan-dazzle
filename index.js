"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const io_1 = __importDefault(require("@pm2/io"));
const slash_create_1 = require("slash-create");
const config_json_1 = require("./config.json");
const Bot = new discord_js_commando_1.Client({
    owner: config_json_1.owner
});
let guildCount = io_1.default.metric({
    name: 'Guild count: '
});
const Creator = new slash_create_1.SlashCreator({
    applicationID: config_json_1.appID,
    token: config_json_1.token
});
// Creator.registerCommandsIn(`${__dirname}/commands/characters`).syncCommands();
Creator.registerCommandsIn(`${__dirname}/commands/dice`);
Creator.registerCommandsIn(`${__dirname}/commands/dnd`);
Creator.registerCommandsIn(`${__dirname}/commands/general`);
Creator.syncCommands();
Creator.withServer(new slash_create_1.GatewayServer((handler) => {
    Bot.ws.on('INTERACTION_CREATE', handler);
}));
Creator.on('debug', (m) => console.log('slash-create debug:', m));
Creator.on('warn', (m) => console.log('slash-create warn:', m));
Creator.on('error', (m) => console.error('slash-create error: ', m));
Creator.on('rawREST', (m) => console.log('slash-create REST: ', m));
Bot.on("ready", function () {
    let status = {
        activity: {
            name: `${config_json_1.presenceText}`,
            type: "PLAYING"
        },
        status: config_json_1.presenceStatus // Won't crash if not valid
    };
    Bot.user.setPresence(status);
    console.log(`${Bot.settings.client.user.username} live on ${process.env.USERDOMAIN}`);
    console.log(`Currently live in ${Bot.guilds.cache.size} guilds: `);
    Bot.guilds.cache.forEach((server) => {
        console.log(`- ${server.name} : ${server.id}`);
    });
    guildCount.set(Bot.guilds.cache.size);
    //Bot.guilds.find("id", '').leave();
});
Bot.on("guildCreate", (guild) => {
    console.log(`Joined a new guild: ${guild.name}. New guild count: ${Bot.guilds.cache.size}`);
    guildCount.set(Bot.guilds.cache.size);
});
Bot.on("guildDelete", (guild) => {
    console.log(`Left a guild: ${guild.name}. New guild count: ${Bot.guilds.cache.size}`);
    guildCount.set(Bot.guilds.cache.size);
});
Bot.login(config_json_1.token);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slash_create_1 = require("slash-create");
const io_1 = __importDefault(require("@pm2/io"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Bot = new discord_js_1.Client({
    intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'DIRECT_MESSAGES'],
    presence: {
        status: 'online',
        activities: [{
                name: process.env.PRESENCE_TEXT,
                type: 'PLAYING'
            }]
    }
});
let guildCount = io_1.default.metric({
    name: 'Guild count: '
});
const Creator = new slash_create_1.SlashCreator({
    applicationID: process.env.APP_ID,
    token: process.env.TOKEN
});
// Creator.registerCommandsIn(`${__dirname}/commands/characters`);
Creator.registerCommandsIn(`${__dirname}/commands/dice`);
Creator.registerCommandsIn(`${__dirname}/commands/dnd`);
Creator.registerCommandsIn(`${__dirname}/commands/general`);
Creator.registerCommandsIn(`${__dirname}/commands/characters`);
Creator.syncCommands();
Creator.withServer(new slash_create_1.GatewayServer((handler) => {
    Bot.ws.on('INTERACTION_CREATE', (data) => { handler(data); });
}));
Creator.on('debug', (m) => console.log('slash-create debug:', m));
Creator.on('warn', (m) => console.log('slash-create warn:', m));
Creator.on('error', (m) => console.error('slash-create error: ', m));
// Creator.on('rawREST', (m: Object) => console.log('slash-create REST: ', m));
Bot.on("ready", function () {
    console.log(`${Bot.user.username} live on ${process.env.USERDOMAIN}`);
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
Bot.login(process.env.TOKEN);

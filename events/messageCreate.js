const { Events } = require('discord.js');
const conversationManager = require('../chatgpt/conversationManager.js');
const dataController = require('../data/dataController.js');

module.exports = {
    name: Events.MessageCreate,
	once: false,
    async execute(message){
        if(
        dataController.appdata.guilds[message.guild.id]?.channels[message.channel.id]?.is_active === 1 &&
        !message.author.bot &&
        (message.content.toLowerCase().includes((`hey ${dataController.appdata.guilds[message.guild.id]?.channels[message.channel.id].name}`.toLowerCase())) || conversationManager.hasActiveConvo(message.channel.id))){
            await conversationManager.request(message);
            if(message.content.toLowerCase().includes((`goodbye ${dataController.appdata.guilds[message.guild.id]?.channels[message.channel.id].name}`.toLowerCase()))){
                delete conversationManager.activeconvos[message.channel.id];
            }
        }
    }
}
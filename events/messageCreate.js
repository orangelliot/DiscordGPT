const { Events } = require('discord.js');
const ConversationManager = require('../chatgpt/conversationManager');
const appdata = require('../appdata.json');

const conversationManager = new ConversationManager()

module.exports = {
    name: Events.MessageCreate,
	once: false,
    conversationManager: conversationManager,
    async execute(message){
        if((message.content.toLowerCase().includes('hey clippy') || conversationManager.hasActiveConvo(message.channel.id))
            && !message.author.bot && appdata.guilds[message.guild.id + '.' + message.channel.id] == 1){
            await conversationManager.request(message);
        }

        if(message.content.toLowerCase().includes('goodbye clippy') && conversationManager.hasActiveConvo(message.channel.id)){
            delete conversationManager.activeconvos[message.channel.id];
        }
    }
}
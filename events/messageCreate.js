const { Events } = require('discord.js');
const ConversationManager = require('../chatgpt/conversationManager');
const { appdata } = require('../data/dataController.js')

const conversationManager = new ConversationManager()

module.exports = {
    name: Events.MessageCreate,
	once: false,
    conversationManager: conversationManager,
    async execute(message){
        if(
        appdata.active_channels[message.guild.id + '.' + message.channel.id] != null &&
        appdata.active_channels[message.guild.id + '.' + message.channel.id] == 1 &&
        !message.author.bot &&
        (message.content.toLowerCase().includes('hey clippy') || conversationManager.hasActiveConvo(message.channel.id))){
            await conversationManager.request(message);
            if(message.content.toLowerCase().includes('goodbye clippy')){
                delete conversationManager.activeconvos[message.channel.id];
            }
        }
    }
}
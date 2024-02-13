const { Events } = require('discord.js');
const ConversationManager = require('../chatgpt/conversationManager');
const fs = require('fs');

const conversationManager = new ConversationManager()

module.exports = {
    name: Events.MessageCreate,
	once: false,
    conversationManager: conversationManager,
    async execute(message){
        const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../appdata.json')))
        if(
        data.guilds[message.guild.id + '.' + message.channel.id] != null && 
        (message.content.toLowerCase().includes('hey clippy') || conversationManager.hasActiveConvo(message.channel.id)) &&
        !message.author.bot
        && data.guilds[message.guild.id + '.' + message.channel.id] == 1){
            await conversationManager.request(message);
            if(message.content.toLowerCase().includes('goodbye clippy')){
                delete conversationManager.activeconvos[message.channel.id];
            }
        }
    }
}
const { Events } = require('discord.js');
const ConversationManager = require('../chatgpt/conversationManager');
const appdata = require('../appdata.json');

const conversationManager = new ConversationManager()

module.exports = {
    name: Events.MessageCreate,
	once: false,
    async execute(message){
        if(message.content.toLowerCase().includes('hey clippy') || conversationManager.hasActiveConvo(message.channel) && !message.author.bot && appdata.servers[message.guild.id + '.' + message.channel_id] == 1){
            const response = await conversationManager.request(message);
            const channel = message.channel;
            if (channel && channel.type === 0 && response !== -1) {
                await channel.send(response);
            }
        }
    }
}

setInterval(function(){
	conversationManager.cleanupInactiveConvos();
	console.log('cleaning up inactive convos...')
}, 10000);
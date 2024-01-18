const { Events } = require('discord.js');
const ConversationHandler = require('../chatgpt/conversationHandler')

const conversationHandler = new ConversationHandler()

module.exports = {
    name: Events.MessageCreate,
	once: false,
    async execute(message){
        if(message.content.toLowerCase().includes('hey clippy') || conversationHandler.hasActiveConvo(message.channel) && !message.author.bot){
            const response = await conversationHandler.request(message);
            const channel = message.channel;
            if (channel && channel.type === 0 && response !== -1) {
                await channel.send(response);
            }
        }
    }
}

setInterval(function(){
	conversationHandler.cleanupInactiveConvos();
	console.log('cleaning up inactive convos...')
}, 10000);
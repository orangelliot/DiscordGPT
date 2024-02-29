const { Events } = require('discord.js');
const { conversationManager } = require('./messageCreate');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

setInterval(function(){
	conversationManager.cleanupInactiveConvos();
}, 10000);
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
	console.log('cleaning up inactive convos...')
}, 10000);
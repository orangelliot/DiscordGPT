const { Events } = require('discord.js');
const { conversationManager } = require('./messageCreate');
const dataController = require('../data/dataController')

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log(`timing out conversations after ${120000/1000} seconds`)
	},
};

setInterval(function(){
	conversationManager.cleanupInactiveConvos();
	dataController.write_data();
}, 30000);
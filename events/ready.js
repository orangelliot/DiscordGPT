const { Events } = require('discord.js');
const conversationManager = require('../chatgpt/conversationManager.js');
const dataController = require('../data/dataController.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log(`timing out conversations after ${120000/1000} seconds`);
	},
};

setInterval(function(){
	conversationManager.cleanupInactiveConvos();
	dataController.writeData();
}, 30000);
const { Events } = require('discord.js');
const dataController = require('../data/dataController.js');

module.exports = {
	name: Events.GuildCreate,
    once: false,
    async execute(guild){
        dataController.appdata.guilds[guild.id] = {"channels": {}}
    }
}
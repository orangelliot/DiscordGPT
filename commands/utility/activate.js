const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('activate')
        .setDescription('Activates Clippy in this channel'),
    async execute(interaction) {

    }
}
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('deactivate')
        .setDescription('Deactivates Clippy in this channel'),
    async execute(interaction) {

    }
}
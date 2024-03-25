const { SlashCommandBuilder } = require('discord.js');
const { appdata } = require('../../data/dataController.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('deactivate')
        .setDescription('Deactivates Clippy in this channel'),
    async execute(interaction) {
        appdata.active_channels[interaction.guild.id + '.' + interaction.channel.id] = 0;
        await interaction.reply(`Channel ${interaction.channel.name} is now inactive.`);
    }
}
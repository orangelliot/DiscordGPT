const { SlashCommandBuilder } = require('discord.js');
const { appdata } = require('../../data-controller.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('activate')
        .setDescription('Activates Clippy in this channel'),
    async execute(interaction) {
        appdata.guilds[interaction.guild.id + '.' + interaction.channel.id] = 1;
        await interaction.reply(`Channel ${interaction.channel.name} is now active.`);
    }
}
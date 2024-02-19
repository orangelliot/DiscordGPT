const { SlashCommandBuilder } = require('discord.js');
const { appdata } = require('../../data/data-controller.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('deactivate')
        .setDescription('Deactivates Clippy in this channel'),
    async execute(interaction) {
        appdata.guilds[interaction.guild.id + '.' + interaction.channel.id] = 0;
        await interaction.reply(`Channel ${interaction.channel.name} is now inactive.`);
    }
}
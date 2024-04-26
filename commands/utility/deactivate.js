const { SlashCommandBuilder } = require('discord.js');
const dataController = require('../../data/dataController.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('deactivate')
        .setDescription('Deactivates Clippy in this channel'),
    async execute(interaction) {
        if(!dataController.hasChannel(interaction.channel.id)){
            dataController.appdata.guilds[interaction.guild.id].channels[interaction.channel.id] = {"is_active": 0};
            dataController.setPrompt(interaction.guild.id, interaction.channel.id, 0);
            dataController.setName(interaction.guild.id, interaction.channel.id, 0);
        } else dataController.appdata.guilds[interaction.guild.id].channels[interaction.channel.id].is_active = 0;
        await interaction.reply(`Channel ${interaction.channel.name} is now inactive.`);
    }
}
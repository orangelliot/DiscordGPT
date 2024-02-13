const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('activate')
        .setDescription('Activates Clippy in this channel'),
    async execute(interaction) {
        const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../appdata.json')))
        data.guilds[interaction.guild.id + '.' + interaction.channel.id] = 1;
        const updated = JSON.stringify(data)
        fs.writeFileSync(path.resolve(__dirname, '../../appdata.json'), updated)
        await interaction.reply(`Channel ${interaction.channel.name} is now active.`);
    }
}
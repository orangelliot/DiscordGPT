const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('deactivate')
        .setDescription('Deactivates Clippy in this channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../appdata.json')))
        data.servers[interaction.guild.id + '.' + interaction.channel.id] = 0;
        const updated = JSON.stringify(data)
        fs.writeFileSync(path.resolve(__dirname, '../../appdata.json'), updated)
        await interaction.reply(`Channel ${interaction.channel.name} is now inactive.`);
    }
}
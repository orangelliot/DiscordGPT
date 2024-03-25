const { SlashCommandBuilder, messageLink } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('printmessage')
        .setDescription('Prints last message to the log'),
    async execute(interaction){
        const message = await interaction.channel.messages.fetch({ limit: 1 });
        console.log(message);
        await interaction.reply('message printed to log');
    },
}
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('channels')
        .setDescription('Returns a list of text channels'),
    async execute(interaction) {
        try{
            const channelList = await interaction.guild.channels.fetch();
            const textChannels = channelList.filter(channel => channel.type === 0)
                                            .map(channel => channel.name);
            await interaction.reply(`This server contains the following channels:\n ${textChannels.join(', ')}`);
        }
        catch (error) {
            console.error('Error fetching channels:', error);
            await interaction.reply('Sorry, I was unable to fetch the channel list.');
        }
    },
}
const { SlashCommandBuilder } = require('discord.js');
const dataController = require('../../data/dataController.js');
const conversationManager = require('../../chatgpt/conversationManager.js')

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('setname')
        .setDescription('Changes the bot name for this channel')
        .addStringOption(option =>
			option
				.setName('name')
				.setDescription('The new name for this channel')),
    async execute(interaction){
        const name = interaction.options.getString('name') ?? 0;
        if(dataController.hasChannel(interaction.guild.id, interaction.channel.id)){
            try {
                const newname = dataController.setName(interaction.guild.id, interaction.channel.id, name);
                conversationManager.hasActiveConvo(interaction.channel.id)?.setName(name);
                await interaction.reply(`Name for ${interaction.channel.name} is now \"${newname}\"`);
            } catch (error) {
                await interaction.reply(`setname failed! Error:${error}`);
                console.log(error)
            }
        }
        else{
            await interaction.reply('Please run /activate to register channel before attempting to change name');
        }
    }
}
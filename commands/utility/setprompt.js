const { SlashCommandBuilder } = require('discord.js');
const dataController = require('../../data/dataController.js');
const conversationManager = require('../../chatgpt/conversationManager.js')

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('setprompt')
        .setDescription('Changes the initial prompt for this channel')
        .addStringOption(option =>
			option
				.setName('prompt')
				.setDescription('The new initial prompt for this channel')),
    async execute(interaction){
        const prompt = interaction.options.getString('prompt') ?? 0;
        if(dataController.hasChannel(interaction.guild.id, interaction.channel.id)){
            try {
                const newprompt = dataController.setPrompt(interaction.guild.id, interaction.channel.id, prompt);
                conversationManager.hasActiveConvo(interaction.channel.id)?.setPrompt(prompt);
                await interaction.reply(`prompt for ${interaction.channel.prompt} is now \"${newprompt}\"`);
            } catch (error) {
                await interaction.reply(`setprompt failed! Error:${error}`);
                console.log(error)
            }
        }
        else{
            await interaction.reply('Please run /activate to register channel before attempting to change prompt');
        }
    }
}
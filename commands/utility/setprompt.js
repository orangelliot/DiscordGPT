const { SlashCommandBuilder } = require('discord.js');
const { conversationManager } = require('../../events/messageCreate.js')

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('setprompt')
        .setDescription('Changes the initial prompt for Clippy in this channel')
        .addStringOption(option =>
			option
				.setName('prompt')
				.setDescription('The new intial prompt for Clippy')),
    async execute(interaction){
        const prompt = interaction.options.getString('prompt') ?? 0;
        conversationManager.hasActiveConvo(interaction.channel.id)?.setPrompt(prompt);
    }
}
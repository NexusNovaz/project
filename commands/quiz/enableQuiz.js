const { SlashCommandBuilder} = require('discord.js');
const CardPack = require('../../database/models/CardPack.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enable_quiz')
        .setDescription('Enable a Quiz')
        .addStringOption(option => 
            option
                .setName('quiz_id')
                .setDescription('The ID of the quiz you want to enable')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            
            await CardPack.updateOne({googleSheetsId: interaction.options.getString('quiz_id')}, {$addToSet: {enabledFor: interaction.user.id}});
            await interaction.editReply(`You have enabled ${await CardPack.find({googleSheetsId: interaction.options.getString('quiz_id')})} for ${interaction.user.tag} (${interaction.user.id})}`);

        } catch (err) {
            console.error(`[ERROR] (enableQuiz.js) ${err}`);
            interaction.editReply('There was an error performing this command, please contact `Nexus Novaz#0862`');
            return -1;
        }
    }
}
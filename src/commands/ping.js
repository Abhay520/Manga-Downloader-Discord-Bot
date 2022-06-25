const {SlashCommandBuilder}  = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('ping')
	.setDescription('returns Pong! along with the message latency'),
	async execute(interaction) {
		const timeTaken = Date.now() - interaction.createdTimestamp;
        interaction.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
	},
};

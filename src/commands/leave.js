const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
	name: 'leave',
	execute(client, interaction) {
		const connection = getVoiceConnection(interaction.guildId);
		if (connection) {
			connection.destroy();
			interaction.reply('¡Hasta la próxima!');
		} else interaction.reply({ content: 'No estoy en ningún canal de voz', ephemeral: true });
	}
};

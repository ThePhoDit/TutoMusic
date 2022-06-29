const { joinVoiceChannel } = require('@discordjs/voice');
module.exports = {
	name: 'join',
	execute(client, interaction) {
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ content: '¡No estás en un canal de voz!', ephemeral: true });
		try {
			joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator,
				selfDeaf: true
			});
			interaction.reply('Entré a tu canal de voz');
		} catch (err) {
			interaction.reply(`No pude unirme al canal de voz a causa del siguiente error: ${err.message}`);
		}
	}
};

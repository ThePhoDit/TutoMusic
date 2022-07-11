const { getVoiceConnection } = require('@discordjs/voice');
const { queue } = require('../lib/play');
module.exports = {
	name: 'leave',
	execute(client, interaction) {
		const serverQueue = queue.get(interaction.guildId);
		const voiceChannel = interaction.member.voice.channel;

		if (!voiceChannel) return interaction.reply({ content: '¡No estás en un canal de voz!', ephemeral: true });
		if (!serverQueue) return interaction.reply({ content: 'No hay nada en la cola ahora mismo', ephemeral: true });

		const djRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'dj');
		const permission =
			interaction.member.roles.cache.has(djRole) ||
			interaction.member.id === serverQueue.songs[0].requested ||
			serverQueue.songs[0]?.requested === 'Autoplay' ||
			serverQueue.voiceChannel.members.filter((m) => !m.user.bot).size <= 3;
		if (!permission) return interaction.reply({ content: 'No tienes permisos para ejecutar ese comando.', ephemeral: true });

		serverQueue.songs = [];
		getVoiceConnection(interaction.guildId).destroy();
		if (serverQueue.leaveTimeout) clearTimeout(serverQueue.leaveTimeout);
		queue.delete(interaction.guildId);
		interaction.reply('¡Hasta la próxima!');
	}
};

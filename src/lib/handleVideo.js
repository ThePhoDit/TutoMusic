const { queue, play } = require('./play');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');

function moveArray(arr, old_index, new_index) {
	if (new_index >= arr.length) {
		let k = new_index - arr.length + 1;
		while (k--) arr.push(undefined);
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr; // for testing
}

module.exports = function handleVideo(video, interaction, playlist = false, seek = 0) {
	const serverQueue = queue.get(interaction.guildId);
	const song = {
		id: video.id,
		title: video.title,
		duration: video.durationRaw,
		durationInSec: video.durationInSec,
		channel: {
			url: video.channel.url,
			name: video.channel.name
		},
		url: `https://www.youtube.com/watch?v=${video.id}`,
		requested: interaction.user.id,
		seek: seek,
		skip: []
	};

	if (!serverQueue) {
		const newQueue = {
			textChannel: interaction.channel,
			voiceChannel: interaction.member.voice.channel,
			songs: [],
			volume: 1,
			playing: true,
			loop: false,
			shuffle: false,
			autoplay: false,
			leaveTimeout: null
		};
		queue.set(interaction.guildId, newQueue);

		newQueue.songs.push(song);

		try {
			joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator,
				selfDeaf: true
			});

			play(interaction.guild, newQueue.songs[0]);
		} catch (error) {
			console.error(error);
			queue.delete(interaction.guildId);
			return interaction.channel.send(`No pude unirme al canal de voz. Error: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (seek) {
			if (seek > song.durationInSec) return interaction.channel.send('¡El vídeo finaliza antes de llegar ahí!');
			moveArray(serverQueue.song, serverQueue.songs.length - 1, 1);
			return getVoiceConnection(interaction.guildId).state.subscription.player.stop(); //mover la última canción (la que se acaba de pedir con seek) a la segunda posición y hacer skip
		}
		if (serverQueue.leaveTimeout) {
			clearTimeout(serverQueue.leaveTimeout);
			serverQueue.leaveTimeout = null;
			return play(serverQueue.textChannel.guild, playlist ? serverQueue.songs[0] : song);
		}
		if (!playlist) {
			const embed = new MessageEmbed()
				.setTitle('__Añadido a la cola__')
				.setDescription(`**[${song.title}](${song.url})**\n[${song.channel.name}](${song.channel.url})`)
				.addField('Duración', song.duration || 'Desconocida', true)
				.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
			return serverQueue.textChannel.send({ embeds: [embed] });
		}
	}
};

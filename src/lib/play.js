/* eslint-disable require-await */ //será necesario para el autoplay
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { stream } = require('play-dl');
const { MessageEmbed } = require('discord.js');

const queue = new Map();

function leaveAndDestroy(guildId) {
	getVoiceConnection(guildId)?.destroy();
	return queue.delete(guildId);
}

function swap(array, x, y) {
	const b = array[x];
	array[x] = array[y];
	array[y] = b;
	return array;
}

async function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if (!serverQueue) return;

	if (!song) return leaveAndDestroy(guild.id);

	let source;
	try {
		source = await stream(song.url, { seek: song.seek });
	} catch (error) {
		console.error(error);
		serverQueue.textChannel.send('Ocurrió un error al ejecutar este comando. ¿Tiene el vídeo restricción de edad?\n' + error.message);
		return leaveAndDestroy(guild.id);
	}

	if (!source || !source?.stream) {
		serverQueue.textChannel.send('Ocurrió un error totalmente desconocido al intentar poner ese vídeo.');
		return leaveAndDestroy(guild.id);
	}

	const resource = createAudioResource(source.stream, { inputType: source.type, inlineVolume: true });
	const player = createAudioPlayer();
	player.play(resource);

	player.on('stateChange', async (oldState, newState) => {
		if (oldState.status == 'playing' && newState.status == 'idle') {
			if (serverQueue.loop) {
				serverQueue.songs.push(serverQueue.songs.shift());
				serverQueue.songs[serverQueue.songs.length - 1].seek = 0; // si tenía seek, cambiarlo para que cuando suene por el loop no empiece por el seek
			} else serverQueue.songs.shift();
			if (!serverQueue.songs[0]) {
				if (serverQueue.leaveTimeout) return;
				serverQueue.leaveTimeout = setTimeout(() => {
					leaveAndDestroy(guild.id);
				}, 30000);
			} else {
				if (serverQueue.shuffle) swap(serverQueue.songs, 0, Math.floor(Math.random() * serverQueue.songs.length)); //cambia la posición de la canción que realmente tendría que sonar (A) por una al azar (B), asignando a A la posición de B
				play(guild, serverQueue.songs[0]);
			}
		}
	});

	getVoiceConnection(guild.id).subscribe(player);
	getVoiceConnection(guild.id).state.subscription.player.state.resource.volume.setVolumeLogarithmic(serverQueue.volume / 5);

	if (!song.seek) {
		const embed = new MessageEmbed()
			.setTitle('__Sonando__')
			.setDescription(`**[${song.title}](${song.url})**\n[${song.channel.name}](${song.channel.url})`)
			.setColor(4494843)
			.addField('Pedida por:', `${song.requested === 'Autoplay' ? 'Autoplay' : `<@${song.requested}>`}`, true)
			.addField('Duración', song.duration || 'Desconocida', true)
			.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
		return serverQueue.textChannel.send({ embeds: [embed] });
	}
}

module.exports = { queue, play };

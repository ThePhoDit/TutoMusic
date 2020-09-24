const model = require('../functions/model');
const { play, queue } = require('./play.js');
const { MessageEmbed } = require('discord.js');

/**
 * @template T
 * @param {Array<T>} arr
 * @param {number} oldIndex
 * @param {number} newIndex
 * @returns {Array<T>}
 */
function arrayMove(arr, oldIndex, newIndex) {
	if (newIndex >= arr.length) {
		var k = newIndex - arr.length + 1;
		while (k--) arr.push(undefined);
	}

	arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
	return arr;
}

/**
 * @param {import('simple-youtube-api/src/structures/Video')} video
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').VoiceChannel} voiceChannel
 * @param {boolean} playlist
 * @param {number} seek
 */
async function handleVideo(video, message, voiceChannel, playlist = false, seek) {
	const serverQueue = queue.get(message.guild.id);
	/**
	 * @type import('./model').GuildDocument
	 */
	const serverConfig = await model.findOne({ id: message.guild.id });

	let string = '';
	for (let t of Object.values(video.duration)) {
		if (!t) continue;
		if (t < 10) t = '0' + t;
		string = string + `:${t}`;
	}

	/**
	 * @type import('./play').Song
	 */
	const song = {
		id: video.id,
		title: video.title,
		duration: string.slice(1),
		durationObject: video.duration,
		channel: video.channel.title,
		url: `https://www.youtube.com/watch?v=${video.id}`,
		requested: message.author.id,
		seek: seek ? seek : 0,
		skip: []
	};

	if (!serverQueue) {
		/**
		 * @type import('./play').QueueMember
		 */
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: serverConfig.volume,
			loop: false,
			playing: true
		};

		queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const connection = await voiceChannel.join().catch(() => {
			queue.delete(message.guild.id);
			return false;
		});
		if (typeof connection === 'boolean')
			return message.channel.send('Could not join voice channel.');

		queueConstruct.connection = connection;

		serverQueue.connection.dispatcher.on('finish', () => console.log('Finished'));
		serverQueue.connection.dispatcher.on('error', (e) => console.log(e));
		serverQueue.connection.dispatcher.on('close', () => console.log('Closed'));

		const result = await Promise.all([
			voiceChannel.guild.me.voice.setDeaf(true).catch(() => undefined),
			play(message.guild, queueConstruct.songs[0], serverConfig)
		]).catch(() => {
			queue.delete(message.guild.id);
			return false;
		});

		if (typeof result === 'boolean')
			return message.channel.send('There was an error attempting to play the song.');
	} else {
		serverQueue.songs.push(song);
		if (seek) {
			arrayMove(serverQueue.songs, serverQueue.songs.length - 1, 1);
			serverQueue.connection.dispatcher.end();
			return;
		}

		if (playlist) return;
		else {
			var embed = new MessageEmbed()
				.setTitle('Added to the queue')
				.setDescription(
					`[${song.title}](${song.url}) has been succesfully added to the queue!`
				)
				.addField('Channel', song.channel, true)
				.addField('Duration', song.duration, true)
				.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
			return serverQueue.textChannel.send(embed);
		}
	}
	return;
}

module.exports = handleVideo;

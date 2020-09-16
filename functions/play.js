const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
/**
 * @type Map<string, QueueMember>
 */
const queue = new Map();

/**
 * @typedef {Object} DurationObject
 * @property {number} [hours] How many hours the video is long
 * @property {number} [minutes] How many minutes the video is long
 * @property {number} [seconds] How many seconds the video is long
 */

/**
 * @typedef {Object} Song
 * @property {string} id
 * @property {string} title
 * @property {string} duration
 * @property {DurationObject} durationObject
 * @property {string} channel
 * @property {string} url
 * @property {string} requested
 * @property {number} seek
 * @property {Array<string>} skip
 */

/**
 * @typedef {Object} QueueMember
 * @property {import('discord.js').TextChannel} textChannel
 * @property {import('discord.js').VoiceChannel} voiceChannel
 * @property {import('discord.js').VoiceConnection | null} connection
 * @property {Array<Song>} songs
 * @property {number} volume
 * @property {boolean} playing
 * @property {boolean} loop
 */

/**
 * @param {import('discord.js').Guild} guild - The guild class.
 * @param {Song} song - The song.
 * @param {import('./model').GuildDocument} settings - Guild settings.
 */
async function play(guild, song, settings) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const seek = song.seek;
	const dispatcher = serverQueue.connection.play(ytdl(song.url), {
		seek: seek,
		volume: settings.volume || 1
	});
	dispatcher
		.once('finish', (reason) => {
			if (reason === 'Stream is not generating quickly enough.')
				console.log('Song ended.');
			else console.log(reason);
			if (serverQueue.loop === true) {
				serverQueue.songs.push(serverQueue.songs.shift());
				serverQueue.songs[serverQueue.songs.length - 1].seek = 0;
			} else serverQueue.songs.shift();
			play(guild, serverQueue.songs[0], settings);
		})
		.on('error', (error) => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	if (seek > 0) return;
	var embed = new MessageEmbed()
		.setTitle('🎶 Now playing 🎶')
		.setDescription(`[${song.title}](${song.url})`)
		.setColor('RANDOM')
		.addField('Channel', song.channel, true)
		.addField('Duration', song.duration, true)
		.addField('Requested by', `<@${song.requested}>`, true)
		.setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
	return await serverQueue.textChannel.send(embed);
}

module.exports = { play, queue };

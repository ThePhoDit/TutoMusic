const handleVideo = require('../functions/handleVideo');

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'play',
	description: 'Add a song to the queue.',
	usage: 'play <Song or URL>',
	example: 'play Liar Mask',
	aliases: ['p'],
	myPerms: [false, 'CONNECT', 'SPEAK'],
	async execute(client, message, args) {
		const searchString = args.join(' ');
		const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';

		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send('You are not in a voice channel');

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await client.youtube.getPlaylist(url);
			const videos = await playlist.getVideos();

			const videoValues = Object.values(videos);
			let i = 10;
			while (i--) {
				const video = await client.youtube
					.getVideoByID(videoValues[i].id)
					.catch(() => false);
				if (video) await handleVideo(video, message, voiceChannel, true);
			}

			return message.channel.send(`Playlist: **${playlist.title}** added to the queue.`);
		} else {
			const video = await client.youtube.getVideo(url).catch(async () => {
				const videos = await client.youtube
					.searchVideos(searchString, 1)
					.catch(() => false);
				if (typeof videos === 'boolean' || videos.length < 1) return false;
				return videos[0];
			});

			if (!video) return message.channel.send('No results found.');
			const actualVideo = await client.youtube.getVideoByID(video.id);

			await handleVideo(actualVideo, message, voiceChannel);
		}
	}
};

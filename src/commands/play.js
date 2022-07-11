const play = require('play-dl');
const handleVideo = require('../lib/handleVideo');

module.exports = {
	name: 'play',
	async execute(client, interaction) {
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ content: '¡No estás en un canal de voz!', ephemeral: true });

		const searchString = interaction.options.getString('canción');
		const type = await play.validate(searchString);

		if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channelId !== voiceChannel.id)
			return interaction.reply({ content: '¡Debes estar en mi canal de voz!', ephemeral: true });

		if (type.toString().startsWith('sp'))
			try {
				const spot = await play.spotify(searchString);
				if (spot.type !== 'track') {
					interaction.reply('La playlist está siendo añadida a la cola');
					const songs = spot.page(1);
					if (!songs) return interaction.reply('No pude encontrar canciones en esa playlist');
					for (let index = 0; index < songs.length; index++) {
						const track = songs[index];
						const searched = await play.search(`${track.artists[0]?.name} ${track.name}`, { limit: 1 }).catch(() => false);
						if (typeof searched !== 'boolean' && searched[0]) handleVideo(searched[0], interaction, true, 0);
					}
					return;
				} else {
					const searched = await play.search(`${spot.artists[0]?.name} ${spot.name}`, { limit: 1 }).catch((err) => {
						return client.catchError(err, interaction.channel);
					});
					if (typeof searched === 'boolean' || searched.length < 1) return interaction.reply({ content: 'No pude encontrar ningún resultado', ephemeral: true });
					handleVideo(searched[0], interaction, false, 0);
					return interaction.reply({ content: `**${searched[0].title}** ha sido añadido a la cola con éxito`, ephemeral: true });
				}
			} catch (err) {
				console.error(err);
				interaction.channel.send(`Ha ocurrido un error inesperado:\n\`\`${err.message}\`\``);
				return client.channels.cache.get('991658494975557692').send(`\`\`\`js\n${err.stack}\`\`\``);
			}

		if (type === 'yt_playlist') {
			const playlist = await play.playlist_info(searchString, { incomplete: true });
			const videos = await playlist.all_videos();
			videos.forEach(async (video) => {
				await handleVideo(video, interaction, true, 0);
			});
			return interaction.reply({ content: `La playlist **${playlist.title}** ha sido añadida a la cola` });
		} else {
			let video;
			try {
				if (type === 'yt_video') video = (await play.video_info(searchString)).video_details;
				else {
					const videos = await play.search(searchString, { limit: 1 }).catch((err) => {
						return client.catchError(err, interaction.channel);
					});
					if (typeof videos === 'boolean' || videos?.length < 1) return interaction.reply({ content: 'No pude encontrar ningún resultado', ephemeral: true });
					video = (await play.video_info(videos[0].id)).video_details;
				}
				handleVideo(video, interaction, false, 0);
				return interaction.reply({ content: `**${video.title}** ha sido añadido a la cola con éxito`, ephemeral: true });
			} catch (err) {
				console.error(err);
				interaction.channel.send(`Ha ocurrido un error inesperado:\n\`\`${err.message}\`\``);
				return client.channels.cache.get('991658494975557692').send(`\`\`\`js\n${err.stack}\`\`\``);
			}
		}
	}
};

const YouTube = require('simple-youtube-api');
const handleVideo = require('../functions/handleVideo');
const { MessageEmbed } = require('discord.js');

const youtube = new YouTube(process.env.GOOGLE_API_KEY);

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'search',
	description: 'Search a song and get the 10 first results',
	usage: 'search <song or url>',
	example: 'search paradisus paradoxum',
	aliases: ['sc'],
	myPerms: [false, 'CONNECT', 'SPEAK'],
	async execute(_client, message, args) {
		const searchString = args.slice(0).join(' ');
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel)
			return await message.channel.send('You are not in a voice channel.');

		const videos = await youtube.searchVideos(searchString, 10).catch(() => false);
		if (typeof videos === 'boolean' || videos.length < 1)
			return await message.channel.send('No videos/songs found with that query.');

		let songIndex = 0;
		const embed = new MessageEmbed()
			.setTitle('__**Song Selection**__')
			.setColor('#1423aa')
			.setFooter('Type "cancel" if you do not want to select any song.')
			.setDescription(
				`${videos
					.map((video2) => `**${++songIndex} -** [${video2.title}](${video2.url})`)
					.join('\n')} \nType the number of the song you want.`
			)
			.setTimestamp();
		await message.channel.send(embed);

		const response = await message.channel
			.awaitMessages(
				/**
				 * @param {import('discord.js').Message} msg
				 */
				(msg) =>
					msg.content > 0 && msg.content < 11 && msg.author.id === message.author.id,
				{
					max: 1,
					time: 12000,
					errors: ['time']
				}
			)
			.catch(() => false);
		if (typeof response === 'boolean')
			return await message.channel.send('No response. Cancelling...');

		const videoIndex = parseInt(response.first().content);
		const video = videos[videoIndex - 1];

		return await handleVideo(video, message, voiceChannel);
	}
};

const { MessageEmbed } = require('discord.js');

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'queue',
	description: 'Get the queue',
	usage: 'queue <page>',
	example: 'queue 0',
	aliases: ['q'],
	async execute(_client, message, args, _settings, queue) {
		const serverQueue = queue.get(message.guild.id);
		if (!serverQueue) return await message.channel.send('Nothing playing right now.');

		const page = parseInt(args[0]) || 0,
			amplifiedEnd = (page + 1) * 10;
		let amplifiedPage = page * 10;
		const selectedPortion = serverQueue.songs.slice(amplifiedPage, amplifiedEnd);
		if (!selectedPortion || selectedPortion.length < 1)
			return await message.channel.send('There are no songs in that page of the queue.');

		const embed = new MessageEmbed()
			.setTitle('__**Queued Songs:**__')
			.setColor('RANDOM')
			.setDescription(
				`${selectedPortion
					.map(
						(song) =>
							`**${++amplifiedPage} -** [${song.title}](https://www.youtube.com/watch?v=${
								song.id
							}) - ${song.duration}`
					)
					.join('\n')}\n **Now playing**\n${serverQueue.songs[0].title} - [${
					serverQueue.songs[0].duration
				}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`
			)
			.setFooter(`Page ${page + 1} of ${Math.floor(serverQueue.songs.length / 10) + 1}`)
			.setTimestamp();
		return await message.channel.send(embed);
	}
};

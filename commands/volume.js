/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'volume',
	description: 'Set the volume to x',
	usage: 'volume set <volume>',
	example: 'volume set 6',
	aliases: ['v'],
	async execute(_client, message, args, settings, queue) {
		const serverQueue = queue.get(message.guild.id);
		if (!message.member.voice.channel)
			return await message.channel.send('You are not in a voice channel');

		if (!serverQueue)
			return await message.channel.send("There aren't any songs in the queue right now.");
		if (!args[1] || args[0] !== 'set')
			return await message.channel.send(`Volume: **${serverQueue.volume}**.`);

		const djRole = settings.dj
			? message.guild.roles.cache.get(settings.dj)
			: message.guild.roles.cache.find((role) => role.name === 'DJ');

		if (djRole && !message.member.roles.cache.has(djRole.id))
			return message.channel.send('You need the DJ role to change the volume.');

		if (parseFloat(args[1]) > 10)
			return message.channel.send('Volume should not be over 10.');
		if (settings.volume === parseFloat(args[1]))
			return message.channel.send(`The volume is already set to ${parseFloat(args[1])}.`);

		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);

		settings.volume = Number(args[1]);
		await Promise.all([
			settings.save(),
			message.channel.send(`Set the volume to **${args[1]}**.`)
		]);
	}
};

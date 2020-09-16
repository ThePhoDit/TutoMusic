/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'stop',
	description: 'Make the bot leaves the voice channel',
	aliases: ['st', 'leave'],
	async execute(_client, message, _args, settings, queue) {
		const serverQueue = queue.get(message.guild.id);
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel)
			return await message.channel.send('You are not in a voice channel.');
		if (!serverQueue) return await message.channel.send('Nothing to stop right now.');

		const djRole = settings.dj
			? message.guild.roles.cache.get(settings.dj)
			: message.guild.roles.cache.find((role) => role.name === 'DJ');

		if (
			djRole &&
			!message.member.roles.cache.has(djRole.id) &&
			message.member.id !== serverQueue.songs[0].requested
		)
			return message.channel.send('You need the DJ role to stop a song of other member.');

		serverQueue.songs = [];
		serverQueue.voiceChannel.leave();
		queue.delete(message.guild.id);
		return await message.channel.send('Stopped.');
	}
};

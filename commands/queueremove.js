/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'queueremove',
	description: 'Remove a song from the queue',
	usage: 'queueremove <song>',
	example: 'queueremove 2',
	aliases: ['qremove', 'songremove', 'remove', 'deletesong'],
	async execute(_client, message, args, settings, queue) {
		const serverQueue = queue.get(message.guild.id);
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel)
			return await message.channel.send('You are not in a voice channel.');
		if (!serverQueue) return await message.channel.send('Nothing playing now.');
		if (!args[0])
			return message.channel.send(
				'Re-run the command and type a number to delete it from the queue.'
			);
		if (isNaN(args[0])) return await message.channel.send('It must be a number.');
		if (args[0] === '1')
			return await message.channel.send("You can't delete the current song.");

		const index = parseInt(args[0]) - 1;
		const song = serverQueue.songs[index];
		if (!song)
			return await message.channel.send('A song with that index does not exist.');

		const djRole = settings.dj
			? message.guild.roles.cache.get(settings.dj)
			: message.guild.roles.cache.find((role) => role.name === 'DJ');

		if (
			djRole &&
			!message.member.roles.cache.has(djRole.id) &&
			message.member.id !== serverQueue.songs[index].requested
		)
			return message.channel.send(
				'You need the DJ role to remove a song of other member.'
			);

		serverQueue.songs.splice(index, 1);
		return await message.channel.send(
			`${
				serverQueue.songs[Math.floor(args[0] - 1)].title
			} has been successfully removed from the queue.`
		);
	}
};

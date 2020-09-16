/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'skip',
	description: 'Skip a song',
	aliases: ['skip'],
	async execute(_client, message, _args, settings, queue) {
		const serverQueue = queue.get(message.guild.id);
		if (!serverQueue) return;
		if (!message.member.voice.channel) return;

		const djRole = settings.dj
			? message.guild.roles.cache.get(settings.dj)
			: message.guild.roles.cache.find((role) => role.name === 'DJ');
		if (djRole && message.member.roles.cache.has(djRole.id))
			return serverQueue.connection.dispatcher.end();

		const members = message.member.voice.channel.members.filter((m) => !m.user.bot).size,
			required = Math.floor(members / 2),
			skips = serverQueue.songs[0].skip;
		if (skips.includes(message.author.id))
			return message.channel.send(
				`You have already voted to skip (${skips.length}/${required}).`
			);

		skips.push(message.author.id);
		if (skips.length >= required) {
			serverQueue.connection.dispatcher.end();
			return await message.channel.send('Skipping song...');
		} else return await message.channel.send(`Skipping? ${skips.length}/${required}.`);
	}
};

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'loop',
	description: 'Loop the current queue',
	usage: 'loop',
	example: 'loop',
	aliases: ['l'],
	async execute(_client, message, _args, _settings, queue) {
		const serverQueue = queue.get(message.guild.id);
		if (!message.member.voice.channel)
			return await message.channel.send('You are not in a voice channel.');
		if (!serverQueue) return await message.channel.send('The queue is empty!');
		serverQueue.loop = !serverQueue.loop;
		queue.set(message.guild.id, serverQueue);
		if (serverQueue.loop) return await message.channel.send('**🔁 Loop enabled**.');
		else return await message.channel.send('**🔁 Loop disabled**.');
	}
};

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'resume',
	description: 'Resume the current song',
	async execute(_client, message, _args, _settings, queue) {
		const serverQueue = queue.get(message.guild.id);
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed.');
		}

		return await message.channel.send('Nothing playing now.');
	}
};

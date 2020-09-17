/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'pause',
	description: 'Pause the current song',
	async execute(_client, message, _args, _settings, queue) {
		if (!message.member.voice.channel)
			return await message.channel.send('You are not in a voice channel');

		const serverQueue = queue.get(message.guild.id);
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused.');
		}

		return await message.channel.send('Nothing playing now.');
	}
};

module.exports = {
	name: 'volume',
	description: 'Set the volume to x',
	usage: 'volume set <volume>',
	example: 'volume set 6',
	aliases: ['v'],
	async execute(client, message, args, queue) {
		const serverQueue = queue.get(message.guild.id)
		if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel');
		if (!serverQueue) return message.channel.send("There ins't songs in the queue right now.");
		if (!args[1]) return message.channel.send(`Volume: **${serverQueue.volume}**`);
		if(Number(args[1]) > 10) return message.channel.send('NO')
		serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
        return message.channel.send(`I set the volume to **${args[1]}**`);
	}
};
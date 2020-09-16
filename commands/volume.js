const model = require('../functions/model');

module.exports = {
	name: 'volume',
	description: 'Set the volume to x',
	usage: 'volume set <volume>',
	example: 'volume set 6',
	aliases: ['v'],
	async execute(client, message, args, queue) {
		const serverConfig = await model.findOne({id: message.guild.id});

		const serverQueue = queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel');
		if (!serverQueue) return message.channel.send("There aren't any songs in the queue right now.");
		if (!args[1] || args[0] !== 'set') return message.channel.send(`Volume: **${serverQueue.volume}**`);
		if(Number(args[1]) > 10) return message.channel.send('Volume should not be over 10.');
		if (serverConfig.volume === Number(args[1])) return message.channel.send(`The volume is already set to ${Number(args[1])}.`);

		serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);

        serverConfig.volume = Number(args[1]);
        serverConfig.save();

        message.channel.send(`I set the volume to **${args[1]}**`);
	}
};
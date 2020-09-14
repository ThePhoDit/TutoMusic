module.exports = {
	name: 'pause',
	description: 'Pause the current song',
	async execute(client, message, args, queue) {
    
    const serverQueue = queue.get(message.guild.id)
    if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸');
        }
        
 return message.channel.send('Nothing playing now');
 }
}
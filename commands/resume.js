module.exports = {
	name: 'resume',
	description: 'Resume the current song',
	async execute(client, message, args, queue) {
    
    const serverQueue = queue.get(message.guild.id)
    if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶');
        }     
  return message.channel.send('Nothing playing now');
 }
}
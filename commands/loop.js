module.exports = {
    name: 'loop',
    description: 'Loop the current queue',
    usage: 'loop',
    example: 'loop',
    aliases: ['l'],
      async execute(client, message, args, queue) {
        let serverQueue = queue.get(message.guild.id)
        if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel');
        if(!serverQueue) return message.channel.send('The queue is empty');
          serverQueue.loop = !serverQueue.loop;
          queue.set(message.guild.id, serverQueue);
        if(serverQueue.loop) message.channel.send('**🔁 Loop enabled**');
        else return message.channel.send('**🔁 Loop disabled**');  
    }
  };
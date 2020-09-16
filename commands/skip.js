const model = require('../functions/model')
module.exports = {
    name: 'skip',
    description: 'Skip a song',
    aliases: ['skip'],
      async execute(client, message, args, queue) {
          const serverQueue = queue.get(message.guild.id);
          if(!serverQueue) return;
          if(!message.member.voice.channel) return;
          const serverConfig = await model.findOne({id: message.guild.id});

          let djrole;
          if (serverConfig.djrole) {
              djrole = message.guild.roles.cache.get(serverConfig.djrole);
          } else {
              djrole = message.guild.roles.cache.find(r => r.name === 'DJ');
          }
          if((djrole && message.member.roles.cache.has(djrole.id)) || serverQueue.songs[0].requested === message.author.id) {
            serverQueue.connection.dispatcher.end()
            return
          }

          let miembros = message.member.voice.channel.members.filter(m => !m.user.bot).size
          let required = Math.floor(miembros/2)
          let skips = serverQueue.songs[0].skip
          if(skips.includes(message.author.id)) return message.channel.send(`You have already voted to skip (${skips.length}/${required})`)
          skips.push(message.author.id)
          if(skips.length >= required) {
            message.channel.send("Skipping...")
            serverQueue.connection.dispatcher.end()
            return
          } else {
            message.channel.send(`Skipping? ${skips.length}/${required}`)
          }
  }
  }
  
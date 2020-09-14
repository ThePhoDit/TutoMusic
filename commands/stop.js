const model = require('../functions/model')
module.exports = {
    name: 'stop',
    description: 'Make the bot leaves the voice channel',
    aliases: ['st', 'leave'],
    async execute(client, message, args, queue) {
        const serverQueue = queue.get(message.guild.id)
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.channel.send('You are not in a voice channel');
        if (!serverQueue) return message.channel.send('Nothing to stop right now.');
        const serverConfig = await model.findOne({id: message.guild.id})

        let djrole;
        if(serverConfig.djrole !== '0') {
         djrole = message.guild.roles.cache.get(serverConfig.djrole)
        } else {
         djrole = message.guild.roles.cache.find(r => r.name === 'DJ')
        }

        if((!djrole || !message.member.roles.cache.has(djrole.id)) && message.member.id !== serverQueue.songs[0].requested) return message.channel.send('You need the DJ role to stop a song of other member')
        serverQueue.songs = [];
        serverQueue.voiceChannel.leave();
        queue.delete(message.guild.id);
        console.log("Stop command has been used.")

    }
};
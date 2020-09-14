const model = require('../functions/model')
module.exports = {
    name: 'queueremove',
    description: 'Remove a song from the queue',
    usage: 'queueremove <song>',
    example: 'queueremove 2',
    aliases: ['qremove', 'songremove', 'remove', 'deletesong'],
    async execute(client, message, args, queue) {
        const serverQueue = queue.get(message.guild.id)
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You are not in a voice channel');
        if (!serverQueue) return message.channel.send('Nothing playing now.');
        if (!args[0]) return message.channel.send("Type a number to delete it from the queue")
        if (isNaN(args[0])) {
            return message.channel.send("It must be a number")
        } else {
            if (args[0] === "1") return message.channel.send("You can't delete the current song")
            const serverConfig = await model.findOne({id: message.guild.id})

            let djrole;
            if(serverConfig.djrole !== '0') {
             djrole = message.guild.roles.cache.get(serverConfig.djrole)
            } else {
             djrole = message.guild.roles.cache.find(r => r.name === 'DJ')
            }
            if((!djrole || !message.member.roles.cache.has(djrole.id)) && message.member.id !== serverQueue.songs[0].requested) return message.channel.send('You need the DJ role to remove a song of other member')
            let existe = serverQueue.songs[Math.floor((args[0]) - 1)] ? true : false
            if (existe === true) {
                message.channel.send(`${serverQueue.songs[Math.floor((args[0]) - 1)].title} has been succesfully removed from the queue.`)
                delete(serverQueue.songs[Math.floor((args[0]) - 1)])
                console.log("Delete queue command has been used.")
                const arr = [...Array(serverQueue.songs.length + 1).keys()];
                arr.forEach(number => {
                    if (!serverQueue.songs[number]) return
                    if (number < args[0] - 1) return
                    serverQueue.songs[number - 1] = serverQueue.songs[number]
                })
                serverQueue.songs = serverQueue.songs.slice(0, serverQueue.songs.length - 1)
            } else {
                message.channel.send("The queue doesn't have a song with that number.")
            }
        }
    }
};
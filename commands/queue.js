const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Get the queue',
    usage: 'queue <page>',
    example: 'queue 0',
    aliases: ['q'],
    async execute(client, message, args, queue) {
        let serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send('No');
        const arr = [...Array(serverQueue.songs.length + 1).keys()];
        arr.forEach(number => {

            let queue = serverQueue.songs.slice(Number(number.toString() + "0"), Number((number + 1).toString() + "0"))
            let numero = args[0]
            if (!numero) numero = 0

            if (number == numero) {
                if (!serverQueue.songs[Number(number.toString() + "0")]) return message.channel.send("There ins't songs in that page of the queue")
                let index = Number(number.toString() + "0");
                let embed = new MessageEmbed()
                    .setTitle("__**Queued Songs:**__")
                    .setColor("RANDOM")
                    .setDescription(`${queue.map(song => `**${++index} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) - ${song.duration}`).join('\n')}\n **Now playing**\n${serverQueue.songs[0].title} - [${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`)
                    .setFooter(`Page ${number} of ${Math.floor(serverQueue.songs.length / 10)}`)
                message.channel.send(embed)
            }
        });

    }
}
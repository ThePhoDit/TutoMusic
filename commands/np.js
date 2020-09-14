const {MessageEmbed} = require('discord.js')

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

function Time_convertor(ms) {
    let horas = Math.floor(((ms) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutos = Math.floor(((ms) % (1000 * 60 * 60)) / (1000 * 60));
    let segundos = Math.floor(((ms) % (1000 * 60)) / 1000);


    let final = ""
    if (segundos < 10) segundos = "0" + segundos
    if (minutos < 10) minutos = "0" + minutos
    if (horas < 10) horas = "0" + horas
    if (horas < 1) {
        if (segundos > 0) final += segundos > 1 ? `${minutos}:${segundos}` : `${minutos}:${segundos}`
        if (horas > 1) {
            if (segundos > 0) final += segundos > 1 ? `${horas}:${minutos}:${segundos}` : `${horas}:${minutos}:${segundos}`
        }
        return final
    }
}




module.exports = {
    name: 'np',
    description: 'See what\'s playing right now',
    aliases: ['nowplaying'],
    async execute(client, message, args, queue) {

        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.channel.send('Nothing playing right now.');
        let durationMs = 0,
            a = 7

        for (let t of Object.values(serverQueue.songs[0].durationObject)) {
            switch (a) {
                case 7:
                    durationMs += t * 7 * 86400000
                case 6:
                    durationMs += t * 365 * 86400000;
                    break;
                case 5:
                    durationMs += t * 30 * 86400000;
                    break;
                case 4:
                    durationMs += t * 86400000;
                    break;
                case 3:
                    durationMs += t * 3600000;
                    break;
                case 2:
                    durationMs += t * 60000;
                    break;
                case 1:
                    durationMs += t * 1000;
                    break;
            };
            a--;

        };

        let seek = serverQueue.songs[0].seek
        let now = Time_convertor(serverQueue.connection.dispatcher.streamTime + Number(seek * 1000))
        let porcentaje = Math.floor(((serverQueue.connection.dispatcher.streamTime + Number(seek * 1000)) / durationMs) * 100)
        let index = Math.floor(porcentaje / 10)
        let string = '▬▬▬▬▬▬▬▬▬▬'
        let position = setCharAt(string, index, ':radio_button:')

        let embed = new MessageEmbed()
            .setTitle("**🎶 Now playing**")
            .setDescription(`**${serverQueue.songs[0].title}**`)
            .setColor("RANDOM")
            .setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/hqdefault.jpg`)
            .addField(" ឵឵ ", `[${now} / ${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`, true)
            .addField(`${porcentaje}%`, position, true)
            .addField("Requested by:", `<@${serverQueue.songs[0].requested}>`, true)
        message.channel.send(embed);

    }
}
const buscador_letra = require("buscador-letra"); //Importar la libreria
const Discord = require('discord.js')
let buscador = new buscador_letra(process.env.GENIUS_API_KEY);

module.exports = {
    name: 'lyrics',
    description: 'Get the lyrics of a song',
    usage: 'lyrics <song>',
    example: 'lyrics despacito',
    aliases: ['lyr'],
    async execute(client, message, args, queue) {
        let name = args.join(' ')
        if (!name) return message.channel.send('Type the name of the song.')
        let results = await buscador.buscar(name);
        if (results.length == 0) return message.channel.send("Nothing found");
        const lyrics = await buscador.letra(results[0]);

        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(results[0].titulo + " (by " + results[0].artista + ")");

        if (lyrics.length <= 2048) embed.setDescription(lyrics);
        else {
            let chunks = lyrics.match(/[\s\S]{1,1023}/g);

            for (let chunk of chunks) embed.addField("\u200b", chunk, false);
        }
        if (embed.length > 6000) return message.channel.send("The lyrics are very long...");

        return message.channel.send(embed);
    }
}
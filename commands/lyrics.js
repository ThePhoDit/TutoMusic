const lyrics = require('buscador-letra');
const Discord = require('discord.js');
const searcher = new lyrics(process.env.GENIUS_API_KEY);

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'lyrics',
	description: 'Get the lyrics of a song',
	usage: 'lyrics <song>',
	example: 'lyrics despacito',
	aliases: ['lyr'],
	async execute(_client, message, args) {
		const name = args.join(' ');
		if (!name) return await message.channel.send('Type the name of the song.');
		const results = await searcher.buscar(name);
		if (results.length === 0) return await message.channel.send('Nothing found.');
		const lyrics = await searcher.letra(results[0]);
		if (!lyrics)
			return await message.channel.send('I could not get the lyrics. Please try again.');

		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(results[0].titulo + ' (by ' + results[0].artista + ')');

		if (lyrics.length <= 2048) embed.setDescription(lyrics);
		else if (embed.length > 6000)
			return await message.channel.send(
				'Could not display the lyrics as there are very long.'
			);
		else {
			const chunks = lyrics.match(/[\s\S]{1,1023}/g);
			for (const chunk of chunks) embed.addField('\u200b', chunk, false);
		}

		return await message.channel.send(embed);
	}
};

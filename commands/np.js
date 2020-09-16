const { MessageEmbed } = require('discord.js');

/**
 * @param {string} str
 * @param {number} index
 * @param {string} chr
 */
function setCharAt(str, index, chr) {
	if (index > str.length - 1) return str;
	return str.substr(0, index) + chr + str.substr(index + 1);
}

/**
 * @param {number} ms
 */
function converTime(ms) {
	let horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	let segundos = Math.floor((ms % (1000 * 60)) / 1000);

	let final = '';
	if (segundos < 10) segundos = '0' + segundos;
	if (minutos < 10) minutos = '0' + minutos;
	if (horas < 10) horas = '0' + horas;
	if (horas < 1) {
		if (segundos > 0)
			final += segundos > 1 ? `${minutos}:${segundos}` : `${minutos}:${segundos}`;
		if (horas > 1)
			if (segundos > 0)
				final +=
					segundos > 1
						? `${horas}:${minutos}:${segundos}`
						: `${horas}:${minutos}:${segundos}`;
		return final;
	}
}

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'np',
	description: "See what's playing right now",
	aliases: ['nowplaying'],
	async execute(_client, message, _args, _settings, queue) {
		const serverQueue = queue.get(message.guild.id);
		if (!serverQueue) return await message.channel.send('Nothing playing right now.');
		let durationMs = 0,
			a = 7;

		for (const t of Object.values(serverQueue.songs[0].durationObject)) {
			switch (a) {
				case 7:
					durationMs += t * 7 * 86400000;
					break;
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
			}
			a--;
		}

		const seek = serverQueue.songs[0].seek,
			now = converTime(
				serverQueue.connection.dispatcher.streamTime + parseInt(seek * 1000)
			),
			percentage = Math.floor(
				((serverQueue.connection.dispatcher.streamTime + Number(seek * 1000)) /
					durationMs) *
					100
			),
			index = Math.floor(percentage / 10),
			string = '▬▬▬▬▬▬▬▬▬▬',
			position = setCharAt(string, index, ':radio_button:');

		const embed = new MessageEmbed()
			.setTitle('**🎶 Now playing**')
			.setDescription(`**${serverQueue.songs[0].title}**`)
			.setColor('RANDOM')
			.setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/hqdefault.jpg`)
			.addField(
				' ឵឵ ',
				`[${now} / ${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`,
				true
			)
			.addField(`${percentage}%`, position, true)
			.addField('Requested by:', `<@${serverQueue.songs[0].requested}>`, true);
		return await message.channel.send(embed);
	}
};

const { MessageEmbed } = require('discord.js');

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'help',
	description: 'The help command',
	aliases: ['commands'],
	async execute(client, message) {
		const embed = new MessageEmbed()
			.setTitle('Commands')
			.setDescription(
				'If you need help with any command use `{prefix} command <command>`\n----------------------\n' +
					client.commands.map((cmd) => `\`${cmd.name}\``).join(', ')
			)
			.setColor(`RANDOM`)
			.addField(
				'Invite Link',
				'https://discord.com/api/oauth2/authorize?client_id=755425277332684902&permissions=37046352&scope=bot'
			)
			.setFooter(client.commands.size + ' commands');

		return await message.channel.send(embed);
	}
};

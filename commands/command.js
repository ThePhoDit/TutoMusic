const { MessageEmbed } = require('discord.js');

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'command',
	description: 'Receive help about the specified command',
	usage: 'command <command>',
	example: 'command np',
	aliases: ['cmd'],
	async execute(client, message, args) {
		const commandName = args.join(' ');
		if (!commandName)
			return await message.channel.send('You need to include a command name.');
		const command =
			client.commands.get(commandName) ||
			client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command)
			return await message.channel.send(
				"I couldn't find a command with that name or alias."
			);
		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`Command ${command.name}`)
			.setDescription(command.description)
			.addField('Usage', command.usage ? command.usage : command.name, true)
			.addField('Example', command.example ? command.example : command.name, true)
			.addField('Aliases', command.aliases ? command.aliases.join(', ') : 'No', false)
			.setFooter('The arguments inside < > are required, while inside [ ] are optional.');
		return await message.channel.send(embed);
	}
};

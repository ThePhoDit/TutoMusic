const { queue } = require('../functions/play.js');
const model = require('../functions/model');

/**
 * @param {import('../index').ExtendedClient} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (message.channel.type !== 'text') return;
	if (message.author.bot || message.system) return;

	if (message.content.match(client.mentionMatch))
		return message.channel.send(
			`My prefix is \`${serverConfig.prefix}\`, if you need help use \`${serverConfig.prefix}help\``
		);

	/**
	 * @type import('../functions/model').GuildDocument
	 */
	const serverConfig =
		(await model.findOne({ id: message.guild.id })) ||
		(await new model({
			id: message.guild.id,
			dj: null,
			prefix: '*',
			volume: 1
		}).save());

	const prefix = serverConfig.prefix;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.myPerms) {
		const perms = command.myPerms.slice(1);

		switch (command.myPerms[0]) {
			case true:
				if (!message.channel.permissionsFor(message.guild.me).has(perms))
					return message.channel.send(
						`I need the following permissions in the channel to execute that command: ${perms
							.map((perm) => `\`${perm}\``)
							.join(', ')}`
					);

				break;
			default:
				if (!message.guild.me.hasPermission(perms))
					return message.channel.send(
						`I need the following permissions in the server to execute that command: ${perms
							.map((perm) => `\`${perm}\``)
							.join(', ')}`
					);
		}
	}
	try {
		command.execute(client, message, args, serverConfig, queue);
	} catch (error) {
		console.error(`[Command ${command.name}] Error: ${error}`);
	}
};

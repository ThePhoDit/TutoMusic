/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'dj',
	description: 'Set the DJ role',
	usage: 'dj [disable] <role id or name>',
	example: 'dj Music',
	aliases: ['dj-role', 'djrole'],
	async execute(_client, message, args, settings) {
		if (!message.member.hasPermission('MANAGE_GUILD'))
			return message.channel.send(
				'You need the `MANAGE_SERVER` permission to use this command.'
			);

		if (args[0] === 'disable') {
			if (!settings.dj)
				return await message.channel.send('The DJ role is already disabled.');

			settings.dj = null;
			settings.save();
			return message.channel.send('OK, the DJ role was set to null.');
		}

		const rol =
			message.guild.roles.cache.get(args[0]) ||
			message.guild.roles.cache.find((r) => r.name === args.join(' '));
		if (!rol) return message.channel.send('Role not found.');

		settings.dj = rol.id;
		settings.save();

		return await message.channel.send(
			`Role ${rol.name} has been set as the new DJ Role.`
		);
	}
};

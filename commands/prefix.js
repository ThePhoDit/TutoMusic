/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'prefix',
	description: "Set the bot's prefix",
	usage: 'prefix <new prefix>',
	example: 'prefix t-',
	aliases: ['setprefix'],
	async execute(_client, message, args, settings) {
		if (!args[0]) return;
		if (!message.member.hasPermission('MANAGE_GUILD'))
			return await message.channel.send(
				'You need the `MANAGE_SERVER` permission to use this command.'
			);

		const prefix = args.join(' ');
		if (prefix.length > 10)
			return message.channel.send(
				'The prefix must have a maximum length of 10 characters.'
			);

		settings.prefix = prefix;
		settings.save();
		return await message.channel.send(`\`${prefix}\` set as new prefix.`);
	}
};

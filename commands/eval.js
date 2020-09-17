const { inspect } = require('util');

/**
 * @param {string} text
 */
function clean(text) {
	if (typeof text === 'string')
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}

const owners = ['459649180969730050', '461279654158925825', '372466760848244736'];

/**
 * @type {import('../index').Command}
 */
module.exports = {
	name: 'eval',
	description: 'only admin',
	ESdesc: 'SOLO ADMIN DIJE',
	usage: 'only admin',
	example: 'only admin',
	type: -1,
	// eslint-disable-next-line no-unused-vars
	async execute(client, message, args, settings, queue) {
		if (owners.some((owner) => message.author.id === owner)) {
			const depthTo = args.indexOf('-depth') > -1 ? args[args.indexOf('-depth') + 1] : 0;
			try {
				const code =
					depthTo > 0
						? args.slice(0, args.lastIndexOf(depthTo) - 1).join(' ')
						: args.join(' ');
				let evaled = eval(code);

				if (typeof evaled !== 'string') evaled = inspect(evaled, { depth: depthTo });

				return await message.channel.send(clean(evaled), { code: 'js' });
			} catch (err) {
				return await message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
			}
		}
	}
};

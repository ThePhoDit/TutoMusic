const mongoose = require('mongoose');
const { Client, Collection } = require('discord.js');
const { inspect } = require('util');
const { join } = require('path');
const { readdir } = require('fs').promises;

require('dotenv').config();

/**
 * @typedef {Object} ClientCommands
 * @property {import('discord.js').Collection<string, Command>} commands
 */

/**
 * @typedef {ClientCommands & import('discord.js').Client} ExtendedClient
 */

/**
 * @typedef {Object} Command
 * @property {string} name - Name of the command.
 * @property {string} description - The description of the command.
 * @property {string} usage - Usage of the command.
 * @property {string} example - Example usage of the command.
 * @property {Array<string>} aliases - Aliases of the commands.
 * @property {Array<string | boolean>} myPerms - Needed perms of the bot.
 * @property {function(ExtendedClient, import('discord.js').Message, Array<string>, import('./functions/model').GuildDocument, Map<string, import('./functions/play').QueueMember>)} execute - The callback.
 */

/**
 * @type ExtendedClient
 */
const client = new Client({ disableEveryone: true });

mongoose.connect(process.env.MONGO_URI, {
	socketTimeoutMS: 0,
	connectTimeoutMS: 0,
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(`[MongoDB] Connection Error: ${inspect(error)}`));
db.once('open', () => console.log('[MongoDB] Connection established.'));

client.commands = new Collection();

readdir(join(__dirname, 'commands'), { encoding: 'utf8' })
	.then((files) => {
		for (const file of files) {
			if (!file.endsWith('.js')) return;
			/**
			 * @type Command
			 */
			const command = require(join(__dirname, 'commands', file));
			client.commands.set(command.name, command);
		}
	})
	.catch((reason) =>
		console.error(`[Command Handler] Error loading commands: ${inspect(reason)}`)
	);

readdir(join(__dirname, 'events'), { encoding: 'utf8' })
	.then((files) => {
		for (const file of files) {
			if (!file.endsWith('.js')) return;
			const event = require(join(__dirname, 'events', file));
			const name = file.split('.')[0];
			client.on(name, event.bind(null, client));
		}
	})
	.catch((reason) =>
		console.error(`[Event Handler] Error loading events: ${inspect(reason)}`)
	);

client.login(process.env.TOKEN);

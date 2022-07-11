const { Client, Intents, Collection } = require('discord.js');
const { readdir, readdirSync } = require('fs');
const { join } = require('path');
const play = require('play-dl');

require('dotenv').config();

const client = new Client({
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES]
});

client.commands = new Collection();

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(join(commandsPath, file));
	client.commands.set(command.name, command);
}

const eventsPath = join(__dirname, 'events');
readdir(eventsPath, (err, files) => {
	if (err) return console.error(err);
	files.forEach((file) => {
		if (!file.endsWith('.js')) return;
		const evt = require(`./events/${file}`);
		const evtName = file.split('.')[0];
		client.on(evtName, evt.bind(null, client));
	});
});

process.on('unhandledRejection', (err) => {
	console.log(err);
	client.channels.cache.get('991658494975557692').send(`\`\`\`js\n${err.stack}\`\`\``);
});

play.setToken({
	spotify: {
		client_id: process.env.SPOTIFY_CLIENT_ID,
		client_secret: process.env.SPOTIFY_CLIENT_SECRET,
		refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
		market: 'ES'
	}
});

if (play.is_expired()) play.refreshToken();

client.login(process.env.TOKEN);

module.exports = async (client) => {
	console.log(
		`[Gateway] Connected to the gateway as ${client.user.username} (U: ${client.users.cache.size}, S: ${client.guilds.cache.size}).`
	);

	await client.user.setPresence({
		status: 'online',
		activity: {
			name: 'Some Music',
			type: 'PLAYING'
		}
	});
};

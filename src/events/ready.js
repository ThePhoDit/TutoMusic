module.exports = (client) => {
	if (process.argv[2] === 'deploy') {
		const data = require('../utils/commands');
		client.application?.commands.set(data).then((commands) => {
			console.log(commands);
		});
	}

	client.user.setPresence({
		activities: [
			{
				name: 'la mejor música de Discord',
				type: 'LISTENING'
			}
		],

		status: 'idle'
	});

	console.clear();
	console.log(`Bot iniciado`);
};

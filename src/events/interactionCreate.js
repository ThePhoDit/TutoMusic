module.exports = async (client, interaction) => {
	if (!interaction.inCachedGuild()) return;
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.log(error);
		}
	}
};

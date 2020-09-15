const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'command',
  description: 'Receive help about the specified command',
  usage: 'command <command>',
  example: 'command np',
  aliases: ['cmd'],
  async execute(client, message, args) {
    let commandName = args.join(' ')
    if(!commandName) return message.channel.send(util.command.not_found)
    let command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );
    if(!command) return message.channel.send("I couldn't find a command with that name or alias")
    let embed = new MessageEmbed()
    .setColor('RANDOM')

    .setTitle(`Command ${command.name}`)
    .setDescription(command.description)
    .addField("Usage", command.usage ? command.usage: command.name, true)
    .addField("Example", command.example ? command.example : command.name, true)
    .addField("Aliases", command.aliases ? command.aliases.join(', '): "No", false)
    .setFooter("The things inside <> are required, while inside [] are optional.")

    message.channel.send(embed)
  }
};
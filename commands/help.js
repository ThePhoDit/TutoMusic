const {MessageEmbed} = require('discord.js')
module.exports = {
  name: 'help',
  description: 'The help command',
  aliases: ['commands'],
  async execute(client, message, args) {

        let help_embed = new MessageEmbed()
          help_embed.setTitle("Commands")
          help_embed.setDescription("If you need help with any command use `{prefix} command <command>`\n----------------------\n"+client.commands.map(cmd => `\`${cmd.name}\``).join(', '))
          help_embed.setColor(`RANDOM`)

          help_embed.setFooter(client.commands.size + " commands")
      
          message.channel.send(help_embed)

  }
}
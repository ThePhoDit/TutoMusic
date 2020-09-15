const {MessageEmbed} = require('discord.js')
module.exports = {
  name: 'help',
  description: 'The help command',
  aliases: ['commands'],
  async execute(client, message, args) {

        let help_embed = new MessageEmbed()
          .setTitle("Commands")
          .setDescription("If you need help with any command use `{prefix} command <command>`\n----------------------\n"+client.commands.map(cmd => `\`${cmd.name}\``).join(', '))
          .setColor(`RANDOM`)
          .addField('Invite Link', 'https://discord.com/api/oauth2/authorize?client_id=755425277332684902&permissions=37046352&scope=bot');

          help_embed.setFooter(client.commands.size + " commands")
      
          message.channel.send(help_embed)

  }
}
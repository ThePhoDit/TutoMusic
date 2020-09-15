const model = require('../functions/model')
module.exports = {
    name: 'prefix',
    description: 'Set the bot\'s prefix',
    usage: 'prefix <new prefix>',
    example: 'prefix t-',
    aliases: ['setprefix'],
    async execute(client, message, args) {
        if(!args[0]) return
        const serverConfig = await model.findOne({id: message.guild.id})
          if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send('You need the `MANAGE_SERVER` permission to use this command')
          let prefix = args.join(' ')
          if(prefix.length > 10) return message.channel.send('10 chars max.')
          serverConfig.prefix = prefix
          serverConfig.save()
        
          message.channel.send(`\`${prefix}\` set as new prefix.`)
  
    }
  }
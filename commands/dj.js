const model = require('../functions/model')
module.exports = {
    name: 'dj',
    description: 'Set the DJ role',
    usage: 'dj [disable] <role id or name>',
    example: 'dj Music',
    aliases: ['dj-role', 'djrole'],
    async execute(client, message, args) {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send('You need the `MANAGE_SERVER` permission to use this command')
        const serverConfig = await model.findOne({id: message.guild.id})
        if(args[0] === 'disable') {
         serverConfig.dj = '0'
         serverConfig.save()
         return message.channel.send('Ok, the DJ role was set to null')
        }
        
        let rol = message.guild.roles.cache.find(r => r.name === args.join(' ')) || message.guild.roles.cache.get(args[0])
        if (!rol) return message.channel.send('Error, name or id of the role')

          serverConfig.dj = rol.id
          serverConfig.save()
        
          message.channel.send(`Role ${rol.name} set as new DJ Role`)
  
    }
  }
const model = require('../functions/model');
module.exports = {
    name: 'dj',
    description: 'Set the DJ role',
    usage: 'dj [disable] <role id or name>',
    example: 'dj Music',
    aliases: ['dj-role', 'djrole'],
    async execute(client, message, args) {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send('You need the `MANAGE_SERVER` permission to use this command')
        const serverConfig = await model.findOne({id: message.guild.id});
        if(args[0] === 'disable') {
            if (!serverConfig.dj) return message.channel.send('The DJ role is already disabled.');
            serverConfig.dj = null;
            serverConfig.save()
         return message.channel.send('Ok, the DJ role was set to null');
        }
        
        let rol = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(' '));
        if (!rol) return message.channel.send('Role not found.');

          serverConfig.dj = rol.id
          serverConfig.save()
        
          message.channel.send(`Role ${rol.name} has been set as the new DJ Role.`);
  
    }
  }
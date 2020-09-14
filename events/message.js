const {queue} = require('../functions/play.js')
const model = require('../functions/model')
module.exports = async (client, message) => { 
    if(message.channel.type === 'text') {
    if(message.author.bot || message.system) return
    const serverConfig = await model.findOne({id: message.guild.id})
    if(!serverConfig) {
        let newGuildModel = new model({ 
          id: message.guild.id,
          dj: '0',
          prefix: '*'
   });
  await newGuildModel.save()
  return
 }
        if (message.content.toLowerCase().startsWith(`<@!${client.user.id}>`) || message.content.toLowerCase().startsWith(`<@${client.user.id}>`)) {
           return message.channel.send(`My prefix is \`${serverConfig.prefix}\`, if you need help use \`${serverConfig.prefix}help\``)
          } 
    let prefix = serverConfig.prefix
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
       
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if(command.myPerms) {
        let perms = command.myPerms.slice(1)

        switch(command.myPerms[0]) {
        case true: 
        if(!message.channel.permissionsFor(message.guild.me).has(perms)) {
          return message.channel.send(`I need the following permissions in the channel to execute that command: ${perms.map(perm => `\`${perm}\``).join(', ')}`)
          }
        break;
        default: 
        if(!message.guild.me.hasPermission(perms)) {
          return message.channel.send(`I need the following permissions in the server to execute that command: ${perms.map(perm => `\`${perm}\``).join(', ')}`)
            }
        }
        
    }
    try {
     command.execute(client, message, args, queue)
    } catch (error) {
     console.error(error)
    }
 }
}

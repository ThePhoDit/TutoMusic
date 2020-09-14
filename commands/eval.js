const {inspect} = require('util')
module.exports = {
  name: 'eval',
  description: 'only admin',
  ESdesc: 'SOLO ADMIN DIJE',
  usage: 'only admin',
  example: 'only admin',
  type: -1,
  async execute(client, message, args, queue) {
    let owners = ['459649180969730050', '461279654158925825', '372466760848244736']
    if(owners.some(owner => message.author.id === owner)) {
    function clean(text) {
      if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
    }
    let depthTo = args.indexOf('-depth') > -1 ? args[args.indexOf('-depth')+1]: 0
    try {
      const code = depthTo > 0 ? args.slice(0, args.lastIndexOf(depthTo) -1).join(' ') : args.join(" ")
      let evaled = eval(code);

      if (typeof evaled !== "string") {evaled = inspect(evaled, { depth: depthTo })}

      message.channel.send(clean(evaled), { code: "js" });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }

    }
  }
}
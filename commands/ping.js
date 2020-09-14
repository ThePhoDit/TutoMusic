module.exports = {
    name: 'ping',
    description: 'Ping!',
    ESdesc: 'Ping!',
    usage: 'Ping!',
    example: 'Ping!',
    execute(client, message, args) {
      message.channel.send('Pinging...').then(sent => {
        sent.edit(`Pong! ${sent.createdTimestamp - message.createdTimestamp}ms`);
      });
    }
  };
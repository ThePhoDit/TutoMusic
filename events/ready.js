module.exports = async (client) => {
console.log(`${client.user.username} está online para ${client.users.cache.size} usuarios y ${client.guilds.cache.size} servidores`)
client.user.setPresence({
    status: "online",
    activity: {
      name: 'pon tu el estado lol',
      type: 'PLAYING'
    }
  });
}
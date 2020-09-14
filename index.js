require('dotenv').config()

const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client({disableEveryone: true})

const mongoose = require(`mongoose`);
mongoose.connect(process.env.MONGO_URI, {
  socketTimeoutMS: 0,
  connectTimeoutMS: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log(`Database Connected`)
});

client.commands = new Discord.Collection()

const commandFiles = fs
    .readdirSync("./commands/")
    .filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }

fs.readdir("./events/", (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const evt = require(`./events/${file}`);
      let evtName = file.split(".")[0];
      client.on(evtName, evt.bind(null, client));
    });
  });

client.login(process.env.TOKEN)
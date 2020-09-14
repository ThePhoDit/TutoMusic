const {MessageEmbed} = require('discord.js')
const ytdl = require('ytdl-core')
let queue = new Map()
async function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    console.log(serverQueue.songs);
    let seek = song.seek
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url), {seek: seek})
      dispatcher.once("finish", reason => {
        if (reason === "Stream is not generating quickly enough.")
          console.log("Song ended.");
        else console.log(reason);
        if (serverQueue.loop === true) {
          serverQueue.songs.push(serverQueue.songs.shift());
          serverQueue.songs[serverQueue.songs.length - 1].seek = 0 
        }
        else {serverQueue.songs.shift()}
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
   
    if(seek > 0) return
      var embed = new MessageEmbed()
        .setTitle('🎶 Now playing 🎶')
        .setDescription(`[${song.title}](${song.url})`)
        .setColor("RANDOM")
        .addField("Channel", song.channel, true)
        .addField("Duration", song.duration, true)
        .addField("Requested by", `<@${song.requested}>`, true)
        .setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
      return serverQueue.textChannel.send(embed);
  };
  module.exports = {play, queue}
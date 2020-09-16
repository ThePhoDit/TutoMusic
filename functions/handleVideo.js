const {play, queue} = require('./play.js')
const {MessageEmbed} = require('discord.js')
async function handleVideo(
    video,
    message,
    voiceChannel,
    playlist = false,
    seek
  ) {
    const serverQueue = queue.get(message.guild.id);
    let string = "";
    for (let t of Object.values(video.duration)) {
      if (!t) continue;
      if (t < 10) t = "0" + t;
      string = string + `:${t}`;
    }

    const song = {
      id: video.id,
      title: video.title,
      duration: string.slice(1),
      durationObject: video.duration,
      channel: video.channel.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      requested: message.author.id,
      seek: seek ? seek : 0,
      skip: []
    };
    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
      queue.set(message.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        voiceChannel.guild.me.voice.setDeaf(true).catch(() => false);
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`I could not join the voice channel: ${error}`);
        queue.delete(message.guild.id);
        return message.channel.send(`Error: ${error}`);
      }
    } else {
      serverQueue.songs.push(song);
      if(seek) {
      function array_move(arr, old_index, new_index) {
          if (new_index >= arr.length) {
              var k = new_index - arr.length + 1;
              while (k--) {
                  arr.push(undefined);
              }
          }
          arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
          return arr; // for testing
      };
      array_move(serverQueue.songs, serverQueue.songs.length - 1, 1)
      serverQueue.connection.dispatcher.end()
      return
      }
      console.log(serverQueue.songs);
      if (playlist) return;
      else { 
        var embed = new MessageEmbed()
          .setTitle('Added to the queue')
          .setDescription(`[${song.title}](${song.url}) has been succesfully added to the queue!`)
          .addField("Channel", song.channel, true)
          .addField("Duration", song.duration, true)
          .setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
        return serverQueue.textChannel.send(embed);
          }
    }
    return;
  };

module.exports = handleVideo
const handleVideo = require('../functions/handleVideo')

const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);


const {MessageEmbed} = require('discord.js')


module.exports = {
    name: 'search',
    description: 'Search a song and get the 10 first results',
    usage: 'search <song or url>',
    example: 'search paradisus paradoxum',
    aliases: ['sc'],
    myPerms: [false, "CONNECT", "SPEAK"],
    async execute(client, message, args) {
        const searchString = args.slice(0).join(' ');
        const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You are not in a voice channel');
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();

            const videoValues = Object.values(videos);
            let i = 0;
            while (i < 10) {
                const video2 = await youtube.getVideoByID(videoValues[i].id);
                await handleVideo(video2, message, voiceChannel, true);
                i ++;
            }

            return message.channel.send(`Playlist: **${playlist.title}** was added to the queue`);
        } else {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    let embed = new MessageEmbed()
                        .setTitle("__**Song Selection**__")
                        .setColor("#1423aa")
                        .setDescription(`${videos.map(video2 => `**${++index} -** [${video2.title}](${video2.url})`).join('\n')} \nType the number of the song you want.`)
                        .setFooter('Type "cancel" if you do not want to select any song.')
                    message.channel.send(embed);

                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            max: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.error(err);
                        return message.channel.send('Cancelling...');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send("I couldn't get results");
                }
            

            return handleVideo(video, message, voiceChannel);
        }
    }
}
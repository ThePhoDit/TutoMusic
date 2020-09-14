const handleVideo = require('../functions/handleVideo')

const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);

module.exports = {
    name: 'play',
    description: 'Add a song to the queue',
    usage: 'play <song or url>',
    example: 'play Liar Mask',
    aliases: ['p'],
    myPerms: [false, "CONNECT", "SPEAK"],
    async execute(client, message, args) {
        const searchString = args.slice(0).join(' ');
        const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You are not in a voice channel');

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); 
                await handleVideo(video2, message, voiceChannel, true); 
            }
            return message.channel.send(`Playlist: **${playlist.title}** added to the queue`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 1);
                    var video = await youtube.getVideoByID(videos[0].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send("I couldn't get results.");
                }
            }

            return handleVideo(video, message, voiceChannel);
        }

    }
}
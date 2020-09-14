const YouTube = require('simple-youtube-api');

const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const handleVideo = require('../functions/handleVideo.js')
module.exports = {
    name: 'seek',
    description: 'Jump to a part of the song',
    ESdesc: 'Salta a una parte de la canción',
    usage: 'seek <mm:ss>',
    example: 'seek 59\nseek 1:45',
    aliases: ['jumpto'],
    async execute(client, message, args, queue) {
        let serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return

        let array = args.join(' ').split(':').reverse()

        let seconds = array[0] ? array[0] : 0
        let minutes = array[1] ? array[1] * 60 : 0
        let hours = array[2] ? array[2] * 60 * 60 : 0

        let all = Math.floor(Number(seconds) + Number(minutes) + Number(hours))
        let url = serverQueue.songs[0].url
        var video = await youtube.getVideo(url);
        handleVideo(video, message, voiceChannel, false, all);
    }
}
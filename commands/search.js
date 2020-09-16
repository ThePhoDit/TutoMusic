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
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You are not in a voice channel');

        try {
            var videos = await youtube.searchVideos(searchString, 10);
            let index = 0;
            let embed = new MessageEmbed()
                .setTitle("__**Song Selection**__")
                .setColor("#1423aa")
                .setDescription(`${videos.map(video2 => `**${++index} -** [${video2.title}](${video2.url})`).join('\n')} \nType the number of the song you want.`)
                .setFooter('Type "cancel" if you do not want to select any song.')
            message.channel.send(embed);
            
            let response;

            try {
                response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11 && message2.author.id === message.author.id, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                });
            } catch (err) {
                console.error(err);
                return message.channel.send('Cancelling...');
            }
            const videoIndex = parseInt(response.first().content);
            let video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        }
        catch (err) {
            console.error(err);
            return message.channel.send("I couldn't get results");
        }

        return handleVideo(video, message, voiceChannel);
    }

}
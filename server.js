const { Client } = require('discord.js');
const YouTube = require('simple-youtube-api');
const yt = require('ytdl-core');
const ayarlar = require('./ayarlar.json');
const client = new Client();

const youtube = new YouTube(ayarlar.api);



let queue = {};

const commands = {
	'oynat': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`${ayarlar.prefix}ekle <url> Komutuyla Müzik Ekle!`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
		if (queue[msg.guild.id].playing) return msg.channel.sendMessage('Zaten Çalınan var');
		let dispatcher;
		queue[msg.guild.id].playing = true;

		console.log(queue);
		(function play(song) {
			console.log(song);
			if (song === undefined) return msg.channel.sendMessage('Sıra boş').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.sendMessage(`Çalınan Şarkı: **${song.title}** Talep Eden Kişi: **${song.requester}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : ayarlar.passes });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(ayarlar.prefix + 'durdur')) {
					msg.channel.sendMessage('**Şarkı Durduruldu**').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(ayarlar.prefix + 'devam')){
					msg.channel.sendMessage('**Şarkı Devam Ediyor**').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(ayarlar.prefix + 'geç')){
					msg.channel.sendMessage('**Şarkı Geçildi**').then(() => {dispatcher.end();});
				} else if (m.content.startsWith('ses+')){
					if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Þiddet: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					msg.channel.sendMessage(`Ses Şiddeti: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('ses-')){
					if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Þiddet: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					msg.channel.sendMessage(`Ses Şiddeti: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(ayarlar.prefix + 'süre')){
					msg.channel.sendMessage(`Süre: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(queue[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.sendMessage('Hata: ' + err).then(() => {
					collector.stop();
					play(queue[msg.guild.id].songs.shift());
				});
			});
		})(queue[msg.guild.id].songs.shift());
	},
	'gir': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('Bir kanala katýl.');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
	},
	'davet': (msg) => {
		msg.channel.sendMessage('Davet Linki: https://discordapp.com/oauth2/authorize?client_id=500600590305329152&scope=bot&permissions=8')
	},
	'çık': (msg) => {
					const voiceChannel = msg.member.voiceChannel;

			voiceChannel.leave()
		
	},
	'ekle': async (msg) => {
		const args = msg.content.split(' ');
		const searchString = args.slice(1).join(' ');
		const url2 = args[1].replace(/<.+>/g, '1');
		
		try {
			var video = await youtube.getVideo(url2)
		} catch (error) {
			try {
				var videos = await youtube.searchVideos(searchString, 1)
				var video = await youtube.getVideoByID(videos[0].id)
			} catch (err) {
				console.log(err)
				message.channel.send('Bir hata oluştu: ' + err)
			};
		};
		
		var url = `https://www.youtube.com/watch?v=${video.id}`
		
		if (url == '' || url === undefined) return msg.channel.sendMessage(`Bir YouTube linki eklemek için ${ayarlar.prefix}ekle <url> yazınız`);
		yt.getInfo(url, (err, info) => {
			if(err) return msg.channel.sendMessage('Geçersiz YouTube Bağlantısı: ' + err);
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
			msg.channel.sendMessage(`Sıraya **${info.title}** Adlı Şarkı Eklendi`);
		});
	},
	'queue': (msg) => {
		if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Sıraya ilk önce bazı şarkıları ekle : ${ayarlar.prefix}ekle`);
		let tosend = [];
		queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Talep eden: ${song.requester}`);});
		msg.channel.sendMessage(`__**${msg.guild.name}'s Müzik Kuyruğu:**__ Şu Anda **${tosend.length}** Şarkı Sırada ${(tosend.length > 15 ? '*[Sadece 15 tanesi gösteriliyor]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	}
};

client.on('ready', () => {
	console.log('BOT: Bot hazır.');
});

client.on('message', msg => {
	if (!msg.content.startsWith(ayarlar.prefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(ayarlar.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(ayarlar.prefix.length).split(' ')[0]](msg);
});
client.login(process.env.BOT_TOKEN);

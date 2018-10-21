const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

module.exports = client => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Discord: Şu an ` + client.channels.size + ` adet kanala, ` + client.guilds.size + ` adet sunucuya ve ` + client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + ` kullanıcıya hizmet veriliyor!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Discord: Aktif, Komutlar yüklendi!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Discord: ${client.user.username} ismi ile giriş yapıldı!`);
  client.user.setStatus("dnd");
client.user.setUsername(" Bird Bot ");
client.user.setPresence({
        game: {
            name: `Yepyeni Müzik Botu!`,
            type: 'WATCHING'
        },
        status: 'dnd'
    })
var oyun = [
        "bb+davet",
        "bb+oynat",
        "Bird Bot"       
    ];

    setInterval(function() {

        var random = Math.floor(Math.random()*(oyun.length-0+1)+0);

        client.user.setGame(oyun[random], "https://www.twitch.tv/bycoderr%22");
        }, 2 * 2500);
}

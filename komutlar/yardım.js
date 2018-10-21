const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

exports.run = (client, message, params) => {
  const embedyardim = new Discord.RichEmbed()
  .setTitle("Komutlar")
  .setDescription('')
  .setColor(0x2bff00)
  .addField("**Komutlar**", " bb+yardım = BOT Komutlarını Atar. \n bb+davet = BOT Davet Linkini Atar \n bb+oynat = Müziği Başlatır \n bb+ekle = Müzik Ekler \n bb+gir = BOT Odaya Girer \n bb+çık = BOT Odadan Çıkar \n bb+durdur = Şarkıyı Durdurur \n bb+devam = Şarkıyı Devam Ettirir \n bb+geç Şarkıyı Geçer \n ses+ = Sesi Artırır \n ses- = Sesi Kısar \n bb+süre = Tüm Şarkıların Süresini Gösterir ") .addField("**Yapımcı**", " **ByCoder.exe#3940** ")
  .setFooter('**--------------------------**')
  if (!params[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    message.channel.send(embedyardim);
  } else {
    let command = params[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      message.author.send('asciidoc', `= ${command.help.name} = \n${command.help.description}\nDoğru kullanım: ` + prefix + `${command.help.usage}`);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp', 'help', 'y'],
  permLevel: 0
};

exports.help = {
  name: 'yardım',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım [komut]'
};

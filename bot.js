const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('guildMemberAdd', async member => {

  let rol = await db.fetch(`otorol_${member.guild.id}`);
  let rol2 = member.guild.roles.find('name', rol);

  const rolk = await db.fetch(`rolK_${member.guild.id}`);
  const rolk2 = member.guild.channels.find('name', rolk)
  const otorolmesaj = await db.fetch(`otorolm_${member.guild.id}`)
  if (!rolk) return
  if (!rolk2) return
  if (!otorolmesaj) return

  member.addRole(rol2);
  rolk2.send(` \`${member.user.tag}\` adlı kullanıcıya \`${rol2.name}\` rolü verildi.`)
});

client.on('guildBanAdd' , (guild, user) => {
  let aramýzakatýlanlar = guild.channels.find('name', 'aramýza-katýlanlar');
  if (!aramýzakatýlanlar) return;
  aramýzakatýlanlar.send('https://media.giphy.com/media/8njotXALXXNrW/giphy.gif **Adalet daðýtma zamaný gelmiþ!** '+ user.username +'**Bakýyorum da suç iþlemiþ,Yargý daðýtmaya devam** :fist: :writing_hand:  :spy:' );
});

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'aktif') {
    msg.channel.sendMessage(':globe_with_meridians: Sunucu Aktif :globe_with_meridians:');
  }
  if (!msg.content.startsWith(prefix)) {
    return;
}
if (msg.content.toLowerCase() === prefix + 'davet' ) {
msg.channel.sendMessage(':star: **Sunucumuzun Sınırsız Davet Linki**: discord.gg/UD9Yy5u  :star:')
}
if (msg.content.toLowerCase() === prefix + 'aktif' ) {
msg.channel.sendMessage(':globe_with_meridians: **Sunucu Aktif** :globe_with_meridians: @everyone')
}
if (msg.content.toLowerCase() === prefix + 'destek' ) {
msg.channel.sendMessage('**Destek İstiyorum** **<@&602582715107115028>**  **<@&602583098508443665>** **Yardımcı Olabilir misiniz ?**')
}
if (msg.content.toLowerCase() === prefix + 'ip' ) {
msg.channel.sendMessage(':star:   **Sunucu IP :  51.89.36.219:30120**  :star:')
}
if (msg.content.toLowerCase() === prefix + 'rol' ) {
msg.channel.sendMessage('**Rol eğitimi istiyorum** **<@&602582937942360083>** **<@&602583098508443665>** **Yardımcı olabilir misin?** ')
}
if (msg.content.toLowerCase() === prefix + 'kayit' ) {
msg.channel.sendMessage(':star: ** <@&602583098508443665> !kayit yazarak başvuru yaptığınızın bilgisini verebilirsiniz.** <@&602583098508443665>   :star:')
}
if (msg.content.toLowerCase() === prefix + 'help' ) {
msg.channel.sendMessage(':star: **Bot Komutları = ip , davet , kayit , destek , rol , aktif , clear , yaz , kick , unban**  :star:')
}

});
client.on("guildMemberAdd", member => {

   var channel = member.guild.channels.find("name", "「🍷」oto-rol");
   if(!channel) return;

   var role = member.guild.roles.find("name", "Whitelist Kayıtsız !")
   if (!role) return;

   member.addRole(role);

   channel.send(":loudspeaker: :inbox_tray: **Otomatik Rol Verildi**"   + member +   " :white_check_mark:   **Hoşgeldin** ");

});

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(procces.env.BOT_TOKEN);

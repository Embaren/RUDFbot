const Discord=require('discord.js');

const bot=new Discord.Client();

const cmds=require('./commands.js');

function authorOrMention(message){
	mention=message.mentions.users.first();
	if (!mention) return(message.author);
	else return(mention);
}

bot.on('message',function(message){
	if (message.content[0]==='€'){
			content=message.content.slice(1).trim().split(/\s+/)
			if (typeof content != "undefined" && content != null && content.length != null && content.length > 0 && content[0]!='') {
				command=content.shift();
				switch (command){
					case ('help'):
						reply=cmds.help(function(reply){message.channel.send(reply);});
						break;
					case ('ping'):
						reply=cmds.ping(function(reply){message.reply(reply);});
						break;
					case ('score'):
						reply=cmds.score(authorOrMention(message),function(reply){message.channel.send(reply);});
						break;
					case ('scorem'):
						reply=cmds.scorem(authorOrMention(message),content,function(reply){message.channel.send(reply);});
						break;
					default:
						reply="Requête invalide";
				}
			}
			else {
				reply="Requête invalide";
			}
			//message.channel.send(reply);
		}
});

bot.login(process.env.BOT_TOKEN);
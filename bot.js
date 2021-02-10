const Discord=require('discord.js');

const bot=new Discord.Client();

const cmds=require('./commands.js');

function memberOrMention(message){
	mention=message.mentions.members.first();
	if (!mention) return(message.member);
	else return(mention);
}

bot.on('message',function(message){
	
	function reply(text,tag=false){if (tag) message.reply(text); else message.channel.send(text);}
	
	if (message.content[0]==='€'){
			content=message.content.slice(1).trim().split(/\s+/)
			if (typeof content != "undefined" && content != null && content.length != null && content.length > 0 && content[0]!='') {
				command=content.shift();
				switch (command){
					case ('help'):
						reply=cmds.help(reply);
						break;
					case ('ping'):
						reply=cmds.ping(reply);
						break;
					case ('say'):
						reply=cmds.say(message.member,content,reply);
						break;
					case ('score'):
						reply=cmds.score(memberOrMention(message),reply);
						break;
					case ('scorem'):
						reply=cmds.scorem(message.member,memberOrMention(message),content,reply);
						break;
					default:
						reply("Requête invalide",true);
				}
			}
			else {
				reply("Requête invalide",true);
			}
			//message.channel.send(reply);
		}
});


bot.on('guildMemberUpdate',function(oldMember,newMember){
	if (newMember.roles.cache.size != oldMember.roles.cache.size) updateMemRoles(newMember);
});

bot.on('roleUpdate',function(oldRole,newRole){
	
});

bot.login(process.env.BOT_TOKEN);
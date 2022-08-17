const Discord=require('discord.js');

const bot=new Discord.Client();

const cmds=require('./commands.js');

function memberOrMention(message){
	mention=message.mentions.members.first();
	if (!mention) return(message.member);
	else return(mention);
}

bot.on("ready", () => {
	bot.user.setActivity('€help', {type: "playing"}); 
});

bot.on('message',function(message){
	
	if (message.author.bot) return;
	
	if (message.content.startsWith('http')) return;
	
	function reply(text,tag=false) {if (tag) message.reply(text); else message.channel.send(text);}
	
	if (message?.guild === null){
		if (message.content[0]==='€'){
				content=message.content.slice(1).trim().split(/\s+/)
				if (typeof content != "undefined" && content != null && content.length != null && content.length > 0 && content[0]!='') {
					command=content.shift();
					switch (command){
						case ('ping'):
							cmds.ping(reply);
							break;
						case ('help'):
							cmds.help(reply);
							break;
						case ('crushhelp'):
							cmds.crushhelp(reply)
							break;
						case ('crush'):
							cmds.crush(message.author,content,reply)
							break;
						case ('removecrush'):
							cmds.removecrush(message.author,content,reply)
							break;
						case ('checkcrush'):
							cmds.checkcrush(message.author,content,reply)
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
	}
	
	else{
		if (!(message?.channel?.name?.includes("citation")||message?.channel?.name.includes("allocution")||message?.channel?.name.includes("lois")||message?.channel?.name.includes("papier")||message?.channel?.name.includes("intime"))) {cmds.censor(message)};

		if (message.content[0]==='€'){
				content=message.content.slice(1).trim().split(/\s+/)
				if (typeof content != "undefined" && content != null && content.length != null && content.length > 0 && content[0]!='') {
					command=content.shift();
					switch (command){
						case ('citation'):
							cmds.citation(bot.channels,reply);
							break;
						case ('help'):
							cmds.help(reply);
							break;
						case ('crushhelp'):
							cmds.crushhelp(reply)
							break;
						case ('ping'):
							cmds.ping(reply);
							break;
						case ('say'):
							cmds.say(message.member,content,reply);
							break;
						case ('score'):
							cmds.score(memberOrMention(message),reply);
							break;
						case ('scorem'):
							cmds.scorem(message.member,memberOrMention(message),content,reply);
							break;
						case ('topscore'):
							cmds.topscore(content,reply);
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
		}
});


bot.on('guildMemberUpdate',function(oldMember,newMember){
	console.log(oldMember.roles.cache.size);
	console.log(newMember.roles.cache.size);
	//if (newMember.roles.cache.size != oldMember.roles.cache.size) updateMemRoles(newMember);
});

bot.on('roleUpdate',function(oldRole,newRole){
	console.log(oldRole.name+'->'+newRole.name);
});

bot.login(process.env.BOT_TOKEN);
const mysql = require('mysql');
const Discord=require('discord.js');

const correctionsLibrary=[
	{
		censoredWord:'dictature',
		allowedWord:'démocratie'
	},
	{
		censoredWord:'Dictature',
		allowedWord:'Démocratie'
	},
	{
		censoredWord:'DICTATURE',
		allowedWord:'DEMOCRATIE'
	},
	{
		censoredWord:'dictateur',
		allowedWord:'président'
	},
	{
		censoredWord:'Dictateur',
		allowedWord:'Président'
	},
	{
		censoredWord:'DICTATEUR',
		allowedWord:'PRESIDENT'
	},
	{
		censoredWord:'censure',
		allowedWord:'liberté'
	},
	{
		censoredWord:'Censure',
		allowedWord:'Liberté'
	},
	{
		censoredWord:'CENSURE',
		allowedWord:'LIBERTE'
	}
];

var con = mysql.createPool({
    connexionLimit : 10,
    host: "jhdjjtqo9w5bzq2t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	port: 3306,
    user: "t15xmeqh5vdzzd4m",
    password: process.env.DB_PWD,
	database: "ywv3b7ro3jcrn5hz"
});

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str;
}

function initScore(dest,modifier=0){
	user=dest.user;
	
	con.query('INSERT INTO bot_scores (citizen, modifier) VALUES ("'+user.username+'#'+user.discriminator+'",'+modifier+');', function (err2){if (err2) throw err2;});
	
	if (dest.roles.cache.size > 0){
		roleArray=[];
		for (const role of dest.roles.cache){
			roleArray.push([user.username+'#'+user.discriminator,role[1].name]);
		}
		con.query('INSERT INTO bot_roles (citizen, role) VALUES ?;',[roleArray], function (err2){if (err2) throw err2;});
	}
	return;
}

function updateMemberRoles(dest,modifier='NaN'){
	user=dest.user;
	
	if (modifier!='NaN') con.query('UPDATE bot_scores SET modifier='+modifier+' WHERE citizen="'+user.username+'#'+user.discriminator+'";', function (err2){if (err2) throw err2;});
	
	roleArray=[];
	roleInsert=[];
	for (const role of dest.roles.cache){
		roleArray.push(role[1].name);
		roleInsert.push([user.username+'#'+user.discriminator,role[1].name]);
	}
	
	con.query('DELETE FROM bot_roles WHERE citizen="'+user.username+'#'+user.discriminator+'";', function (err2){
		if (err2) throw err2;
		else{
			if (dest.roles.cache.size > 0){
				con.query('INSERT INTO bot_roles (citizen, role) VALUES ?;',[roleInsert], function (err){if (err) throw err;});
			}
		}
	});
	
	return(roleArray)
}

function censorWord(correction, content){
	return(content.replace(correction.censoredWord,correction.allowedWord));
}

module.exports = {
	
	censor : function(message){
		correctedContent=message.content;
		
		for (i=0 ; i<correctionsLibrary.length ; i++) {
			correctedContent=censorWord(correctionsLibrary[i],correctedContent);
		}
		
		if(correctedContent!=message.content){
			message.delete();
			message.channel.send(`<@${message.member.id}> a dit : ${correctedContent}`);
		}
		return;
	},
	
	updateMemRoles : function(member) {
		updateMemberRoles(member)
		return;
	},
	
	updateRole : function(oldName,newName) {
		
		return;
	},
	
	citation : function(channels,callback) {
		 const channel = channels.cache.find(channel => channel.id === "779064607443779594");
		 channel.messages.fetch({ limit: 100 })
			.then(messages => callback(messages.filter(message => message.content.includes('"')).random(1)[0].content))
			.catch(console.error);
		 return;
	},
	
	help : function(callback) {
		commandes=[
			"citation",
			"help",
			"ping",
			"say * ...",
			"score [@user]",
			"scorem * [@user] [i]",
			"topscore [i]"
		];
		descriptions=[
			"Renvoie une citation aléatoire du channel 💫punchlines-et-citations",
			"Affiche la liste des commandes",
			"Répond 'Pong !'",
			"Répète ce qui suit",
			"Affiche le score de citoyenneté de l'utilisateur",
			"Applique un modificateur i au score de citoyenneté de l'utilisateur",
			"Affiche la page i du classement des citoyens modèles"
		];
		const textEmbed = new Discord.MessageEmbed()
			.setColor('#318ce7')
			.setTitle("**Merci d'utiliser le bot Discord des RUDF !**")
			.setDescription("Les commandes sont utilisées avec le préfixe '**€**'. Une étoile (*) indique que les permissions d'administrateur sont nécessaires.");
			for (i=0;i<commandes.length;i++){
				textEmbed.addField(commandes[i], descriptions[i], false );
			}
			
		callback(textEmbed);
		return;
	},
	
	ping : function(callback) {callback('Pong !'); return;},
	
	say : function(member,content,callback) {
		if (member.hasPermission("ADMINISTRATOR")) {
			text=content.join(' ').trim();
			if (text!='') callback(text);
			else callback("impossible de répéter cela.", true);
		}
		else callback('vous devez être un haut fonctionnaire des Républiques pour pouvoir influencer les médias.',true);
		return;
	},
	
	score : function(dest,callback) {
		user=dest.user;
		con.query('SELECT modifier FROM bot_scores WHERE citizen ="'+user.username+'#'+user.discriminator+'" LIMIT 1;', function (err,result){
			
			if (err || !result.length) {
				initScore(dest);
				modifier=0;
			}
			else {
				modifier=result[0].modifier;
			}
			if (dest.roles.cache.size > 0){
				
				roleArray=updateMemberRoles(dest);
				
				roleString=roleArray.join('","');
				
				con.query('SELECT value FROM bot_role_scores WHERE role IN ("'+roleString+'");', function (err2,result2){
					if (err2) {
							throw err2;
					}
					roleValue=0;
					for (const res of result2) {
						roleValue+=res.value;
					}
					callback(`Le score de citoyenneté de ${user} est de **${Math.min(Math.max(modifier+roleValue,-1000),1000)}**.`);
				});
			}
			else {
				callback(`Le score de citoyenneté de ${user} est de **${modifier}**.`);
			}
			
		});
		return;
	},
	
	scorem : function(member,dest,content,callback) {
		if (member.hasPermission("ADMINISTRATOR")){
			user=dest.user;
			if (content.length>0 && content[0].startsWith('<')) content.shift();
			if (content.length>0 && isNormalInteger(content[0]) ){
			
				val=Math.floor(Number(content.shift()));
				
				if (Math.abs(val)<=100){
				
					con.query('SELECT modifier FROM bot_scores WHERE citizen ="'+user.username+"#"+user.discriminator+'" LIMIT 1;', function (err,result){
						
						if (err || !result.length) {
							initScore(dest,val);
							modifier=val;
						}
						else {
							modifier=result[0].modifier+val;
							if (modifier>1000){modifier=1000}
							if (modifier<-1000){modifier=-1000}
							con.query('UPDATE bot_scores SET modifier='+modifier+' WHERE citizen="'+user.username+'#'+user.discriminator+'";', function (err2){if (err2) throw err2;});
							
						}
						
						if (dest.roles.cache.size > 0){
							
							roleArray=updateMemberRoles(dest);
							
							roleString=roleArray.join('","');
							
							con.query('SELECT value FROM bot_role_scores WHERE role IN ("'+roleString+'");', function (err2,result2){
								if (err2) {
										throw err2;
								}
								roleValue=0;
								for (res of result2) {
									roleValue+=res.value;
								}
								callback(`Le score de citoyenneté de ${user} a été modifié de ${val}, le portant à **${Math.min(Math.max(modifier+roleValue,-1000),1000)}**.`);
							});
						}
						else {
							callback(`Le score de citoyenneté de ${user} a été modifié de ${val}, le portant à **${modifier}**.`);
						}
						
					});
				}
				else { 
					callback('Le modificateur de score doit être inclus entre -100 et 100.');
				}
			}
			else{
				callback('Modificateur de score non reconnu.');
			}
		}
		else callback('vous devez être un haut fonctionnaire des Républiques pour pouvoir changer un score de citoyenneté.',true);
		return;
	},
	
	topscore : function(content,callback) {
		
		page=1
		
		if (content.length>0 && isNormalInteger(content[0]) ){
				val=Math.floor(Number(content.shift()))
				if (val>0) page=val;
		}
		con.getConnection(function(connErr,connection){
			if (connErr) {
				connection.release(); // give connection back to the pool
				throw connErr;
			}
			connection.query('SELECT bot_roles.citizen, modifier+SUM(VALUE) AS score FROM bot_roles JOIN bot_scores ON bot_roles.citizen=bot_scores.citizen LEFT JOIN bot_role_scores ON bot_roles.role=bot_role_scores.role GROUP BY citizen ORDER BY score DESC LIMIT '+(page-1)*10+',10;', function (err,result){
				
				if (err){
					connection.release(); // give connection back to the pool
					throw err;
				}
					
				connection.query('SELECT COUNT(bot_roles.citizen) AS total FROM bot_roles JOIN bot_scores ON bot_roles.citizen=bot_scores.citizen LEFT JOIN bot_role_scores ON bot_roles.role=bot_role_scores.role GROUP BY bot_roles.citizen;', function (err,totalRows){
					if (err || !totalRows.length){
						connection.release(); // give connection back to the pool
						throw err;
					}
					pageMax=Math.ceil(totalRows.length/10);
					
					const textEmbed = new Discord.MessageEmbed();
					
					if(!result.length) {
						textEmbed.setColor('#318ce7')
							.setTitle('Classement des citoyens modèles')
							.addField('Aucun citoyen trouvé', 'La page demandée est peut-être hors limite.')
							.setFooter('Page '+page+'/'+pageMax);
						
					}
					
					else {
						citoyens=[];
						scores=[];
						for (pos of result){
							citoyens.push(pos.citizen);
							scores.push(Math.min(Math.max(pos.score,-1000),1000));
						}
						rang=Array(citoyens.length).fill().map((x,i)=>i+(page-1)*10+1);
						
						textEmbed.setColor('#318ce7')
							.setTitle('Classement des citoyens modèles')
							.addFields(
								{ name: 'Rang', value: rang.join('\n'), inline: true },
								{ name: 'Citoyen', value: citoyens.join('\n'), inline: true },
								{ name: 'Score', value: scores.join('\n'), inline: true },
							)
							.setFooter('Page '+page+'/'+pageMax);
					}
					
					callback(textEmbed);
					connection.release(); // give connection back to the pool	
					
				});
					
			});
				
		});
		
		return;
	}
};

// message.channel.fetchMessages().then(async messages => {
    // console.log(`${messages.size} procuradas.`);

    // let finalArray = [];

    // const putInArray = async (data) => finalArray.push(data);
    // const handleTime = (timestamp) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a").replace("pm", "PM").reaplce("am", "AM"); 

    // for (const message of messages.array().reverse()) await putInArray(`${handleTime(message.timestamp)} ${msg.author.username} : ${msg.content}`); 

    // console.log(finalArray);
    // console.log(finalArray.length);

// });
// const channel = client.channels.cache.find(channel => channel.name === channelName)
// channel.send(message)
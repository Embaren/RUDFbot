const mysql = require('mysql');
const Discord=require('discord.js');

const correctionsLibrary=[
	{
		censoredWord:'dictature',
		allowedWord:'république'
	},
	{
		censoredWord:'Dictature',
		allowedWord:'République'
	},
	{
		censoredWord:'DICTATURE',
		allowedWord:'REPUBLIQUE'
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
		censoredWord:'dictatrice',
		allowedWord:'présidente'
	},
	{
		censoredWord:'Dictatrice',
		allowedWord:'Présidente'
	},
	{
		censoredWord:'DICTATRICE',
		allowedWord:'PRESIDENTE'
	},
	{
		censoredWord:'DICTATORIAL',
		allowedWord:'REPUBLICAIN'
	},
	{
		censoredWord:'dictatorial',
		allowedWord:'républicain'
	},
	{
		censoredWord:'Dictatorial',
		allowedWord:'Républicain'
	},
	{
		censoredWord:'LE DESPOTISME',
		allowedWord:'LA DEMOCRATIE'
	},
	{
		censoredWord:'le DESPOTISME',
		allowedWord:'la DEMOCRATIE'
	},
	{
		censoredWord:'Le DESPOTISME',
		allowedWord:'La DEMOCRATIE'
	},
	{
		censoredWord:'le despotisme',
		allowedWord:'la démocratie'
	},
	{
		censoredWord:'Le despotisme',
		allowedWord:'La démocratie'
	},
	{
		censoredWord:'le Despotisme',
		allowedWord:'la Démocratie'
	},
	{
		censoredWord:'Ce Despotisme',
		allowedWord:'Cette Démocratie'
	},
	{
		censoredWord:'CE DESPOTISME',
		allowedWord:'CETTE DEMOCRATIE'
	},
	{
		censoredWord:'ce DESPOTISME',
		allowedWord:'cette DEMOCRATIE'
	},
	{
		censoredWord:'Ce DESPOTISME',
		allowedWord:'Cette DEMOCRATIE'
	},
	{
		censoredWord:'ce despotisme',
		allowedWord:'cette démocratie'
	},
	{
		censoredWord:'Ce despotisme',
		allowedWord:'Cette démocratie'
	},
	{
		censoredWord:'ce Despotisme',
		allowedWord:'CETTE Démocratie'
	},
	{
		censoredWord:'Ce Despotisme',
		allowedWord:'Cette Démocratie'
	},
	{
		censoredWord:'DESPOTISME',
		allowedWord:'DEMOCRATIE'
	},
	{
		censoredWord:'despotisme',
		allowedWord:'démocratie'
	},
	{
		censoredWord:'Despotisme',
		allowedWord:'Démocratie'
	},
	{
		censoredWord:'DESPOTIQUE',
		allowedWord:'DEMOCRATIQUE'
	},
	{
		censoredWord:'despotique',
		allowedWord:'démocratique'
	},
	{
		censoredWord:'Despotique',
		allowedWord:'Démocratique'
	},
	{
		censoredWord:'DESPOTE',
		allowedWord:"CHEF D'ETAT"
	},
	{
		censoredWord:'despote',
		allowedWord:"chef d'Etat'"
	},
	{
		censoredWord:'Despote',
		allowedWord:"Chef d'Etat"
	},
	{
		censoredWord:'censurer',
		allowedWord:'libérer'
	},
	{
		censoredWord:'Censurer',
		allowedWord:'Libérer'
	},
	{
		censoredWord:'CENSURER',
		allowedWord:'LIBERER'
	},
	{
		censoredWord:'la censure',
		allowedWord:'la liberté'
	},
	{
		censoredWord:'La censure',
		allowedWord:'La liberté'
	},
	{
		censoredWord:'la Censure',
		allowedWord:'la Liberté'
	},
	{
		censoredWord:'La Censure',
		allowedWord:'La Liberté'
	},
	{
		censoredWord:'LA CENSURE',
		allowedWord:'LA LIBERTE'
	},
	{
		censoredWord:'la CENSURE',
		allowedWord:'la LIBERTE'
	},
	{
		censoredWord:'La CENSURE',
		allowedWord:'La LIBERTE'
	},
	{
		censoredWord:'une censure',
		allowedWord:'une liberté'
	},
	{
		censoredWord:'Une censure',
		allowedWord:'Une liberté'
	},
	{
		censoredWord:'une Censure',
		allowedWord:'une Liberté'
	},
	{
		censoredWord:'cette censure',
		allowedWord:'cette liberté'
	},
	{
		censoredWord:'Cette censure',
		allowedWord:'Cette liberté'
	},
	{
		censoredWord:'cette Censure',
		allowedWord:'cette Liberté'
	},
	{
		censoredWord:'Cette Censure',
		allowedWord:'Cette Liberté'
	},
	{
		censoredWord:'Une Censure',
		allowedWord:'Une Liberté'
	},
	{
		censoredWord:'UNE CENSURE',
		allowedWord:'UNE LIBERTE'
	},
	{
		censoredWord:'une CENSURE',
		allowedWord:'une LIBERTE'
	},
	{
		censoredWord:'Une CENSURE',
		allowedWord:'Une LIBERTE'
	},
	{
		censoredWord:'CETTE CENSURE',
		allowedWord:'CETTE LIBERTE'
	},
	{
		censoredWord:'cette CENSURE',
		allowedWord:'cette LIBERTE'
	},
	{
		censoredWord:'Cette CENSURE',
		allowedWord:'Cette LIBERTE'
	},
	{
		censoredWord:'censure',
		allowedWord:'libère'
	},
	{
		censoredWord:'Censure !',
		allowedWord:'Liberté !'
	},
	{
		censoredWord:'Censure',
		allowedWord:'Libère'
	},
	{
		censoredWord:'CENSURE !',
		allowedWord:'LIBERTE !'
	},
	{
		censoredWord:'CENSURE',
		allowedWord:'LIBERE'
	},
	{
		censoredWord:'censuré',
		allowedWord:'libéré'
	},
	{
		censoredWord:'Censuré',
		allowedWord:'Libéré'
	},
	{
		censoredWord:'LA BAS',
		allowedWord:'LA-BAS'
	},
	{
		censoredWord:'LÀ BAS ',
		allowedWord:'LÀ-BAS '
	},
	{
		censoredWord:'la bas ',
		allowedWord:'là-bas '
	},
	{
		censoredWord:'là bas',
		allowedWord:'là-bas'
	},
	{
		censoredWord:'Là bas',
		allowedWord:'Là-bas'
	},
	{
		censoredWord:'A BAS',
		allowedWord:'VIVE'
	},
	{
		censoredWord:'À BAS',
		allowedWord:'VIVE'
	},
	{
		censoredWord:'à bas',
		allowedWord:'vive'
	},
	{
		censoredWord:'a bas',
		allowedWord:'vive'
	},
	{
		censoredWord:'A bas',
		allowedWord:'Vive'
	},
	{
		censoredWord:'À bas',
		allowedWord:'Vive'
	},
	{
		censoredWord:'lvive',
		allowedWord:'la bas'
	},
	{
		censoredWord:'Lvive',
		allowedWord:'La bas'
	},
	{
		censoredWord:'LVIVE',
		allowedWord:'LA BAS'
	},
	{
		censoredWord:'vivee',
		allowedWord:'à base'
	},
	{
		censoredWord:'Vivee',
		allowedWord:'A base'
	},
	{
		censoredWord:'VIVEE',
		allowedWord:'A BASE'
	},
	{
		censoredWord:'A MORT LES',
		allowedWord:'LONGUE VIE AUX'
	},
	{
		censoredWord:'À MORT LES',
		allowedWord:'LONGUE VIE AUX'
	},
	{
		censoredWord:'à mort les',
		allowedWord:'longue vie aux'
	},
	{
		censoredWord:'A mort les',
		allowedWord:'Longue vie aux'
	},
	{
		censoredWord:'À mort les',
		allowedWord:'Longue vie aux'
	},
	{
		censoredWord:'A MORT LE',
		allowedWord:'LONGUE VIE AU'
	},
	{
		censoredWord:'À MORT LE',
		allowedWord:'LONGUE VIE AU'
	},
	{
		censoredWord:'à mort le',
		allowedWord:'longue vie au'
	},
	{
		censoredWord:'A mort le',
		allowedWord:'Longue vie au'
	},
	{
		censoredWord:'À mort le',
		allowedWord:'Longue vie au'
	},
	{
		censoredWord:'A MORT',
		allowedWord:'LONGUE VIE A'
	},
	{
		censoredWord:'À MORT',
		allowedWord:'LONGUE VIE A'
	},
	{
		censoredWord:'à mort',
		allowedWord:'longue vie à'
	},
	{
		censoredWord:'A mort',
		allowedWord:'Longue vie à'
	},
	{
		censoredWord:'À mort',
		allowedWord:'Longue vie à'
	},
	
	
	
	{
		censoredWord:'la voisine',
		allowedWord:"l'artichaud"
	},
	{
		censoredWord:'La voisine',
		allowedWord:"L'artichaud"
	},
	{
		censoredWord:'LA VOISINE',
		allowedWord:"L'ARTICHAUD"
	},
	{
		censoredWord:'sa voisine',
		allowedWord:"son artichaud"
	},
	{
		censoredWord:'Sa voisine',
		allowedWord:"Son artichaud"
	},
	{
		censoredWord:'SA VOISINE',
		allowedWord:"SON ARTICHAUD"
	},
	{
		censoredWord:'voisine',
		allowedWord:"artichaud"
	},
	{
		censoredWord:'Voisine',
		allowedWord:"Artichaud"
	},
	{
		censoredWord:'VOISINE',
		allowedWord:"ARTICHAUD"
	},
	
	// Emile
	{
		censoredWord:'émile le superbe',
		allowedWord:"Emile"
	},
	{
		censoredWord:'émile le Superbe',
		allowedWord:"Emile"
	},
	{
		censoredWord:'emile le superbe',
		allowedWord:"Emile"
	},
	{
		censoredWord:'emile le Superbe',
		allowedWord:"Emile"
	},
	{
		censoredWord:'Emile le Superbe',
		allowedWord:"Emile"
	},
	{
		censoredWord:'Emile le superbe',
		allowedWord:"Emile"
	},
	{
		censoredWord:'EMILE LE SUPERBE',
		allowedWord:"EMILE"
	},
	{
		censoredWord:'Émile le superbe',
		allowedWord:"Emile"
	},
	{
		censoredWord:'ÉMILE LE SUPERBE',
		allowedWord:"EMILE"
	},
	{
		censoredWord:'Emile',
		allowedWord:"Emile le Superbe"
	},
	{
		censoredWord:'EMILE',
		allowedWord:"EMILE LE SUPERBE"
	},
	{
		censoredWord:'ÉMILE',
		allowedWord:"EMILE LE SUPERBE"
	},
	{
		censoredWord:'ÉMILE',
		allowedWord:"Emile le Superbe"
	},
	{
		censoredWord:'emile',
		allowedWord:"Emile le Superbe"
	},
	{
		censoredWord:'émile',
		allowedWord:"Emile le Superbe"
	},
	
	// Mina
	{
		censoredWord:'Mina la Violente',
		allowedWord:"Mina"
	},
	{
		censoredWord:'Mina la violente',
		allowedWord:"Mina"
	},
	{
		censoredWord:'MINA LA VIOLENTE',
		allowedWord:"MINA"
	},
	{
		censoredWord:'Mina',
		allowedWord:"Mina la Violente"
	},
	{
		censoredWord:'MINA',
		allowedWord:"MINA LA VIOLENTE"
	},
	
	// 
	{
		censoredWord:'Kolya le Mélancolique',
		allowedWord:"Kolya"
	},
	{
		censoredWord:'Kolya le mélancolique',
		allowedWord:"Kolya"
	},
	{
		censoredWord:'KOLYA LE MELANCOLIQUE',
		allowedWord:"KOLYA"
	},
	{
		censoredWord:'KOLYA LE MÉLANCOLIQUE',
		allowedWord:"KOLYA"
	},
	{
		censoredWord:'Kolya',
		allowedWord:"Kolya le Mélancolique"
	},
	{
		censoredWord:'KOLYA',
		allowedWord:"KOLYA LE MELANCOLIQUE"
	},
	
	
	// S'il
	{
		censoredWord:'SI\\*\\*\\* \\*\\*\\*IL',
		allowedWord:"S'IL"
	},
	{
		censoredWord:'SI\\*_ _\\*IL',
		allowedWord:"S'IL"
	},
	{
		censoredWord:'SI\\*\\*_ _\\*\\*IL',
		allowedWord:"S'IL"
	},
	{
		censoredWord:'SI\\*\\* \\*\\*IL',
		allowedWord:"S'IL"
	},
	{
		censoredWord:'SI IL',
		allowedWord:"S'IL"
	},
	{
		censoredWord:'SI\xa0IL', // Non-breaking space
		allowedWord:"S'IL"
	},
	{
		censoredWord:'Si\\*\\*\\* \\*\\*\\*il',
		allowedWord:"S'il"
	},
	{
		censoredWord:'Si\\*_ _\\*il',
		allowedWord:"S'il"
	},
	{
		censoredWord:'Si\\*\\*_ _\\*\\*il',
		allowedWord:"S'il"
	},
	{
		censoredWord:'Si\\*\\* \\*\\*il',
		allowedWord:"S'il"
	},
	{
		censoredWord:'Si il',
		allowedWord:"S'il"
	},
	{
		censoredWord:'Si\xa0il', // Non-breaking space
		allowedWord:"S'il"
	},
	{
		censoredWord:'si\\*\\*\\* \\*\\*\\*il',
		allowedWord:"s'il"
	},
	{
		censoredWord:'si\\*_ _\\*il',
		allowedWord:"s'il"
	},
	{
		censoredWord:'si\\*\\*_ _\\*\\*il',
		allowedWord:"s'il"
	},
	{
		censoredWord:'si\\*\\* \\*\\*il',
		allowedWord:"s'il"
	},
	{
		censoredWord:'si il',
		allowedWord:"s'il"
	},
	{
		censoredWord:'si\xa0il', // Non-breaking space
		allowedWord:"s'il"
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
	return(content.replace(new RegExp(correction.censoredWord, "g"),correction.allowedWord));
}

module.exports = {
	
	censor : function(message){		
		correctedContent=message.content;
		
		for (i=0 ; i<correctionsLibrary.length ; i++) {
			correctedContent=censorWord(correctionsLibrary[i],correctedContent);
		}
		
		if(correctedContent!=message.content){
			try{
				message.delete();
			}
			catch(err){
				console.log("Message not deleted : ");
				console.log(err);
			}
			message.channel.send(`**<@${message.member.id}> a dit :**
${correctedContent}`);
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

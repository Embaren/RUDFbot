const mysql = require('mysql');

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

module.exports = {
	
	updateMemRoles : function(member) {
		updateMemberRoles(member)
		return;
	},
	
	updateRole : function(oldName,newName) {
		
		return;
	},
	
	help : function(callback) {callback("**Merci d'utiliser le bod Discord des RUDF !**\nLes commandes sont utilisées avec le préfixe '€' :\n - help : Affiche la liste des commandes\n - ping : Répond 'Pong !'\n - say : Répète ce qui suit\n - score [@user] : Affiche le score de citoyenneté de l'utilisateur\n - scorem [@user] m : Applique un modificateur m au score de citoyenneté de l'utilisateur"); return;},
	
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
							initScore(val);
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
	}
};
// CREATE USER 'RUDF_bot'@'%' IDENTIFIED BY 'RUDFbot2021';
// GRANT SELECT, INSERT, UPDATE, DELETE ON 3738770_rudf.bot_scores TO 'RUDF_bot'@'%';
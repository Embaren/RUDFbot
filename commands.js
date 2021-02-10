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

module.exports = {
	help : function(callback) {callback("**Merci d'utiliser le bod Discord des RUDF !**\nLes commandes sont utilisées avec le préfixe '€' :\n - help : Affiche la liste des commandes\n - ping : Répond 'Pong !'\n - score : Affiche votre score de citoyenneté\n - scorem : Applique un modificateur à votre score de citoyenneté");},
	
	ping : function(callback) {callback('Pong !')},
	
	score : function(author,callback) {
		con.query('SELECT modifier FROM bot_scores WHERE citizen ="'+author.username+author.discriminator+'" LIMIT 1;', function (err,result){
			
			if (err) {
				con.query('INSERT INTO bot_scores (citizen, modifier) VALUES ("'+author.username+author.discriminator+'",0);', function (err2){if (err2) throw err2;});
				modifier=0;
			}
			else {
				modifier=result[0].modifier;
			}
			console.log(author.username+' : '+modifier);
			callback("Score : "+modifier);
		});
	},
	
	scorem : function(user,content,callback) {
		if (content.length>0 && content[0].startsWith('<')) content.shift();
		if (content.length>0 && isNormalInteger(content[0]) ){
		
			val=Math.floor(Number(content.shift()));
			
			if (Math.abs(val)<=100){
			
				con.query('SELECT modifier FROM bot_scores WHERE citizen ="'+user.username+user.discriminator+'" LIMIT 1;', function (err,result){
					
					if (err) {
						con.query('INSERT INTO bot_scores (citizen, modifier) VALUES ("'+user.username+user.discriminator+'",'+val+');', function (err2){if (err2) throw err2;});
					}
					else {
						modifier=result[0].modifier+val;
						if (modifier>1000){modifier=1000}
						if (modifier<-1000){modifier=-1000}
						con.query('UPDATE bot_scores SET modifier='+modifier+' WHERE citizen="'+user.username+user.discriminator+'";', function (err2){if (err2) throw err2;});
						
					}
					console.log(user.username+' : '+modifier);
					callback(`${user.username} : votre score de citoyenneté a été modifié de ${val}.`);
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
};
// CREATE USER 'RUDF_bot'@'%' IDENTIFIED BY 'RUDFbot2021';
// GRANT SELECT, INSERT, UPDATE, DELETE ON 3738770_rudf.bot_scores TO 'RUDF_bot'@'%';
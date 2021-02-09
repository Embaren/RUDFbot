const mysql = require('mysql');

var con = mysql.createPool({
    connexionLimit : 10,
    host: "fdb28.awardspace.net",
	port: 3306,
    user: "3738770_rudf",
    password: "RUDF20170624222719",
	database: "3738770_rudf"
});

module.exports = {
	help : function(page=1) {return "**Merci d'utiliser le bod Discord des RUDF !**\nLes commandes sont utilisées avec le préfixe '€' :\n - help : Affiche la liste des commandes\n - ping : Répond 'Pong !'"},
	ping : function() {return 'Pong !'},
	score : function(author) {
		con.query("SELECT Modifier FROM bot_scores WHERE Citizen ="+author.username+author.discriminator+" LIMIT 1;", function (err,result){
			
		console.log(author);
			if (err) {
				throw err;
				con.query("INSERT INTO 3738770_rudf.bot_scores (Citizen, Modifier) VALUES ("+author.username+author.discriminator+",0);");
				modifier=0;
				console.log(author.username+author.discriminator);
			}
			else {
				modifier=result[0].modifier;
			}
			console.log(modifier);
			return("Modifieur : "+modifier);
		});
		return("L'accès à votre score de citoyenneté n'a pas pu aboutir.")
	}
};

// CREATE USER 'RUDF_bot'@'%' IDENTIFIED BY 'RUDFbot2021';
// GRANT SELECT, INSERT, UPDATE, DELETE ON 3738770_rudf.bot_scores TO 'RUDF_bot'@'%';
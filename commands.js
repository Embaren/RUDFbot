const mysql = require('mysql');

var con = mysql.createPool({
    connexionLimit : 10,
    host: "jhdjjtqo9w5bzq2t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	port: 3306,
    user: "t15xmeqh5vdzzd4m",
    password: process.env.DB_PWD,
	database: "ywv3b7ro3jcrn5hz"
});

module.exports = {
	help : function(page=1) {return "**Merci d'utiliser le bod Discord des RUDF !**\nLes commandes sont utilisées avec le préfixe '€' :\n - help : Affiche la liste des commandes\n - ping : Répond 'Pong !'"},
	ping : function() {return 'Pong !'},
	score : function(author) {
		con.query("SELECT modifier FROM bot_scores WHERE citizen ="+author.username+author.discriminator+" LIMIT 1;", function (err,result){
			
		console.log(author);
			if (err) {
				con.query("INSERT INTO bot_scores (citizen, modifier) VALUES ("+author.username+author.discriminator+",0);");
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
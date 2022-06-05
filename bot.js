// chargement de la librairie
const Discord = require('discord.js');
// instanciation d'un nouveau bot
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// librairie date https://momentjs.com/
const moment = require ('moment');
moment.locale('fr');

// on importe le token 
const config = require ('./config');

// on utilisera ! comme prefix
const prefix = "!";
// test si le bot est en ligne
client.on('ready',()=>{
    console.log('Coucou l\'Adrar');
});

// Afficher une erreur
client.on('error',console.error);

    // on enregistre le coupable
    tableau = [];
// test du ping
client.on("message", message =>{
    // je ne souhaite pas que le bot se réponde
    if(message.author.bot) return;
        // information du réglement
        if (message.content === prefix+"help") {
            message.reply("Vous pouvez utiliser les commandes suivantes !rules, !chocolatine (pour piéger la personne) , !guilty");
        }

    // on va stock dans une variable notre travail
    if (message.content === prefix+"chocolatine") {
        // on stock la réponse qui suit la chocolatine 
        message.content.slice("chocolatine".lenght).trim();
        // on envoie une confirmation    
        message.reply('Une victime va ralas ses chocolatines');
        let user = message.author.username;
        tableau.push([user,moment().format('Do MMMM YYYY, HH:mm:ss')]);
    }

    // information du réglement
        if (message.content === prefix+"rules") {
            message.reply("Vous pouvez accéder au régles du jeu ici https://www.chocoblast.fr/reglement/");
        }

    // obtenir le nom des victimes
    if (message.content === prefix+"guilty") {
        for (let i = 0; i < tableau.length; i++) {
            message.reply(`La personne suivante ${tableau[i][0]} s'est faite avoir le ${tableau[i][1]}`); 
        }              
    }
});

// TOKEN
client.login(config.token);
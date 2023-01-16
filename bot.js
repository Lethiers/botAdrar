// chargement de la librairie
const Discord = require('discord.js');
// instanciation d'un nouveau bot
const { Client, Intents } = require('discord.js');
const client = new Discord.Client(
    { 
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
    });
// librairie date https://momentjs.com/
const moment = require ('moment');
moment.locale('fr');

// on va enregistrer dans un document
const fs = require('fs');
// on utilise la bibliothèque axios
const axios = require('axios');

// on importe le token 
const config = require ('./config');

// on utilisera ! comme prefix
const prefix = "!";
// test si le bot est en ligne
client.on('ready',()=>{
    console.log('le bot est en ligne');
});

// Afficher une erreur
client.on('error',console.error);

    // on enregistre le coupable
    // tableau = [];

client.on("messageCreate", message =>{
    // je ne souhaite pas que le bot se réponde
    if(message.author.bot) return;
    // information du réglement
    if (message.content.startsWith(prefix+'help')) {


    let arrayHelp = [
        ['!rules', 'les règles du chocoBlast'],
        ['!chocolatine', 'permet de chocoBlaster un colllègue'],
        ['!time', 'donne l\'heure'],
        ['!minuteur', 'un petit minuteur qui foncitone en minute'],
        ['!membres', 'pour avoir le nombres de membres du serveur'],
        ['!save', 'permet d\'enregistrer des mots ou des phrases dans un fichier texte'],
        ['!read', 'permet de lire l\'ensemble du fichier texte'],
        ['!random', 'permet de retourner un élément du fichier texte de manière aléatoire'],
        ['!meteo', 'permet de retourner la météo en spécifiant un lieu'],
];
    let tableau = "";
    arrayHelp.forEach(row => {
    tableau += "| " + row.join(" | ") + " |\n";
    });
    message.channel.send("```markdown\n" +"#"+"voici la liste des commandes"+"\n"+ tableau + "```");
    } 
    // information du réglement
    if (message.content.startsWith(prefix+'rules')) {
        message.channel.send("Vous pouvez accéder au régles du jeu ici https://www.chocoblast.fr/reglement/");
    }

    // on va stock dans une variable notre travail
    if (message.content.startsWith(prefix+'chocolatine')) {
        // on stock la réponse qui suit la chocolatine 
        message.content.slice("chocolatine".lenght).trim();
        let user = message.author.username;

        let chocolatine = (`la perosnne suivante : ${user} c'est faite chocoBlaster le ${moment().format('Do MMMM YYYY, HH:mm:ss')}`);

        let path = '/choco.txt';


        if (fs.existsSync(path)) {            
            fs.appendFile("choco.txt",chocolatine + "\n",(err)=>{
                if (err) {
                    message.channel.send("un problème est survenu lors de l'enregistrement");
                }else{
                    // on envoie une confirmation    
                    message.channel.send(`${chocolatine}`);
                }
            })

        }else{
            fs.writeFile(path,chocolatine + "\n",(err)=>{
                if (err) {
                    message.channel.send("un problème est survenu lors de l'enregistrement");
                }else{
                    message.channel.send(`${chocolatine}`);
                }
            })
        }
    }

    // obtenir le nom des victimes
    if (message.content.startsWith(prefix+'guilty')) {

        fs.readFile('choco.txt','utf8',function (err, data) {
            if (err) throw err;
            console.log(data);
            message.channel.send(data);
        });          
    }

    if (message.content.startsWith(prefix+'time')) {
        // Ici, on récupère la date et l'heure actuelles.
        let now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
    
        // On répond à l'utilisateur avec l'heure actuelle.
        message.channel.send(`Il est ${hour} heures et ${minute} minutes`);
    }

    if (message.content.startsWith(prefix+'minuteur')) {
        // Récupérer les arguments passés à la commande
        const args = message.content.split(' ');
    
        // Vérifier que l'utilisateur a fourni un argument
        if (args.length < 2) {
        message.channel.send('Vous devez fournir un nombre de minutes pour le minuteur.');
        return;
        }
    
        // Récupérer le nombre de minutes
        const minutes = parseInt(args[1]);
    
        // Vérifier que le nombre de minutes est un entier
        if (isNaN(minutes)) {
          message.channel.send('Vous devez fournir un nombre entier de minutes.');
          return;
        }
    
        // Initialisation du minuteur
        let timeRemaining = minutes * 60;
        message.channel.send(`le minuteur démare avec ${timeRemaining} secondes.`);
        let timerInterval = setInterval(() => {
          timeRemaining--;
          console.log(`Il reste ${timeRemaining} secondes.`);
    
          // Si le minuteur est terminé
          if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            message.channel.send(`Le minuteur de ${minutes} minutes est terminé !`);
          }
        }, 1000);
      }

      if (message.content.startsWith(prefix+'membres')) {
        message.channel.send(`Ce serveur contient ${message.guild.memberCount} membres!`);
    }    

    if (message.content.startsWith(prefix+'save')) {
        // Récupérer les arguments passés à la commande
        const phrase = message.content.replace('!save','');

        console.log(message.content);

        let path = '/save.txt';

        if (fs.existsSync(path)) {            
            fs.appendFile("save.txt",phrase+"\n",(err)=>{
                if (err) {
                    message.channel.send("un problème est survenu lors de l'enregistrement");
                    return;
                }else{
                    message.channel.send(`je viens d'enregistrer: ${phrase}`);
                    return;
                }
            })        
        }else{
            fs.writeFile(path,phrase,(err)=>{
                if (err) {
                    message.channel.send("un problème est survenu lors de l'enregistrement");
                    return;
                }else{
                    message.channel.send(`je viens d'enregistrer: ${phrase}`);
                    return;
                }
            })
        }
    }

    if (message.content.startsWith(prefix+'read')) {

        fs.readFile('save.txt','utf8',function (err, data) {
            if (err) throw err;
            console.log(data);
            message.channel.send(data);
        });      
    }

    if (message.content.startsWith(prefix+'random')) {
        


        fs.readFile('save.txt','utf8',function (err, data) {
            if (err) throw err;
            console.log(data);
            let arraySave = data.split("\n");
            // je retire le dernier élément vu qu'il est vide
            arraySave.pop();
            console.log(arraySave.length);
            let randomIndexSave = Math.floor(Math.random()*arraySave.length);



            message.channel.send(`voici une phrase pris au hasard : ${arraySave[randomIndexSave]}`);
        });      
    }


    if (message.content.startsWith(prefix+'meteo')) {

        const args = message.content.split(' ');
        if (args.length<2) {
            message.channel.send("j'ai besoin d'une localisation");
            return;
        }else{
            const location = message.content.split(' ')[1];
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location},fr&units=metric&appid=${config.tokenMeteo}&lang=fr`)
              .then(response => {
                const temp = response.data.main.temp;
                const weather = response.data.weather[0].description;
                message.channel.send(`La météo à ${location} est actuellement de ${temp}°C avec ${weather}`);
              })
              .catch(error => {
                console.log(error);
                message.channel.send(`Désolé, je n'ai pas pu récupérer la météo pour ${location}.`);
              });
        }
      }
});

// TOKEN
client.login(config.token);
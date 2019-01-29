//Importation de la bibliotheque Express
const express = require("express");

//Importation du module body-parser
const bodyParser = require("body-parser");


//Importation des routes
const apiRouter = require("./module/api-routes");
const appRouter = require("./module/app-routes");

//Initialisation de l'application Express
const app = express();

//Définition du dossier contenant les vues
app.set("views", "./views");
//Définiton du moteur de rendu des vues
app.set("view engine", "pug");


// Traitement des données postées par une requete Ajax
app.use(bodyParser.json());


// traitement des données postées par un formulaire WEB
app.use(bodyParser.urlencoded({extended: true}));

//Gestion des ressources statiques
app.use(express.static(__dirname + '/public'));

//Utilisation des routes importées
app.use("/api", apiRouter);
app.use(appRouter);


//Lancement de l'application 
app.listen(3000);
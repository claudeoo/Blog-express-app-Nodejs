//Importation de la bibliotheque Express
const express = require("express");
const router = express.Router();

const sha1 = require("sha-1");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// On definie la variable avant de definir les routes sinon ils comprend pas
var defaultPageTitle = "Titre Par Default";

//Importation de module de base de données
const db =require("./db-connection");

router.use(cookieParser());
router.use(session({secret: "chuuuut",
                    resave:true,
                    saveUninitialized: true
}));
//Middleware de récupération de la liste des articles
router.use("/", (req,res,next) => {
    db.query("SELECT * FROM articles", (err, data)=> {
        if(err){
            res.status(404).send(err);
        } else {
            req.articles = data;
            next();
        }
    });
});

router.post("^/articles/:id([0-9]+)$",(req, res, next) =>{
    let postedData = {
        email: req.body.email,
        texte: req.body.texte,
        article_id: req.params.id
    };

    db.query("INSERT INTO commentaires SET ?", postedData,
    (err)=>{
        if(err){
            res.status(500).send(err);
        } else {
            res.redirect(req.url);
        }
    });
});

router.post("/inscription", (req,res, next)=> {
    let postedData =  {
        nom: req.body.nom,
        prenom:req.body.prenom,
        email: req.body.email,
        mot_de_passe: sha1(req.body.mot_de_passe)
    };

    db.query("INSERT INTO auteurs SET ?", postedData,
        (err) => {
            if(err){
                //500 erreur du serveur
                res.status(500).send(err);
            } else {
                res.redirect("/");
            }
        }
    )
});

//Middleware pour la recuperation des données d'un article
router.use("^/articles/:id([0-9]+)$", (req, res, next) =>{
    db.query("SELECT * FROM articles WHERE id=?",
        [req.params.id],
        (err, data) =>{
            if(err){
                res.status(404).send(err);
            } else {
                console.log(data);
                req.articles = data[0];
                next();
            }
        });
});

// Middleware pour la recuperation des commentaire d'un article 
router.use("^/articles/:id([0-9]+)$", (req, res, next) => {
    db.query(`SELECT email, texte, DATE_FORMAT(date_creation, '%d/%m/%y') as date_creation
                FROM commentaires WHERE article_id=?
                ORDER BY date_creation DESC`,
                [req.params.id],
                (err, data)=>{
                    if(err){
                        res.status(404).send(err);
                    } else {
                        req.commentaires = data;
                        next();
                    }   
            });
});

router.get("/",(req,res)=>{

    params = {
        pageTitle: "Ma super Application",
        userName: "username",
        fruitList: [
            "fraise", "framboise","cassis"
        ],
         personList:[
            {id:2, nom:"brahé",prenom:"tycho"},
            {id:3, nom:"turing", prenom:"alan"}
        ],
        articleList: req.articles
    }
   

   
res.render('home', params);

});

router.get("/inscription", (req, res)=>{
    res.render("inscription",{
        title: defaultPageTitle
    });
});

router.get("/login", (req, res)=>{
    let params = {error: req.session.errorMessage};
    req.session.errorMessage = null;
    res.render("login", params);
});

// Route pour le detail d'un article
router.get("^/articles/:id([0-9])+$",(req, res) =>{
    res.render("articles.pug", {
        article: req.articles,
        commentaires: req.commentaires
    });
});

//Middleware de recuperation de la liste des articles
router.use("^/$", (req,res,next) => {
    db.query("SELECT * FROM articles", (err,data)=>{
        if(err){
            res.status(404).send(err);
        } else{
            req.articles = data;
            next();
        }
    });
});

// Middleware pour le login
router.use("/login", (req,res, next)=> {
    if(req.method == "POST"){
        db.query("SELECT * FROM auteurs WHERE email=? and mot_de_passe=?",
        [req.body.email, sha1(req.body.mot_de_passe)],
        (err, data) => {
            if(err){
                res.status(500).send(err);
            } else if(data.length == 0){
                req.session.errorMessage = "votre identification a échouée"
                res.redirect("/login");
            } else {
                req.session.user = data[0];
                res.redirect("/");
            }

        });
    } else {
        next();
    }
});


router.get("/contact", (req, res)=>{
    res.render("contact",{
        pageTitle: "page contact",
        titleDefault: defaultPageTitle
    });
})

router.get("/hello/:name/:age", helloRoute);
function helloRoute (request, response){
    let html = `<style>h1{text-align:center; border:3px solid black;
                 border-radius:30px; background-color:brown;}
                 p{font-family:cursive; border:1px solid black; background-color:orange;
                 color:blue; margin:8px; width:658px; text-align:center;
                 border-radius:40px;padding: 10px;}
                 </style><h1> hello ` + "<p>" + request.params.name + "</p>" + "</h1>";
    if(request.params.age <18){
        html += "<p> vous avez " + request.params.age + " ans donc vous etes etes mineur </p>";
    }else {
        html += "<p> vous avez " + request.params.age + " ans donc vous etes majeur </p>";
    }
    response.status(200).send(html);  // on envoi une chaine de caractere qui sera la reposne 
}

function contactRoute(response){
    let html = "<h1> bonjour</h1>";

    response.status(200).send(html);

}

module.exports = router;
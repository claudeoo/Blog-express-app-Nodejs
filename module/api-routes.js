const express = require("express");
const router = express.Router();

//Importation de module de base de données
const db =require("./db-connection");

//Sécurisation des routes /api
router.use("/api/*",(request, response, next) =>{
    let key = request.query.key;
    if (key != "123"){
        response.send(403,"acces interdis");
    }
    //Appel au prochain middleware
    next();
});


router.get("/articles", (req, res) => {
    db.query("SELECT * FROM articles WHERE id=?",
    [req.params.id],
    (err, data)=>{
        if(err){
            
            res.status(404).send(err);
        } else {
            res.json(data);
        }
    });
});



module.exports = router;
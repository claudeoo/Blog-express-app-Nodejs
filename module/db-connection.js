// import de module mysql
const mysql = require("mysql");
//creation de la connexion
var connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: ""
    }
);

//ouverture de la base de données
connection.query("USE mediapart_blog");

//Exportation de module
module.exports = connection;

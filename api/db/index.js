const pg = require("pg");
const postgresUrl = "postgres://postgres@localhost/tweetydb";
const client = new pg.Client(postgresUrl);

client.connect((error) => {
    if(error) console.error("ERROR DE CONEXION ", error.stack);
    else console.log("Conexion Exitosa")
});

module.exports = client;




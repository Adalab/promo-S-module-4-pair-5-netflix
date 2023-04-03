const express = require('express');
const cors = require('cors');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// mySQL conection
const mysql = require("mysql2/promise");

let connection;

mysql
  .createConnection({
    host: "localhost",
    database: "netflix",
    user: "root",
    password: "pascuallaura95@",
  })
  .then((con) => {
    connection = con;
    connection
      .connect()
      .then(() => {
        console.log("Conectado con el identificador " + connection.threadId);
      })
      .catch((err) => {
        console.error("Error de conexion: " + err.stack);
      });
  })
  .catch((err) => {
    console.error("Error de configuración: " + err.stack);
  });

 server.get("/movies", (req, res) => {
   console.log("Pidiendo a la base de datos información de las pelis.");
   console.log(req.query);
   const genreFilterParam = req.query.genre;
   if(genreFilterParam !== '') {
    connection
    .query("SELECT * FROM movies WHERE gender = ?", [genreFilterParam])
    .then(([results, fields]) => {
          res.json({ success: true, movies: results });
      })
      .catch((err) => {
        throw err;
      });
   }
   else {
   connection
     .query("SELECT * FROM movies")
     .then(([results, fields]) => {
       console.log("Información recuperada:");
       results.forEach((result) => {
         console.log(result);
       });

       res.json({ success: true, movies: results });
     })
     .catch((err) => {
       throw err;
     });
   }  
 });


 
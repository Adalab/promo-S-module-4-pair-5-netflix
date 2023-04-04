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
   const genreFilterParam = req.query.genre;
   const sortFilterParam = req.query.sort || "asc" ;
   console.log(sortFilterParam)
   if(genreFilterParam !== '') {
    connection
    .query(`SELECT * FROM movies WHERE gender = ? ORDER BY title ${sortFilterParam}`, [genreFilterParam])
    .then(([results, fields]) => {
          res.json({ success: true, movies: results });
      })
      .catch((err) => {
        throw err;
      });
   }
   else {
   connection
     .query(`SELECT * FROM movies ORDER BY title ${sortFilterParam}`)
     .then(([results, fields]) => {
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

server.post("/login", (req, res) => {

  const {email, password} = req.body;
  if(!email || !password) {
       res.json({ success: false, errorMessage: "Usuaria/o no encontrada/o" });
     }

  else {
    connection
     .query("SELECT * FROM users WHERE email = ? AND password = ? ", [email, password])
     .then(([results, fields]) => {
       if (results.length > 0) {
          console.log("Información recuperada:");
          results.forEach((result) => {
            console.log(result);
          });

          res.json({ success: true, userId: results[0].idUsers });
        } else {
          res.json({ success: false, errorMessage: "Usuaria/o no encontrada/o" });
        }
        })
     .catch((err) => {
       throw err;
     });
    }
    }
)

const staticServerPathWeb = './src/public-react';
server.use( express.static(staticServerPathWeb));
 
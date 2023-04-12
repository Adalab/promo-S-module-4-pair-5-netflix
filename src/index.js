const express = require("express");
const cors = require("cors");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");
// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

const dbConnect = require("../config/connection");
dbConnect();

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
  const sortFilterParam = req.query.sort || "asc";
  console.log(sortFilterParam);
  if (genreFilterParam !== "") {
    connection
      .query(
        `SELECT * FROM movies WHERE gender = ? ORDER BY title ${sortFilterParam}`,
        [genreFilterParam]
      )
      .then(([results, fields]) => {
        res.json({ success: true, movies: results });
      })
      .catch((err) => {
        throw err;
      });
  } else {
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
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ success: false, errorMessage: "Usuaria/o no encontrada/o" });
  } else {
    connection
      .query("SELECT * FROM users WHERE email = ? AND password = ? ", [
        email,
        password,
      ])
      .then(([results, fields]) => {
        if (results.length > 0) {
          console.log("Información recuperada:");
          results.forEach((result) => {
            console.log(result);
          });

          res.json({ success: true, userId: results[0].idUsers });
        } else {
          res.json({
            success: false,
            errorMessage: "Usuaria/o no encontrada/o",
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  }
});

server.get("/movie/:movieId", (req, res) => {
  const foundMovie = req.params.movieId;
  const sql = "SELECT  * FROM movies WHERE id = ?";

  connection
    .query(sql, [foundMovie])
    .then(([results, fields]) => {
      const movie = results[0];
      res.render("movie", movie);
    })

    .catch((err) => {
      throw err;
    });
});

const Movie = require("../models/movies");
server.get("/movies_all_mongo", (req, res) => {
  const genreFilterParam = req.query.genre;
  const sortFilterParam = req.query.sort;

  if (genreFilterParam === "Todas") {
    query = Movie.find().sort({ title: sortFilterParam });
  } else if (genreFilterParam !== "") {
    query = Movie.find({ genre: { $eq: genreFilterParam } }).sort({
      title: sortFilterParam,
    });
  }
  query.then((document) => {
    res.json({
      success: true,
      movies: document,
    });
  });
});

const Favorite = require("../models/favorites");
const User = require("../models/users");

server.post("/favorites-add", (req, res) => {
  query = Movie.find({})
    .then((response) => console.log(response))
    .catch((error) => console.log(error));

  query = User.find({})
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
console.log("PROBANDO");
  let idMovie = "642d37e3584c5f2a97494f33";
  let idUser = "642d38f811083cc1d20975e8";
  const favorite = new Favorite({
    idUser: idUser,
    idMovie: idMovie,
    score: req.body.score,
  });
  favorite.save().then((response) => res.json(response));
});

server.get('/favorites-list/:idUser', (req, res) => {
  console.log(req.params.idUser)
  query = Favorite.find({idUser: req.params.idUser}).populate({path: "idMovie", select:"title"})
  .then((response) => res.json(response))
  .catch((error) => console.log(error));
});

const staticServerPathWeb = "./src/public-react";
server.use(express.static(staticServerPathWeb));

const staticImagesPathWeb = "./src/public-movies-images";
server.use(express.static(staticImagesPathWeb));

const staticCssPathWeb = "./src/public-movies-css";
server.use(express.static(staticCssPathWeb));

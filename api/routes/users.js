const express = require("express");
const usersRouter = express.Router();
const client = require ("../db/index")

//Escribí acá la ruta para obtener los tweets de un usuario en particular

usersRouter.get("/:name", (req, res, next) => {
    const name = req.params.name
    client.query("SELECT *, tweets.id AS tid FROM tweets INNER JOIN users ON tweets.user_id = users.id WHERE users.name = $1", [name],(err, result) => {
        if (err) return next(err); // pasa el error a Express
        const tweets = result.rows;
        res.json(tweets);
      }
    );
  });

module.exports = usersRouter;


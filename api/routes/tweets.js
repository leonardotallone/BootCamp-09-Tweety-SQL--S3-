const express = require("express");
const tweetsRouter = express.Router();
const client = require("../db/index");

//Escribí acá la ruta para obtener todos los tweets

tweetsRouter.get("/", (req, res, next) => {
  client.query(
    "SELECT t.id AS tid, u.name, t.content, t.imgurl FROM tweets AS t INNER JOIN users AS u ON u.id = t.user_id",
    (err, result) => {
      if (err) return next(err); // pasa el error a Express
      const tweets = result.rows;
      res.json(tweets);
    }
  );
});
//Escribí acá la ruta para obtener un tweet en particular
tweetsRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  client.query(
    "SELECT t.id AS tid, u.name, t.content, t.imgurl FROM tweets AS t INNER JOIN users AS u ON u.id = t.user_id WHERE t.id = $1",
    [id],
    (err, result) => {
      if (err) return next(err); // pasa el error a Express
      const tweets = result.rows[0];
      console.log(result.rows);
      res.json(tweets);
    }
  );
});

//Escribí acá la ruta para eliminar un tweet
tweetsRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  client.query("SELECT t.id AS tid, u.name, t.content, t.imgurl FROM tweets AS t INNER JOIN users AS u ON u.id = t.user_id WHERE t.id = $1",[id], (err, result) => {
      if (err) return next(err); // pasa el error a Express
      const tweet = result.rows[0];
      
  client.query("DELETE from tweets AS t WHERE t.id = $1", [id], (err, result) => {
    if (err) return next(err); // pasa el error a Express
    res.status(202).send(tweet);
  }); 
})
});

//Escribí acá la ruta para crear un tweet

tweetsRouter.post("/", (req, res, next) => {
//   client.query("SELECT * FROM users WHERE  users.name = $1", [req.body.name],(err, result) => {
//       if (err) return next(err); // pasa el error a Express
//       console.log(result.rows);
//       let user_id = result.rows[0].id;
//       if (!user_id) {
        client.query("INSERT INTO users(name) VALUES ($1) RETURNING id", [req.body.name],(err, result) => {
            if (err) return next(err);
            let user_id = result.rows[0].id;
            client.query("INSERT INTO tweets(user_id, content, imgurl) VALUES ($1, $2, $3) RETURNING id", [user_id, req.body.content, req.body.imgurl],(err, result) => {
                if (err) return next(err);
                client.query("SELECT *, tweets.id AS tid FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE tweets.id = $1", [result.rows[0].id],(err, result) => {
                    if (err) return next(err);
                    const tweet = result.rows[0]
                    res.status(201).send(tweet)
                })              
             })
        })
    // }
    // })
});

module.exports = tweetsRouter;

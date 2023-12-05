import express from "express"
import bodyparser from "body-parser"
import mysql from "mysql"

import { createDatabaseQuery, createTableQuery, useDatabaseQuery } from "./sqlQueries/index.js";

const app = express();

const port = 5000;

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());

//Create connection with DB
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
});

// Connect to MySQL server
pool.getConnection(function (err, connection) {
  connection.query(createDatabaseQuery, function (err) {
    if (err) throw err;

    // Once the database is created (or if it already exists), switch to it
    connection.query(useDatabaseQuery, function (err) {
      if (err) throw err;
      // After switching to the database, create the table
      connection.query(createTableQuery, function (err) {
        if (err) throw err;

        console.log("Connected to Database");
        connection.release();
      });
    });
  });
});

//get all data
app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query("SELECT * FROM beers", (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        console.log(`Error ${err}`);
      }
    });
  });
});

//Search by id
app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query(
      "SELECT * FROM beers WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(rows);
        } else {
          console.log(`Error ${err}`);
        }
      }
    );
  });
});

//delete data
app.get("/deletedata/:id", (req, res) => {
  const id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query("DELETE FROM beers WHERE id = ?", [id], (err, rows) => {
      connection.release();
      if (!err) {
        res.send(`Colum with id ${id} deleted`);
      } else {
        console.log(`Error ${err}`);
      }
    });
  });
});

//Add Data
app.post("/adddata", (req, res) => {
  const params = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query("INSERT INTO beers SET ?", params, (err, rows) => {
      connection.release();
      if (!err) {
        res.send(`${params.name} added`);
      } else {
        console.log(`Error ${err}`);
      }
    });
  });
});

//Update Data

app.put("/update", (req, res) => {
  const { id, name, tagliine, description } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query(
      "UPDATE beers SET description = ? WHERE id = ?",
      [description, id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(`${name} updated`);
        } else {
          console.log(`Error ${err}`);
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

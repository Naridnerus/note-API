const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/notes', (req, res) => {
  db.query("SELECT * FROM notes", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
app.get("/notes/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM notes WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json(result[0]);
    }
  );
});
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  db.query(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    (err) => {
      if (err) throw err;
      res.send("Note added");
    }
  );
});
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM notes WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Note deleted" });
    }
  );
});
app.put("/notes/content/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  db.query(
    "UPDATE notes SET content = ? WHERE id = ?",
    [title, content, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Note updated" });
    }
  );
});

app.listen(5000, () => console.log("Server running on port 5000"));

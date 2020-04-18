// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require(path.join(__dirname, "/db/db.json"));

const db_dir = path.resolve(__dirname, "db")
const notesArray = path.join(db_dir, "db.json");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Displays all notes
app.get("/api/notes", function(req, res) {
    return res.json(notes);
});

// Displays a specific note, or returns false
app.get("/api/notes/:id", function(req, res) {
  const select = req.params.id;

  console.log(select);

  for (var i = 0; i < notes.length; i++) {

    if (select === notes[i].title) {
      return res.json(notes[i]);
    };
  };

  return res.json(false);
});

// Create New Notes - takes in JSON input
app.post("/api/notes", function(req, res) {
  const newNotes = req.body;

  newNotes.route = newNotes.title.replace(/\s+/g, "").toLowerCase();

  console.log(newNotes);

  notes.push(newNotes);

  fs.writeFileSync(notesArray, JSON.stringify(notes), (err) => {
      if (err) throw err;
      console.log("The note has been saved!")
  });

  res.json(newNotes);
});

// Delete Notes{
app.delete("/api/notes/:id", function(req, res) {
    res.json()
})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
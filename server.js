
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

app.use("/public/assets/css", express.static(path.join(__dirname, './public/assets/css')));

app.use("/public/assets/js", express.static(path.join(__dirname, './public/assets/js')));

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

  for (let i = 0; i < notes.length; i++) {

    if (select === notes[i].id) {
      return res.json(notes[i]);
    };
  };

  return res.json(false);
});

// Create New Notes - takes in JSON input
app.post("/api/notes", function(req, res) {
  const newNotes = req.body;

  newNotes.id = newNotes.title.replace(/\s+/g, "").toLowerCase();

  notes.push(newNotes);

// Write to db.json file the new posted note data
  fs.writeFileSync(notesArray, JSON.stringify(notes), (err) => {
      if (err) throw err;
      console.log("The note has been saved!")
  });

  res.json(newNotes);
});

// Delete specific note based on id
app.delete("/api/notes/:id", function(req, res) {
    const select = req.params.id;

  for (let i = 0; i < notes.length; i++) {

    if (select === notes[i].id) {
        notes.splice(i, 1);
        // Write to db.json file the new notes data after note is deleted
        fs.writeFileSync(notesArray, JSON.stringify(notes), (err) => {
            if (err) throw err;
            console.log("The note has been saved!")
        });
        return res.json(notes);
    };
  };
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


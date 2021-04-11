// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

var data = fs.readFileSync('./db/db.json', 'utf8'); 
var db = JSON.parse(data);

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// routes

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'public/index.html'))})
app.get('/notes', (req, res) => {res.sendFile(path.join(__dirname, 'public/notes.html'))})

app.get('/api/notes', (req, res) => {res.sendFile(path.join(__dirname, 'db/db.json'))})
app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newNote = req.body;

    newNote.id = uniqid.process()
    console.log(newNote);
 
    db.push(newNote);
    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(db), (err) => {
        if (err) throw err;
    })
    res.json(newNote);
  });

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

   for (let i = 0; i < db.length; i++) {
       if (db[i].id === id) {
           db.splice(i);
       }
   }

   fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(db), (err) => {
    if (err) throw err;

    res.json(true);
})

})

// listener

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
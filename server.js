const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON body
app.use(express.json());

// Function to generate a unique ID
function generateUniqueId() {
  const timestamp = new Date().getTime(); // Get current timestamp
  const randomNum = Math.floor(Math.random() * 1000); // Generate random number between 0 and 999
  return `${timestamp}${randomNum}`; // Concatenate timestamp and random number
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to read notes from db.json
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('db.json file does not exist');
        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    // Initialize notes as an empty array if the file is empty
    let notes = [];
    
    if (data) {
      try {
        notes = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = generateUniqueId();
  fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(201).json(newNote);
    });
  });
});

// Route to delete a note from db.json
app.delete('/api/notes/:id', (req, res) => {
  const idToDelete = req.params.id;
  fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== idToDelete);

    fs.writeFile(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(200).json({ message: 'Note deleted!' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// to fetch notes from the server and display them.
async function fetchAndDisplayNotes() {
  try {
    const response = await fetch('/api/notes');
    const notes = await response.json();
    // Displays notes on the page
    console.log(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}

// to save a new note to the server
async function saveNote() {
  try {
    const title = document.getElementById('note-title').value;
    const text = document.getElementById('note-text').value;
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, text })
    });
    const newNote = await response.json();
    console.log('New note saved:', newNote);

    // function to render the new saved note.
    renderNote(newNote);
  } catch (error) {
    console.error('Error saving note:', error);
  }
}

// to render a note on the page.
function renderNote(note) {
  // Creates HTML elements for displaying the note title and text.
  const noteContainer = document.createElement('div');
  noteContainer.classList.add('note');

  const titleElement = document.createElement('h2');
  titleElement.textContent = note.title;

  const textElement = document.createElement('p');
  textElement.textContent = note.text;

  // Appends the title and text elements to the note container.
  noteContainer.appendChild(titleElement);
  noteContainer.appendChild(textElement);

  const notesContainer = document.getElementById('notes-container');
  notesContainer.appendChild(noteContainer);
}

// to clear the form
function clearForm() {
  document.getElementById('note-title').value = '';
  document.getElementById('note-text').value = '';
}

// Function to handle creating a new note
function createNewNote() {
  clearForm();
}

// EL listener for saving new note
document.getElementById('save-note-btn').addEventListener('click', saveNote);

// EL for clearing form
document.getElementById('clear-btn').addEventListener('click', clearForm);

// EL for creating a new note
document.getElementById('new-note').addEventListener('click', createNewNote);


// Initial fetch and display of notes when the page loads
fetchAndDisplayNotes();

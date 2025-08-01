let notes = [];

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

function addNote() {
  const newNote = document.getElementById("new-note").value.trim();
  if (!newNote) return;

  notes.unshift({ id: generateId(), text: newNote, pinned: false });
  document.getElementById("new-note").value = "";
  saveNotes();
  renderNotes();
}

function editNote(id, newText) {
  const note = notes.find((n) => n.id === id);
  if (note) {
    note.text = newText;
    saveNotes();
  }
}

function deleteNote(id) {
  notes = notes.filter((n) => n.id !== id);
  saveNotes();
  renderNotes();
}

function togglePin(id) {
  const note = notes.find((n) => n.id === id);
  if (note) {
    note.pinned = !note.pinned;
    saveNotes();
    renderNotes();
  }
}

function renderNotes() {
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();
  const sortedNotes = [...notes].sort((a, b) => b.pinned - a.pinned);

  sortedNotes.forEach((note) => {
    if (!note.text.toLowerCase().includes(search)) return;

    const div = document.createElement("div");
    div.className = "note" + (note.pinned ? " pinned" : "");

    div.innerHTML = `
      <textarea oninput="editNote('${note.id}', this.value)">${
      note.text
    }</textarea>
      <div class="actions">
        <span class="pin" onclick="togglePin('${note.id}')">${
      note.pinned ? "📌" : "📍"
    }</span>
        <button onclick="deleteNote('${note.id}')">🗑 Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  const saved = localStorage.getItem("notes");
  notes = saved ? JSON.parse(saved) : [];
  renderNotes();
}

document.getElementById("search").addEventListener("input", renderNotes);

// 🌙 Dark mode toggle
const themeToggleBtn = document.getElementById("toggle-theme");
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

// Load dark mode if saved
(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
})();

loadNotes();

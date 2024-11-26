let tasks = []; // Array to hold task objects
let notes = []; // Array to hold notes
let uploadedFiles = []; // Array to hold uploaded files
let editingIndex = -1; // Variable to track which task is being edited
let editingNoteIndex = -1; // Variable to track which note is being edited

// Load tasks, notes, and uploaded files from local storage on page load
window.onload = function() {
    loadTasks();
    loadNotes();
    loadUploadedFiles();
};

function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = storedTasks; // Load tasks from local storage
    updateTaskList(); // Display tasks
}

function loadNotes() {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = storedNotes; // Load notes from local storage
    updateNotesDisplay(); // Display notes
}

function loadUploadedFiles() {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    uploadedFiles = storedFiles; // Load uploaded files from local storage
    updateUploadedFilesDisplay(); // Display uploaded files
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.'); // Check if input is empty
        return;
    }

    if (editingIndex === -1) {
        // If not editing, add new task
        tasks.push({ text: taskText, progress: 0 }); // Initialize progress to 0
    } else {
        // If editing, update the existing task
        tasks[editingIndex].text = taskText; // Update task text
        editingIndex = -1; // Reset editing index
    }

    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save to local storage
    updateTaskList(); // Refresh displayed task list
    taskInput.value = ''; // Clear input field
}

function updateTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear current task list

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        
        const taskText = document.createElement('span');
        taskText.innerText = task.text;
        listItem.appendChild(taskText);

        // Create progress bar container
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress'; // CSS class for styling

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar'; // CSS class for styling
        progressBar.style.width = `${task.progress}%`; // Set width based on task's progress

        // Append the progress bar to the container
        progressBarContainer.appendChild(progressBar);
        listItem.appendChild(progressBarContainer);

        // Create a progress input for the task
        const progressInput = document.createElement('input');
        progressInput.type = 'number'; // Set input type to number
        progressInput.value = task.progress; // Set current progress value
        progressInput.min = 0; // Minimum value
        progressInput.max = 100; // Maximum value
        progressInput.style.width = '50px'; // Set width for the input
        progressInput.onchange = () => updateTaskProgress(index, progressInput.value); // Update progress on change

        listItem.appendChild(progressInput); // Add the input field for progress

        // Create edit and remove buttons
        const editButton = createButton('Edit', () => editTask(index));
        const removeButton = createButton('Remove', () => removeTask(index));
        listItem.appendChild(editButton);
        listItem.appendChild(removeButton);

        taskList.appendChild(listItem); // Add list item to the task list
    });
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.innerText = text;
    button.onclick = onClick; // Set the click handler
    return button;
}

function updateTaskProgress(index, newProgress) {
    const progress = parseInt(newProgress, 10);
    if (progress < 0 || progress > 100) {
        alert('Progress must be between 0 and 100.'); // Alert if progress is out of bounds
        return;
    }
    tasks[index].progress = progress; // Update task's progress
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks to local storage
    updateTaskList(); // Refresh displayed task list
}

function editTask(index) {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text; // Set input to the task text
    editingIndex = index; // Set the editing index to the task being edited
}

function removeTask(index) {
    tasks.splice(index, 1); // Remove task
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Update local storage
    updateTaskList(); // Refresh task list
}

// Notes functionality
function saveNotes() {
    const notesInput = document.getElementById('notesInput');
    const notesText = notesInput.value.trim(); // Get the input value and remove extra whitespace

    if (notesText === '') {
        alert('Please enter some notes.'); // Alert if input is empty
        return;
    }

    if (editingNoteIndex === -1) {
        // If not editing, add new note
        notes.push(notesText);
    } else {
        // If editing, update the existing note
        notes[editingNoteIndex] = notesText;
        editingNoteIndex = -1; // Reset editing index
    }

    localStorage.setItem('notes', JSON.stringify(notes)); // Save notes to local storage
    updateNotesDisplay(); // Update displayed notes
    notesInput.value = ''; // Clear notes input
}

function updateNotesDisplay() {
    const savedNotesDisplay = document.getElementById('savedNotesDisplay');
    savedNotesDisplay.innerHTML = ''; // Clear current notes display

    notes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.innerText = note;

        // Create an edit button for each note
        const editButton = createButton('Edit', () => editNote(index));
        noteItem.appendChild(editButton);

        // Create a delete button for each note
        const deleteButton = createButton('Delete', () => deleteNote(index));
        noteItem.appendChild(deleteButton);

        savedNotesDisplay.appendChild(noteItem); // Add note item to display
    });
}

function editNote(index) {
    const notesInput = document.getElementById('notesInput');
    notesInput.value = notes[index]; // Set input to the note text
    editingNoteIndex = index; // Set the editing index to the note being edited
}

function deleteNote(index) {
    notes.splice(index, 1); // Remove note
    localStorage.setItem('notes', JSON.stringify(notes)); // Update local storage
    updateNotesDisplay(); // Refresh notes display
}

// File upload functionality
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const emailInput = document.getElementById('emailInput');
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Please select a file to upload.'); // Alert if no file is selected
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadedFiles.push({ name: file.name, size: file.size }); // Store file name and size
    }

    // Notify user via email (mock notification)
    if (emailInput.value) {
        alert(`Files uploaded successfully. A notification has been sent to ${emailInput.value}.`); // Mock notification
    }

    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles)); // Save uploaded files to local storage
    updateUploadedFilesDisplay(); // Refresh file display
}

function updateUploadedFilesDisplay() {
    const uploadedFilesDisplay = document.getElementById('uploadedFilesDisplay');
    uploadedFilesDisplay.innerHTML = ''; // Clear current uploaded files display

    uploadedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.innerText = `${file.name} (${file.size} bytes)`; // Display file name and size
        uploadedFilesDisplay.appendChild(fileItem); // Add file item to display
    });
}

// // Logout function
// function logout() {
//     // Perform logout logic (e.g., clear local storage, redirect)
//     localStorage.clear(); // Clear local storage
//     alert('You have been logged out.'); // Notify user
//     // Optionally, redirect to a login page or refresh
//     window.location.reload(); // Refresh page
// }
function logout() {
    // Optional: Clear any session data or perform additional cleanup
    localStorage.removeItem('tasks'); // Optionally clear tasks from local storage
    localStorage.removeItem('uploadedFiles'); // Optionally clear uploaded files from local storage
    
    // Redirect to the login page
    window.location.href = 'login.html'; // Change this to your actual login page URL
}
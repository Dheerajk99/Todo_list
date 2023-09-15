let tasks = [];

function addOrEditTask(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const editIndex = parseInt(document.getElementById('editIndex').value);

    if (title.trim() === '') {
        alert('Please enter a task title.');
        return;
    }

    const task = {
        title,
        description,
        priority,
        completed: false
    };

    if (editIndex === -1) {
        tasks.push(task);
    } else {
        tasks[editIndex] = task;
    }

    saveTasks();
    updateTaskList();
    closeTaskFormPopup();
}

function editTask(index) {
    const task = tasks[index];
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('priority').value = task.priority;
    document.getElementById('editIndex').value = index;
    openTaskFormPopup();
}

function sortTasks(sortBy) {
    if (sortBy === 'priority-low') {
        tasks.sort((a, b) => {
            return a.priority.localeCompare(b.priority);
        });
    } else if (sortBy === 'priority-medium') {
        tasks.sort((a, b) => {
            return b.priority.localeCompare(a.priority);
        });
    } else if (sortBy === 'priority-high') {
        tasks.sort((a, b) => {
            return b.priority.localeCompare(a.priority);
        });
    } else if (sortBy === 'status-pending') {
        tasks.sort((a, b) => {
            return a.completed - b.completed;
        });
    } else if (sortBy === 'status-completed') {
        tasks.sort((a, b) => {
            return b.completed - a.completed;
        });
    }

    updateTaskList();
}

function updateTaskList() {
    const taskList = document.getElementById('tableBody');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        document.getElementById('emptyMessage').textContent = 'The list is empty ! Add Items';
    } else {
        document.getElementById('emptyMessage').textContent = '';

        tasks.forEach((task, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td class="task-title">${task.title}</td>
                <td>${task.priority}</td>
                <td class="description-column ">
                    <button class="btn btn-sm btn-secondary" onclick="openDescriptionPopup(${index})">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="editTask(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openDeletePopup(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm ${task.completed ? 'btn-success' : 'btn-danger'}" onclick="toggleStatus(${index})">
                        <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    </button>
                </td>
                <td class="status ${task.completed ? 'completed' : 'pending'}">${task.completed ? 'Completed' : 'Pending'}</td>
            `;

            taskList.appendChild(row);
        });
    }
}

function toggleStatus(index) {
    tasks[index].completed = !tasks[index].completed; // Toggle the completed status
    saveTasks();
    updateTaskList();
}




// Function to open the description pop-up
function openDescriptionPopup(index) {
    const task = tasks[index];
    const description = task.description;
    const descriptionText = document.getElementById('descriptionText');
    descriptionText.textContent = description;

    const descriptionPopup = document.getElementById('descriptionPopup');
    descriptionPopup.style.display = 'block';

    // Add an event listener to the close button
    const closeDescriptionButton = document.getElementById('closeDescriptionPopup');
    closeDescriptionButton.addEventListener('click', () => {
        closeDescriptionPopup();
    });
}


// Function to close the description pop-up
function closeDescriptionPopup() {
    const descriptionPopup = document.getElementById('descriptionPopup');
    descriptionPopup.style.display = 'none';
}



function openDeletePopup(index) {
    const deletePopup = document.getElementById('deletePopup');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const overlay = document.querySelector('.overlay');

    overlay.style.display = 'block';


    confirmDeleteButton.onclick = function () {
        deleteTask(index);
        deletePopup.style.display = 'none';
        overlay.style.display = 'none';
    };

    cancelDeleteButton.onclick = function () {
        deletePopup.style.display = 'none';
        overlay.style.display = 'none';
    };

    deletePopup.style.display = 'block';
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    updateTaskList();
}

function openTaskFormPopup() {
    const taskFormPopup = document.getElementById('taskFormPopup');
    taskFormPopup.style.display = 'block';
}

function closeTaskFormPopup() {
    const taskFormPopup = document.getElementById('taskFormPopup');
    taskFormPopup.style.display = 'none';
    document.getElementById('editIndex').value = '-1';
    clearTaskForm();
}

function clearTaskForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('priority').value = 'low';
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('addItemButton').addEventListener('click', openTaskFormPopup);
document.getElementById('cancelTaskButton').addEventListener('click', closeTaskFormPopup);
document.getElementById('taskForm').addEventListener('submit', addOrEditTask);



const savedTasks = JSON.parse(localStorage.getItem('tasks'));
if (savedTasks) {
    tasks = savedTasks;
}
updateTaskList();

// Add event listeners for the "Clear All Tasks" button and the popup buttons
document.getElementById('clearAllTasksButton').addEventListener('click', openClearTasksPopup);
document.getElementById('confirmClearButton').addEventListener('click', clearAllTasks);
document.getElementById('cancelClearButton').addEventListener('click', closeClearTasksPopup);

// Function to open the Clear Tasks popup
function openClearTasksPopup() {
    const clearTasksPopup = document.getElementById('clearTasksPopup');
    clearTasksPopup.style.display = 'block';
}

// Function to close the Clear Tasks popup
function closeClearTasksPopup() {
    const clearTasksPopup = document.getElementById('clearTasksPopup');
    clearTasksPopup.style.display = 'none';
}

// Function to clear all tasks
function clearAllTasks() {
    tasks = []; // Clear the tasks array
    saveTasks(); // Save the empty tasks array to localStorage
    updateTaskList(); // Update the task list to show no tasks
    closeClearTasksPopup(); // Close the Clear Tasks popup
}



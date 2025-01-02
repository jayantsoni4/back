// Fetch and display tasks
const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the task list before adding new ones

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = async () => {
            await fetch(`/api/tasks/${task._id}`, { method: 'DELETE' });
            fetchTasks(); // Refresh the task list
        };

        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
};

// Add a new task
const addTaskForm = document.getElementById('addTaskForm');
addTaskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value;
    
    if (taskName) {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskName }),
        });

        document.getElementById('taskName').value = ''; // Clear the input field
        fetchTasks(); // Refresh the task list
    }
});

// Initial fetch of tasks
fetchTasks();

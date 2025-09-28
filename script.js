document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskList = document.getElementById('task-list');

    // Load tasks from Local Storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to save tasks to Local Storage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to render tasks to the DOM
    const renderTasks = () => {
        // Clear current list
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p>No study tasks yet. Add one to get started!</p>';
            return;
        }

        // Sort tasks by due date (chronological timeline)
        const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        sortedTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            const formattedDate = new Date(task.dueDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });

            li.innerHTML = `
                <input type="checkbox" class="task-complete" ${task.completed ? 'checked' : ''}>
                <div class="task-details">
                    <p><strong>${task.title}</strong></p>
                    <small>Due: ${formattedDate}</small>
                </div>
                <div class="task-actions">
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    // Handle form submission to add a new task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const dueDate = taskDueDateInput.value;

        if (title === '' || dueDate === '') {
            alert('Please fill in all fields.');
            return;
        }

        const newTask = {
            id: Date.now(), // Simple unique ID
            title,
            dueDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        // Clear form fields
        taskTitleInput.value = '';
        taskDueDateInput.value = '';
    });

    // Handle clicks on the task list (for completing or deleting)
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = Number(taskItem.dataset.id);

        // Handle task completion toggle
        if (target.classList.contains('task-complete')) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            }
        }

        // Handle task deletion
        if (target.classList.contains('delete-btn')) {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasks();
            renderTasks();
        }
    });

    // Initial render on page load
    renderTasks();
});
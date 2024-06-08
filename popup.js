document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('taskList');

  // Load tasks from storage
  chrome.storage.sync.get('tasks', (data) => {
    const tasks = data.tasks || [];
    tasks.forEach(task => addTaskToList(task));
  });

  addTaskButton.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    if (taskName) {
      chrome.storage.sync.get('tasks', (data) => {
        const tasks = data.tasks || [];
        tasks.push({ name: taskName, completed: false });
        chrome.storage.sync.set({ tasks: tasks }, () => {
          addTaskToList({ name: taskName, completed: false });
          taskInput.value = '';
        });
      });
    }
  });

  function addTaskToList(task) {
    const taskItem = document.createElement('div');
    taskItem.textContent = task.name;
    taskItem.className = 'task-item';
    if (task.completed) {
      taskItem.classList.add('completed');
    }

    // Add delete "x" sign
    const deleteButton = document.createElement('span');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent taskItem click event from firing
      chrome.storage.sync.get('tasks', (data) => {
        const tasks = data.tasks || [];
        const updatedTasks = tasks.filter(t => t.name !== task.name);
        chrome.storage.sync.set({ tasks: updatedTasks }, () => {
          taskItem.remove();
        });
      });
    });

    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
  }
});

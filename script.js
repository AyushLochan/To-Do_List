document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let tasks;
  try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (error) {
    tasks = [];
  }

  // Render tasks
  function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    const filteredTasks =
      filter === "all"
        ? tasks
        : filter === "pending"
          ? tasks.filter((task) => !task.completed)
          : tasks.filter((task) => task.completed);

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.add("task-item");

      const taskText = document.createElement("span");
      taskText.classList.add("task-text");
      taskText.textContent = task.text;
      if (task.completed) taskText.classList.add("completed");

      const actions = document.createElement("div");
      actions.classList.add("task-actions");

      const completeBtn = document.createElement("button");
      completeBtn.classList.add("complete-btn");
      completeBtn.textContent = task.completed ? "Undo" : "Complete";
      completeBtn.addEventListener("click", () => ToggleComplete(index));

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteTask(index));

      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(taskText);
      li.appendChild(actions);
      taskList.appendChild(li);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Add task
  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      tasks.push({ text: taskText, completed: false });
      taskInput.value = "";
      renderTasks();
    }
  });

  // Toggle task completion
  function ToggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  }

  // Delete task
  function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
  }

  // Filter tasks
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active").classList.remove("active");
      btn.classList.add("active");
      renderTasks(btn.dataset.filter);
    });
  });

  // Initial render
  renderTasks();
});
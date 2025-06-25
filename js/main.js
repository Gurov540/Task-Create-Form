// Ждём полной загрузки HTML-документа перед выполнением кода
document.addEventListener("DOMContentLoaded", () => {
  // Получаем DOM-элементы
  const addBtn = document.getElementById("add-btn");
  const tasksContainer = document.querySelector(".tasks");
  const emptyState = document.getElementById("empty-state");

  // Получаем элементы формы
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-description");
  const dateInput = document.getElementById("task-date");
  const typeInput = document.getElementById("task-type");
  const importantInput = document.getElementById("task-important");

  // Устанавливаем текущую дату по умолчанию
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  dateInput.value = formattedDate;

  // Названия типов задач на русском
  const typeNames = {
    work: "Работа",
    study: "Учёба",
    sport: "Спорт",
  };

  // Функция форматирования даты (например: 21 июня 2025 г.)
  function formatDate(dateStr) {
    if (!dateStr) return "Дата не указана";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Сброс значений формы после добавления задачи
  function resetForm() {
    titleInput.value = "";
    descInput.value = "";
    dateInput.value = formattedDate;
    typeInput.value = "work";
    importantInput.checked = false;
  }

  // Получение задач из localStorage (массив)
  function loadTasks() {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  }

  // Сохранение массива задач в localStorage
  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // 🔥 ФУНКЦИЯ УДАЛЕНИЯ ЗАДАЧИ ПО ID
  function deleteTaskById(id) {
    // Удаление DOM-элемента с нужным data-id
    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (card) card.remove();

    // Удаление задачи из localStorage
    const updatedTasks = loadTasks().filter((task) => task.id !== id);
    saveTasks(updatedTasks);

    // Если задач больше нет — показываем сообщение "список пуст"
    if (!document.querySelector(".task-card")) {
      emptyState.style.display = "block";
    }
  }

  // Функция создания карточки задачи
  function createTaskCard(task, save = false) {
    const { id, title, description, date, type, important } = task;

    // Создаём DOM-элемент карточки
    const card = document.createElement("div");
    card.className = `task-card ${type}`;
    if (important) card.classList.add("important");

    // Привязываем уникальный id через data-атрибут
    card.dataset.id = id;

    // HTML разметка задачи
    card.innerHTML = `
      <div class="task-header">
          <h3 class="task-title">${title}</h3>
          <span class="task-type type-${type}">${typeNames[type]}</span>
      </div>
      <div class="task-body">
          <p class="task-description">${
            description || "Описание отсутствует"
          }</p>
      </div>
      <div class="task-footer">
          <span class="task-date">${formatDate(date)}</span>
          <button class="delete-btn"><i class="fas fa-trash"></i></button>
      </div>
    `;

    // Навешиваем обработчик на кнопку удаления
    card.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTaskById(id); // Вызываем универсальную функцию удаления
    });

    // Вставляем карточку задачи в DOM перед блоком emptyState
    tasksContainer.insertBefore(card, emptyState);
    emptyState.style.display = "none";

    // Если нужно — сохраняем задачу в localStorage
    if (save) {
      const tasks = loadTasks();
      tasks.push(task);
      saveTasks(tasks);
    }
  }

  // Обработка нажатия на кнопку "Добавить"
  addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();

    // Проверка: если поле названия пустое — выводим сообщение
    if (!title) {
      alert("Пожалуйста, введите название задачи");
      return;
    }

    // Создаём объект новой задачи
    const task = {
      id: Date.now(), // Уникальный идентификатор (по времени)
      title,
      description: descInput.value,
      date: dateInput.value,
      type: typeInput.value,
      important: importantInput.checked,
    };

    // Создаём карточку задачи и сохраняем её
    createTaskCard(task, true);

    // Очищаем форму
    resetForm();
  });

  // При загрузке страницы отображаем задачи из localStorage
  const storedTasks = loadTasks();
  if (storedTasks.length > 0) {
    storedTasks.forEach((task) => createTaskCard(task));
  } else {
    emptyState.style.display = "block";
  }
});

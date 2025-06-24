// Ждём полной загрузки HTML-документа
document.addEventListener("DOMContentLoaded", () => {
  // Получаем все необходимые элементы из DOM
  const addBtn = document.getElementById("add-btn");
  const tasksContainer = document.querySelector(".tasks");
  const emptyState = document.getElementById("empty-state");

  // Элементы формы задачи
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-description");
  const dateInput = document.getElementById("task-date");
  const typeInput = document.getElementById("task-type");
  const importantInput = document.getElementById("task-important");

  // Устанавливаем текущую дату в поле "Дата"
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Преобразуем в формат YYYY-MM-DD
  dateInput.value = formattedDate;

  // Русские названия типов задач
  const typeNames = {
    work: "Работа",
    study: "Учёба",
    sport: "Спорт",
  };

  // Форматирование даты в читаемый формат
  function formatDate(dateStr) {
    if (!dateStr) return "Дата не указана";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Сброс значений формы к начальному состоянию
  function resetForm() {
    titleInput.value = "";
    descInput.value = "";
    dateInput.value = formattedDate;
    typeInput.value = "work";
    importantInput.checked = false;
  }

  // Загружаем задачи из localStorage (если они есть)
  function loadTasks() {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : []; // Если есть данные — распарсить, иначе вернуть пустой массив
  }

  // Сохраняем список задач в localStorage
  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Создание карточки задачи и добавление её в DOM
  function createTaskCard(task, save = false) {
    const { id, title, description, date, type, important } = task;

    // Создаём HTML-элемент задачи
    const card = document.createElement("div");
    card.className = `task-card ${type}`;
    if (important) card.classList.add("important");

    // Сохраняем уникальный идентификатор задачи в атрибут data-id
    card.dataset.id = id;

    // HTML-разметка карточки задачи
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
          <button class="delete-btn">🗑️</button>
      </div>
    `;

    // Обработчик кнопки удаления задачи
    card.querySelector(".delete-btn").addEventListener("click", () => {
      card.remove(); // Удаляем DOM-элемент

      // Удаляем задачу из localStorage по id
      const tasks = loadTasks().filter((t) => t.id !== id);
      saveTasks(tasks);

      // Если задач не осталось — показать "список пуст"
      if (!tasksContainer.querySelector(".task-card")) {
        emptyState.style.display = "block";
      }
    });

    // Добавляем карточку в контейнер задач
    tasksContainer.insertBefore(card, emptyState);
    emptyState.style.display = "none";

    // Если флаг `save` — true, то сохраняем задачу в localStorage
    if (save) {
      const tasks = loadTasks(); // Загружаем текущие задачи
      tasks.push(task); // Добавляем новую
      saveTasks(tasks); // Сохраняем обратно
    }
  }

  // Обработка нажатия на кнопку "Добавить"
  addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim(); // Убираем лишние пробелы

    // Если название задачи не указано — выводим сообщение
    if (!title) {
      alert("Пожалуйста, введите название задачи");
      return;
    }

    // Создаём объект задачи
    const task = {
      id: Date.now(), // Уникальный ID на основе текущего времени
      title,
      description: descInput.value,
      date: dateInput.value,
      type: typeInput.value,
      important: importantInput.checked,
    };

    // Создаём и отображаем задачу, сохраняем в localStorage
    createTaskCard(task, true);

    // Очищаем форму после добавления
    resetForm();
  });

  // При загрузке страницы отображаем задачи из localStorage
  const storedTasks = loadTasks();
  if (storedTasks.length > 0) {
    storedTasks.forEach((task) => createTaskCard(task));
  } else {
    emptyState.style.display = "block"; // Если задач нет — показать "список пуст"
  }
});

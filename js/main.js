// Ждём, пока весь HTML загрузится и только потом запускаем JS
document.addEventListener("DOMContentLoaded", () => {
  // Получаем нужные DOM-элементы
  const addBtn = document.getElementById("add-btn");
  const tasksContainer = document.querySelector(".tasks");
  const emptyState = document.getElementById("empty-state");

  // Получаем элементы формы задачи
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-description");
  const dateInput = document.getElementById("task-date");
  const typeInput = document.getElementById("task-type");
  const importantInput = document.getElementById("task-important");

  // Устанавливаем текущую дату по умолчанию в поле "Дата"
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
  dateInput.value = formattedDate;

  // Функция для форматирования даты в читаемый формат
  function formatDate(dateStr) {
    if (!dateStr) return "Дата не указана";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Функция для очистки формы после добавления задачи
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

  // Функция создания DOM-элемента задачи
  function createTaskCard({ title, description, date, type, important }) {
    const card = document.createElement("div"); // создаём <div>
    card.className = `task-card ${type}`; // класс зависит от типа задачи
    if (important) card.classList.add("important"); // если важная — добавляем класс

    // Русские названия типов задач
    const typeNames = { work: "Работа", study: "Учёба", sport: "Спорт" };

    // Шаблон HTML-карточки задачи
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

    // Добавляем обработчик на кнопку удаления задачи
    card.querySelector(".delete-btn").addEventListener("click", () => {
      card.remove(); // удаляем карточку из DOM
      // Проверка: если больше нет задач — показать сообщение "список пуст"
      if (!tasksContainer.querySelector(".task-card")) {
        emptyState.style.display = "block";
      }
    });

    return card; // возвращаем готовую карточку
  }

  // Обработка клика по кнопке "Добавить"
  addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();

    // Если пользователь не ввёл название задачи — показываем alert
    if (!title) {
      alert("Пожалуйста, введите название задачи");
      return;
    }

    // Сбор данных из формы
    const taskData = {
      title,
      description: descInput.value,
      date: dateInput.value,
      type: typeInput.value,
      important: importantInput.checked,
    };

    // Создаём карточку и добавляем её в список
    const taskCard = createTaskCard(taskData);
    tasksContainer.insertBefore(taskCard, emptyState); // вставляем перед сообщением "пусто"
    emptyState.style.display = "none"; // скрываем "список пуст"
    resetForm(); // очищаем форму
  });
});

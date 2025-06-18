document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("add-btn");
  const tasksContainer = document.querySelector(".tasks");
  const emptyState = document.getElementById("empty-state");

  addBtn.addEventListener("click", function () {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const date = document.getElementById("task-date").value;
    const type = document.getElementById("task-type").value;
    const important = document.getElementById("task-important").checked;

    if (!title) {
      alert("Пожалуйста, введите название задачи");
      return;
    }

    // Создаем карточку задачи
    const taskCard = document.createElement("div");
    taskCard.className = `task-card ${type}`;
    if (important) {
      taskCard.classList.add("important");
    }

    // Форматируем дату для отображения
    let displayDate = "Дата не указана";
    if (date) {
      const dateObj = new Date(date);
      displayDate = dateObj.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    // Получаем русское название типа
    const typeNames = {
      work: "Работа",
      study: "Учёба",
      sport: "Спорт",
    };

    taskCard.innerHTML = `
              <div class="task-header">
                  <h3 class="task-title">${title}</h3>
                  <span class="task-type type-${type}">
                    ${typeNames[type]}
                  </span>
              </div>
              <div class="task-body">
                  <p class="task-description">
                    ${description || "Описание отсутствует"}
                  </p>
              </div>
              <div class="task-footer">
                  <span class="task-date">${displayDate}</span>
                  <button class="delete-btn">🗑️</button>
              </div>
          `;

    // Добавляем карточку в контейнер
    tasksContainer.insertBefore(taskCard, emptyState);

    // Скрываем сообщение о пустом списке
    emptyState.style.display = "none";

    // Очищаем форму
    document.getElementById("task-title").value = "";
    document.getElementById("task-description").value = "";
    document.getElementById("task-date").value = "";
    document.getElementById("task-type").value = "work";
    document.getElementById("task-important").checked = false;

    // Добавляем обработчик удаления
    const deleteBtn = taskCard.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      taskCard.remove();

      // Если задач не осталось, показываем сообщение
      if (tasksContainer.querySelectorAll(".task-card").length === 0) {
        emptyState.style.display = "block";
      }
    });
  });

  // Устанавливаем текущую дату по умолчанию
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  document.getElementById("task-date").value = formattedDate;
});

$(document).ready(function () {
  function formatOption(state) {
    if (!state.id) return state.text;
    const icon = $(state.element).data("icon");
    return $(
      `<span><i class="fas ${icon}" style="margin-right: 8px;"></i> ${state.text}</span>`
    );
  }

  $("#task-type").select2({
    templateResult: formatOption,
    templateSelection: formatOption,
    minimumResultsForSearch: Infinity, // скрыть поиск, если не нужен
  });
});

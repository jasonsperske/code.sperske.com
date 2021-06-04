$('button[data-action=RunJS]').on('click', (e) => {
  e.preventDefault();
  $.post('/js', {source: editor.getValue()});
});

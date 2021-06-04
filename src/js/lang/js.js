$('button[data-action=RunJS]').on('click', (e) => {
  e.preventDefault();
  $.post('/js', {action: 'save', source: editor.getValue()}).then(() => {
    document.getElementById('output').src = '/js/embed';
  });
});

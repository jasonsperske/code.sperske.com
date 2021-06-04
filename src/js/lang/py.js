$('button[data-action=RunPython]').on('click', (e) => {
  e.preventDefault();
  $.post('/py', {
    action: 'save',
    source: editor.getValue()})
    .then($.post('/py', {action: 'execute'}));
});

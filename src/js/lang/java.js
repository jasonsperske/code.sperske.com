$('button[data-action=CompileJava]').on('click', (e) => {
  e.preventDefault();
  $.post('/java', {action: 'save', source: editor.getValue()});
});
$('button[data-action=RunJava]').on('click', (e) => {
  e.preventDefault();
  alert('Running last compile');
});

$('button[data-action=CompileJava]').on('click', (e) => {
  e.preventDefault();
  $.post('/java', {action: 'save', source: editor.getValue()}).then(() => {
    document.getElementById('output').src = '/java/compile';
  });
});
$('button[data-action=RunJava]').on('click', (e) => {
  e.preventDefault();
  $.post('/java', {action: 'save', source: editor.getValue()}).then(() => {
    document.getElementById('output').src = '/java/execute';
  });
});

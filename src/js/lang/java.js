$('button[data-action=CompileJava]').on('click', (e) => {
  e.preventDefault();
  alert('compiling');
});
$('button[data-action=RunJava]').on('click', (e) => {
  e.preventDefault();
  alert('Running last compile');
});

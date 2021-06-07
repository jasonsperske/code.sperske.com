document.querySelector('button[data-action=execute]').onclick = () => {
  UpdateSource('java', 'execute', {
    action: 'save', source: editor.getValue()
  });
  return false;
};

document.querySelector('button[data-action=compile]').onclick = () => {
  UpdateSource('java', 'compile', {
    action: 'save', source: editor.getValue()
  });
  return false;
};

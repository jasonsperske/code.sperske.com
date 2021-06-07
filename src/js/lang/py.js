document.querySelector('button[data-action=execute]').onclick = () => {
  UpdateSource('py', 'execute', {
    action: 'save', source: editor.getValue()
  });
  return false;
};

document.querySelector('button[data-action=embed]').onclick = () => {
  UpdateSource('js', 'embed', {
    action: 'save', source: editor.getValue()
  });
  return false;
};

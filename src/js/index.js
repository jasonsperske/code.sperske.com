// Setup ACE editor
ace.config.set("basePath", "/static/js/ace");

// Standard way to save and update a src editor
function UpdateSource(lang, action, data) {
  return fetch(`/${lang}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('output').src = `/${lang}/${action}`;
  });
}

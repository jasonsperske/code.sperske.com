// Setup ACE editor
ace.config.set("basePath", "/static/js/ace");

class IDE {
  constructor(project) {
    this._editor = ace.edit('editor');
    this._editor.session.setMode('ace/mode/text');
    this._project = project;
    this._tree = [...document.getElementsByClassName('tree')].shift();

    this._footer_height = document.getElementsByClassName('footer')[0].offsetHeight;

    this._tree.addEventListener('click', (e) => {
      if (e.target.nodeName === 'LI' && e.target.dataset.sourcePath) {
        this._loadFile(e.target.dataset.sourcePath);
      }
    }, false);

    new PaneResizer(document.getElementById('content_seperator'),
      (e) => Math.max(e.clientX, 100),
      (width) => {
        document
          .documentElement
          .style
          .setProperty('--tree-side-width', `${width}px`);
      });

    new PaneResizer(document.getElementById('code_pane_seperator'),
      (e) => Math.max((window.innerHeight - this._footer_height) - e.clientY, 100),
      (height) => {
        document
          .documentElement
          .style
          .setProperty('--output-side-height', `${height}px`);
      });
  }

  _loadFile(resource) {
    fetch(`/project/${this._project}/source/${resource}`)
      .then(res => res.json())
      .then((data) => {
        this._editor.session.setValue(data.source);
        this._editor.session.setMode('ace/mode/' + data.type.ace.mode);
      });
  }
}

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

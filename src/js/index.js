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

    document.getElementById('content_seperator').onmousedown = () => {
      window.addEventListener('mousemove', this._resizeContentSeperator.bind(this));

      window.addEventListener('mouseup', this._onResizeEnd.bind(this));
      window.addEventListener('selectstart', this._disableSelect.bind(this));
    };

    document.getElementById('code_pane_seperator').onmousedown = () => {
      window.addEventListener('mousemove', this._resizeOutputSeperator.bind(this));

      window.addEventListener('mouseup', this._onResizeEnd.bind(this));
      window.addEventListener('selectstart', this._disableSelect.bind(this));
    };
  }

  _loadFile(resource) {
    fetch(`/project/${this._project}/source/${resource}`)
      .then(res => res.json())
      .then((data) => {
        this._editor.session.setValue(data.source);
        this._editor.session.setMode('ace/mode/' + data.type.ace.mode);
      });
  }

  _disableSelect(e) {
    e.preventDefault();
  }

  _resizeContentSeperator(e) {
    const width = Math.max(e.clientX, 100);
    document
      .documentElement
      .style
      .setProperty('--tree-side-width', width + 'px');
  }

  _resizeOutputSeperator(e) {
    const height = Math.max((window.innerHeight - this._footer_height) - e.clientY, 100);
    document
      .documentElement
      .style
      .setProperty('--output-side-height', height + 'px');
  }

  _onResizeEnd() {
    window.removeEventListener('mousemove', this._resizeContentSeperator);
    window.removeEventListener('mousemove', this._resizeOutputSeperator);
    window.removeEventListener('selectstart', this._disableSelect);
    window.removeEventListener('mouseup', this._onResizeEnd);
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

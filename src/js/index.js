// Setup ACE editor
ace.config.set("basePath", "/static/js/ace");

class IDE {
  constructor(project) {
    this._editor = ace.edit('editor');
    this._editor.session.setMode('ace/mode/text');
    this._project = project;
    this._tree = [...document.getElementsByClassName('tree')].shift();

    this._footer_height = document.getElementsByClassName('footer')[0].offsetHeight;
    this._open_files = [];

    this._tree.onclick = (e) => {
      if (e.target.nodeName === 'LI' && e.target.dataset.sourcePath) {
        this._loadFile(e.target.dataset.sourcePath);
      }
    };

    document.querySelector('button[data-action=save]').onclick = () => {
      const resource = window.location.hash.replace('#', '');
      if (!resource) {
        return;
      }
      return fetch(`/project/${project}/source/${resource}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'save', source: this._editor.getValue()
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(`saved ${resource}`, data);
      });
    };

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
        this._open_files.push(data);
        this._editor.session.setValue(data.source);
        this._editor.session.setMode('ace/mode/' + data.type.ace.mode);
        window.location.hash = resource;
      });
  }
}

// Setup ACE editor
ace.config.set("basePath", "/static/js/ace");

function initIDE(project) {
  const editor = ace.edit('editor');
  const tree = [...document.getElementsByClassName("tree")].shift();
  tree.addEventListener('click', (e) => {
    if (e.target.nodeName === 'LI' && e.target.dataset.sourcePath) {
      fetch(`/project/${project}/source/${e.target.dataset.sourcePath}`)
        .then(res => res.json())
        .then((data) => {
          editor.session.setValue(data.source);
          editor.session.setMode('ace/mode/' + data.type.ace.mode);
        });
    }
  }, false);

  function resizeContentSeperator(e) {
    let width = e.clientX;
    if (width < 100) {
      width = 100;
    }
    document
      .documentElement
      .style
      .setProperty('--tree-side-width', width + 'px');
  }

  function resizeOutputSeperator(e) {
    let height = window.innerHeight - e.clientY;
    if (height < 100) {
      height = 100;
    }
    document
      .documentElement
      .style
      .setProperty('--output-side-height', height + 'px');
  }

  function endResizerSeperator() {
    window.removeEventListener('mousemove', resizeContentSeperator);
    window.removeEventListener('mousemove', resizeOutputSeperator);
    window.removeEventListener('mouseup', endResizerSeperator);
  }

  document.getElementsByClassName('content_seperator')[0].onmousedown = () => {
    window.addEventListener('mousemove', resizeContentSeperator);
    window.addEventListener('mouseup', endResizerSeperator);
  };

  document.getElementsByClassName('code_pane_seperator')[0].onmousedown = () => {
    window.addEventListener('mousemove', resizeOutputSeperator);
    window.addEventListener('mouseup', endResizerSeperator);
  };

  editor.session.setMode('ace/mode/text');
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

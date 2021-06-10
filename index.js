const config = require('config');
const dirTree = require("directory-tree");
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const supportedFileTypes = require('./SupportedFileTypes');
const exec = require('child_process').exec

const workspace = fs.realpathSync(config.get('workspace') || '.');
const port = process.env.port || config.get('port') || 3000;

console.log('Setting up pico-IDE:');
console.log(`          workspace: ${workspace}`);
console.log(`    serving on port: ${port}`);

const app = express();
const tree = dirTree(workspace);

app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));
app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', {
    projects: tree.children
      .filter((d) => d.type === 'directory' && !d.name.startsWith('.'))
      .map((d) => d.name)
  });
});

app.get('/project/:project', (req, res) => {
  const project = tree.children.filter((d) => d.name === req.params.project).shift();
  if (!project) {
    res.redirect('/');
    return;
  }

  res.render('project/view', {
    project,
    title: project.name
  });
});

app.route('/project/:project/source/*')
  .get((req, res) => {
    const project = tree.children.filter((d) => d.name === req.params.project).shift();
    if (!project) {
      res.redirect('/');
      return;
    }
    const source_path = path.join(workspace, project.name, req.params[0]);
    const source_type = supportedFileTypes.lookup(req.params[0]);
    const source = Buffer.from(fs.readFileSync(source_path));

    res.json({
      path: req.params[0],
      source: source.toString('utf8'),
      type: source_type
    });
  })
  .post((req, res) => {
    const project = tree.children.filter((d) => d.name === req.params.project).shift();
    if (!project) {
      res.json({success: false});
      return;
    }
    if (req.body.action) {
      const source_path = path.join(workspace, project.name, req.params[0]);
      if (req.body.action === 'save' && req.body.source) {
        fs.writeFileSync(source_path, req.body.source);
      }
      res.json({success: true});
    } else {
      res.json({success: false});
    }
  });

app.listen(port, () => {
  console.log(`Server started at http://127.0.0.1:${port}`);
});

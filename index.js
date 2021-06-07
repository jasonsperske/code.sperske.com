const config = require('config');
const dirTree = require("directory-tree");
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec

const workspace = fs.realpathSync(config.get('workspace') || '.');
const port = process.env.port || config.get('port') || 3000;

console.log('Setting up pico-IDE:');
console.log(`          workspace: ${workspace}`);
console.log(`    serving on port: ${port}`);

const app = express();
const tree = dirTree(workspace);

const supportedFileTypes = {
  'java': {
    ace: {
      mode: "java"
    }
  },
  'js': {
    ace: {
      mode: "javascript"
    }
  },
  'json': {
    ace: {
      mode: "javascript"
    }
  },
  'py': {
    ace: {
      mode: "python"
    }
  }
};

function findFileType(filename) {
  const file_ext = filename.substring(filename.lastIndexOf('.') + 1);
  const file_type = supportedFileTypes[file_ext];
  if (file_type) {
    return file_type;
  }
  return {
    ace: {
      mode: "text"
    }
  };
}

const supportedLanguages = [{
  href: 'js',
  label: 'JavaScript',
  example_src_file: 'example.js',
  actions: [
    {
      jsFunction: 'embed',
      label: '➤Run'
    }
  ],
  ace: {
    mode: 'javascript'
  }
},
{
  href: 'java',
  label: 'Java',
  example_src_file: 'Example.java',
  execute: "java -cp data/java Example",
  compile: "javac data/java/Example.java & echo Done!",
  actions: [
    {
      jsFunction: 'compile',
      label: 'Build'
    },
    {
      jsFunction: 'execute',
      label: '➤Run'
    }
  ],
  ace: {
    mode: 'java'
  }
},
{
  href: 'py',
  label: 'Python',
  example_src_file: 'example.py',
  execute: "python data/py/example.py",
  actions: [
    {
      jsFunction: 'execute',
      label: '➤Run'
    }
  ],
  ace: {
    mode: 'python'
  }
}];

app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));
app.use('/static', express.static('static'));
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

app.get('/project/:project/source/*', (req, res) => {
  const project = tree.children.filter((d) => d.name === req.params.project).shift();
  if (!project) {
    res.redirect('/');
    return;
  }
  const source_path = path.join(workspace, project.name, req.params[0]);
  const source_type = findFileType(req.params[0]);
  const source = Buffer.from(fs.readFileSync(source_path));

  res.json({
    source: source.toString('utf8'),
    type: source_type
  });
});

app.get('/:lang/embed', (req, res) => {
  const lang = supportedLanguages.filter((lang) => lang.href === req.params.lang);
  if(lang.length === 1) {
    const data = lang[0];
    data.source = fs.readFileSync(`data/${data.href}/${data.example_src_file}`);
    res.render('code/embed', data);
  } else {
    res.redirect('/');
  }
});

app.get('/:lang/compile', (req, res) => {
  const lang = supportedLanguages.filter((lang) => lang.href === req.params.lang);
  if(lang.length === 1 && lang[0].compile) {
    const data = lang[0];
    exec(data.compile, (err, stdout, stderr) => {
      data.stdout = stdout;
      data.stderr = stderr;
      res.render('code/output', data);
    });
  } else {
    res.redirect('/');
  }
});

app.get('/:lang/execute', (req, res) => {
  const lang = supportedLanguages.filter((lang) => lang.href === req.params.lang);
  if(lang.length === 1 && lang[0].execute) {
    const data = lang[0];
    exec(data.execute, (err, stdout, stderr) => {
      data.stdout = stdout;
      data.stderr = stderr;
      res.render('code/output', data);
    });
  } else {
    res.redirect('/');
  }
});

app.route('/:lang')
   .get((req, res) => {
     const lang = supportedLanguages.filter((lang) => lang.href === req.params.lang);
     if(lang.length === 1) {
       const data = lang[0];
       data.editor_source = fs.readFileSync(`data/${data.href}/${data.example_src_file}`);
       res.render('code/view', data);
     } else {
       res.redirect('/');
     }
   })
   .post((req, res) => {
     const lang = supportedLanguages.filter((lang) => lang.href === req.params.lang);
     if(lang.length === 1 && req.body.action) {
       const data = lang[0];
       if(req.body.action === 'save' && req.body.source) {
         fs.writeFileSync(`data/${data.href}/${data.example_src_file}`, req.body.source);
       }
       res.json({success: true});
     } else {
       res.json({success: false});
     }
   });

app.listen(port, () => {
  console.log(`Server started at http://127.0.0.1:${port}`);
});

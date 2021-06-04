const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = process.env.port || 3000;

const supportedLanguages = [{
  href: 'js',
  label: 'JavaScript',
  example_src_file: 'example.js',
  actions: [
    {
      jsFunction: 'RunJS',
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
  actions: [
    {
      jsFunction: 'CompileJava',
      label: 'Build'
    },
    {
      jsFunction: 'RunJava',
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
  actions: [
    {
      jsFunction: 'RunPython',
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

app.get('/', (req, res) => {
  res.render('index', {
    languages: supportedLanguages
  });
});

app.route('/:lang')
   .get((req, res) => {
     const lang = supportedLanguages.filter((lang) => lang.href === req.params.lang);
     if(lang.length === 1) {
       const data = lang[0];
       data.editor_source = fs.readFileSync(`data/${data.href}/${data.example_src_file}`);
       res.render('code', data);
     } else {
       res.redirect('/');
     }
   });

app.listen(port, () => {
  console.log(`Server started at http://127.0.0.1:${port}`);
});

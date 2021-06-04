const express = require('express');
const app = express();
const port = process.env.port || 3000;

const supportedLanguages = [{
  href: 'js',
  label: 'JavaScript'
},
{
  href: 'java',
  label: 'Java'
},
{
  href: 'py',
  label: 'Python'
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
       res.render('code', lang[0]);
     } else {
       res.redirect('/');
     }
   });

app.listen(port, () => {
  console.log(`Server started at http://127.0.0.1:${port}`);
});

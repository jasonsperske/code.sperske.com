const gulp = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const flatten = require('gulp-flatten');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

function javascript() {
  return gulp.src([
      'node_modules/ace-builds/src/ace.js',
      'src/js/pane_resizer.js',
      'src/js/index.js'
    ], { base: '.'})
    .pipe(babel())
    .pipe(terser())
    .pipe(concat('code.min.js'))
    .pipe(gulp.dest('static/js/'));
}

function javascript_lang_common(lang) {
  return gulp.src([
      `src/js/lang/${lang}.js`
    ], { base: '.'})
    .pipe(babel())
    .pipe(terser())
    .pipe(concat(`${lang}.min.js`))
    .pipe(gulp.dest('static/js/lang/'));
}

function javascript_lang_java() {
  return javascript_lang_common('java');
}

function javascript_lang_js() {
  return javascript_lang_common('js');
}

function javascript_lang_py() {
  return javascript_lang_common('py');
}

function ace_resources() {
  return gulp.src([
    'node_modules/ace-builds/src-min-noconflict/worker-*.js',
    'node_modules/ace-builds/src-min-noconflict/mode-*.js',
  ], {base: './'})
  .pipe(flatten())
  .pipe(gulp.dest('static/js/ace'));
}

function css() {
  return gulp.src('src/sass/code.scss')
    .pipe(sass({paths: ['.']}))
    .pipe(cleanCSS())
    .pipe(rename('code.min.css'))
    .pipe(gulp.dest('static/css/'));
}

exports.default = gulp.series(
  javascript,
  javascript_lang_java,
  javascript_lang_js,
  javascript_lang_py,
  ace_resources,
  css);

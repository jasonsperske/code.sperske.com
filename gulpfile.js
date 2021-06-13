const gulp = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const flatten = require('gulp-flatten');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

sass.compiler = require('sass');

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
  ace_resources,
  css);

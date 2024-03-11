const gulp = require('gulp') //название плагина из devDependencies из package-lock.json
const del = require('del')

const { src, dest } = require('gulp');
const sassCompiler = require('gulp-sass')(require('sass'));

const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')

//const babel = require('babel') //для js
const uglify = require('gulp-uglify') //для js
const concat = require('gulp-concat') //для js


/*Удаляем папку dist */
function clean() { 
  return del(['dist']);
}

/*Создаем папку dist и в нее добавляем css/style.css */
const paths = { //храним пути до наших файлов, ** любие файли отслеживаются из styles
  styles: {
    src: 'src/styles/**/*.scss', //путь для изначального файла
    dest: 'dist/css/' //destination путь каталога назначения
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  }
} 

/*задача для обработки стилей*/
function styles() { 
  return src(paths.styles.src) //ищем в src все файли
    .pipe(sassCompiler()) //создается компилируемий sass в css
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'main', //так как файл main.css
      suffix: '.min'
    }))
    .pipe(dest(paths.styles.dest));  //и перемещаем все в каталог dest/css
}

/*задача для обработки скриптов*/
function scripts() { 
  return gulp.src(paths.scripts.src, {
    sourcemaps: true
  })
  .pipe(babel(
   /*  {
      presets: ['@babel/env']
    } */
  ))
  .pipe(uglify())
  .pipe(concat('main.min.js')) //можно и через rename ({ basename: 'main', suffix: '.min'})
  .pipe(gulp.dest(paths.scripts.dest))
}

/*отслеживание изменений и автоматич виполнение тасков*/
function watch() { 
  gulp.watch(paths.styles.src, styles) 
  gulp.watch(paths.scripts.src, scripts)
}

/*позволяет виполнять таски в последовательном режиме*/
const build = gulp.series(clean, gulp.parallel(styles,scripts), watch) 
//  в консоле визиваем gulp

//иногда можно и так const buildP = gulp.parallel()  //виполняются таски параллельно

exports.clean = clean; //таски для виполнения задач
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch; //gulp watch запускает watcher
exports.build = build; 
exports.default = build; //  в консоле визиваем gulp


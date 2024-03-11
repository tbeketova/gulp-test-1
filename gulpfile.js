const gulp = require('gulp') //название плагина из devDependencies из package-lock.json
const del = require('del')

const { src, dest } = require('gulp');
const sassCompiler = require('gulp-sass')(require('sass'));

const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')

const uglify = require('gulp-uglify') //для js
const concat = require('gulp-concat') //для js
const sourcemaps = require('gulp-sourcemaps')
const autoPrefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')

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
  },
  images: {
    src: 'src/images/*',
    dest: 'dist/images/' // *- означает любьiе файльi
  }
} 

/*задача для обработки стилей*/
function styles() { 
  return src(paths.styles.src) //ищем в src все файли
    .pipe(sourcemaps.init()) //создает main.min.css.map
    .pipe(sassCompiler()) //создается компилируемий sass в css
    .pipe(autoPrefixer( {
			cascade: false
		}))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename({
      basename: 'main', //так как файл main.css
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.')) //добавляет файл .map в dist/css и создает main.min.js.map
    .pipe(gulp.dest(paths.styles.dest));  //и перемещаем все в каталог dest/css
}

/*задача для обработки скриптов*/
function scripts() { 
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init()) //создает main.min.js.map
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js')) //можно и через rename ({ basename: 'main', suffix: '.min'})
  .pipe(sourcemaps.write('.')) //создает main.min.js.map
  .pipe(gulp.dest(paths.scripts.dest))
}

function img() {
  return gulp.src(paths.images.src) //указиваем путь
		.pipe(imagemin())
		.pipe(gulp.dest(paths.images.dest))
}

/*отслеживание изменений и автоматич виполнение тасков*/
function watch() { 
  gulp.watch(paths.styles.src, styles) 
  gulp.watch(paths.scripts.src, scripts)
}

/*позволяет виполнять таски в последовательном режиме*/
const build = gulp.series(clean, gulp.parallel(styles,scripts,img), watch) 
//  в консоле визиваем gulp

//иногда можно и так const buildP = gulp.parallel()  //виполняются таски параллельно

exports.clean = clean; //таски для виполнения задач
exports.styles = styles;
exports.scripts = scripts;
exports.img = img;
exports.watch = watch; //gulp watch запускает watcher
exports.build = build; 
exports.default = build; //  в консоле визиваем gulp


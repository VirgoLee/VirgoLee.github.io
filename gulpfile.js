var gulp = require('gulp');

//Plugins模块获取
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');

gulp.task('minify-css', function () {
return gulp.src('./public/**/*.css')
.pipe(minifycss())
.pipe(gulp.dest('./public'));
});

gulp.task('minify-html', function () {
return gulp.src('./public/**/*.html')
.pipe(htmlclean())
.pipe(htmlmin({
removeComments: true,
minifyJS: true,
minifyCSS: true,
minifyURLs: true,
}))

.pipe(gulp.dest('./public'))
});

gulp.task('minify-js', function () {
return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
.pipe(uglify())
.pipe(gulp.dest('./public'));
});

// 执行 gulp 命令时执行的任务
//gulp.task('default', [
  //  'minify-html', 'minify-css', 'minify-js'
//]);
gulp.task('default', gulp.parallel('minify-html', 'minify-css', 'minify-js', function() {
  // Do something after a, b, and c are finished.
}));
 


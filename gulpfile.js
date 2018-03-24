const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const rename = require('gulp-rename');

const webpackStreamCurrent = (cPath)=>webpackStream(require(cPath), webpack);

gulp.task('clean', function(){
    return del([
        'dist/**',
        '!dist'
      ]);
})

gulp.task('background', ['clean'] ,function(){
    gulp.src('src/background/index.js')
    .pipe(rename('background.js'))
    .pipe(gulp.dest("dist/unpacked/background"))
})

gulp.task('content', ['clean'] ,function(){
    return gulp.src("src/content/index.js")
    .pipe(webpackStreamCurrent("./src/content/webpack.conf.js"))
    .pipe(gulp.dest("./dist/unpacked/content"));

})

gulp.task('copy-top', ['clean'], function(){
    gulp.src('src/*.*')
    .pipe(gulp.dest('dist/unpacked'))
})

gulp.task('watch', function(){
    return gulp.watch('src/**/*.*', ['default']);
})

gulp.task('default', ['copy-top','background', 'content', 'watch']);

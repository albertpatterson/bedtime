const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserify = require('browserify');
const source = require('vinyl-source-stream')
const sass = require('gulp-sass')

const webpackStreamCurrent = (cPath)=>webpackStream(require(cPath), webpack);

gulp.task('clean', function(){
    return del([
        'dist/**',
        '!dist'
      ]);
})

gulp.task('background', ['clean'] ,function(){
    return browserify("src/background/index.js")
            .bundle()
            .pipe(source('background.js'))
            .pipe(gulp.dest("dist/unpacked/background"));
})

gulp.task('injected-script', ['clean'] ,function(){
    return gulp.src("src/injected/js/index.js")
    .pipe(webpackStreamCurrent("./src/injected/script/webpack.conf.js"))
    .pipe(gulp.dest("./dist/unpacked/injected/script"));
})

gulp.task('injected-style', ['clean'] ,function(){
    return gulp.src('src/injected/style/content.scss')
            .pipe(sass()) 
            .pipe(gulp.dest("./dist/unpacked/injected/style"));
})

gulp.task('copy-top', ['clean'], function(){
    gulp.src('src/*.*')
    .pipe(gulp.dest('dist/unpacked'))
})

gulp.task('watch', function(){
    return gulp.watch('src/**/*.*', ['default']);
})

gulp.task('default', ['copy-top','background', 'injected-script', "injected-style", 'watch']);

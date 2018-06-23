const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const sass = require('gulp-sass');
const gzip = require('gulp-zip');

const webpackStreamCurrent = (cPath)=>webpackStream(require(cPath), webpack);

gulp.task('clean', function(){
    return del([
        'dist/**',
        '!dist'
      ]);
});

gulp.task('background', ['clean'] ,function(){
    return browserify("src/background/index.js")
            .bundle()
            .pipe(source('background.js'))
            .pipe(gulp.dest("dist/unpacked/background"));
});

gulp.task('injected-script', ['clean'] ,function(){
    return gulp.src("src/injected/js/index.js")
    .pipe(webpackStreamCurrent("./src/injected/script/webpack.conf.js"))
    .pipe(gulp.dest("./dist/unpacked/injected/script"));
});

gulp.task('injected-style', ['clean'] ,function(){
    return gulp.src('src/injected/style/bedtimeContent.scss')
            .pipe(sass()) 
            .pipe(gulp.dest("./dist/unpacked/injected/style"));
});

gulp.task('copy-top', ['clean'], function(){
    gulp.src('src/*.*')
    .pipe(gulp.dest('dist/unpacked'))
});

gulp.task('copy-popup', ['clean'], function(){
    gulp.src('src/popup/**/*.*')
    .pipe(gulp.dest('dist/unpacked/popup'))
});

gulp.task('copy-util', ['clean'], function(){
    gulp.src('src/util/**/*.*')
    .pipe(gulp.dest('dist/unpacked/util'))
});


gulp.task('watch', function(){
    return gulp.watch('src/**/*.*', ['default']);
});

const defaultTasks = ['copy-top', 'copy-popup', 'copy-util', 'background', 'injected-script', "injected-style"]

gulp.task('default', defaultTasks);

gulp.task('dev', ["default", 'watch']);

gulp.task('zip', defaultTasks, function(){
    gulp.src(['dist/unpacked/**'])
    .pipe(gzip('bedtime.zip'))
    .pipe(gulp.dest('dist'))
})

gulp.task('build-prod', ['zip'])
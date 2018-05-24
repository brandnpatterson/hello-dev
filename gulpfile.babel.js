let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();
let eslint = require('gulp-eslint');
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let styleLint = require('gulp-stylelint');
let webpack = require('webpack-stream');

gulp.task('eslint', () => {
    return gulp.src(['./src/js/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('stylelint', () => {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(styleLint({
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
});

gulp.task('scripts', ['eslint'], () => {
    return gulp.src('./src/js/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream());
});

gulp.task('styles', ['stylelint'], () => {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed' 
        }).on('error', sass.logError))
        .pipe(autoprefixer({ 
            browsers: 'last 2 versions', 
            cascade: false 
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream());
});

gulp.task('watch', () => {
    gulp.watch('./src/js/**/*.js', ['scripts']);
    gulp.watch('./src/sass/**/*.scss', ['styles']);
    gulp.watch('./index.html', browserSync.reload);
});

gulp.task('default', ['scripts', 'styles', 'watch'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

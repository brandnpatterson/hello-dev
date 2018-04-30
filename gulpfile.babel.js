import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import styleLint from 'gulp-stylelint';
import webpack from 'webpack-stream';

let localhost = 'hello-world.localhost';

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
        .pipe(webpack({ 
            devtool: 'source-map',
            output: { 
                filename: 'bundle.js' 
            }
        }))
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
    gulp.watch('./src/js/index.js', ['scripts']);
    gulp.watch('./src/sass/**/*.scss', ['styles']);
    gulp.watch('./index.html', browserSync.reload);
});

gulp.task('default', ['scripts', 'styles', 'watch'], () => {
    browserSync.init({
        server: {
            proxy: localhost
        }
    });
});

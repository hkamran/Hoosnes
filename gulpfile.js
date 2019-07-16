const p = require('./package.json');
const log = require('fancy-log');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const wConfig = require('./webpack.config');

const dir = {
    modules: './node_modules/',
    assets: './src/assets/**/*',
    src: './src/main/**/*{ts,tsx}',
    target: './target/**/*'
};

const handleWebpackOutput = (err, stats) => {
  if (err) throw new gutil.PluginError('tsPipeline', err);
  log('[tsPipeline]', stats.toString({
    colors: true,
    chunks: false
  }));
};

gulp.task('clean', function () {
    return del(['target']);
});

gulp.task('assets', function () {
    return gulp.src(dir.assets)
        .pipe(gulp.dest('target/'));
});

gulp.task('compile',  function (callback) {
    const compiler = webpack(wConfig);
    compiler.run((err, stats) => { 
		handleWebpackOutput(err, stats);
        callback();
    });
});

gulp.task('build', function (callback) {
    runSequence(
        'compile',
        'assets',
        callback);
});

gulp.task('watch', function () {
    gulp.watch([dir.src, dir.assets], ['build']);
});

gulp.task('default', function (callback) {
    runSequence('clean',
        'build',
        'assets',
        callback);
});
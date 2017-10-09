'use strict'

const gulp = require('gulp'),
			sass = require('gulp-sass'),
			prefix = require('gulp-autoprefixer'),
			cache = require('gulp-cache'),
			concat = require('gulp-concat'),
			cssnano = require('gulp-cssnano'),
			imagemin = require('gulp-imagemin'),
			rename = require('gulp-rename'),
			uglify = require('gulp-uglify'),
			gutil = require('gulp-util'),
			browserSync = require('browser-sync').create(),
			pump = require('pump'),
			del = require('del'),
			runsequence = require('run-sequence'),
			cp = require('child_process')

const jekyll = process.platform  === 'win32' ? 'jekyll.bat' : 'jekyll'

gulp.task('jekyll', function(done) {
	return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
		.on('error', err => gutil.log(gutil.colors.red(err.message)))
		.on('close', done)
})

gulp.task('sass', function(cb) {
	pump([
		gulp.src('src/assets/css/main.sass'),
		sass(),
		prefix(),
		rename({suffix: '.min'}),
		cssnano(),
		gulp.dest('dist/assets/css'),
		browsersync.stream()
	], cb)
})

gulp.task('js', function(cb) {
	pump([
		gulp.src(['node_modules/jquery/dist/jquery.min.js', 'src/assets/js/modules/*.js', 'src/assets/js/main.js']),
		concat('main.js'),
		rename({suffix: '.min'}),
		uglify(),
		gulp.dest('dist/assets/js'),
		browsersync.stream()
	], cb)
})

gulp.task('image', function(cb) {
	pump([
		gulp.src('src/assets/img/**/*'),
		cache(imagemin({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		})),
		gulp.dest('dist/assets/img'),
		browsersync.stream()
	], cb)
})

gulp.task('browsersync', function() {
	browsersync.init({
		server: {
			baseDir: 'dist'
		},
		port: 8080
	})
})

gulp.task('build', function(cb) {
	runsequence(
		'clean',
		['jekyll', 'sass', 'js', 'image'],
		cb
	)
})

gulp.task('clean', function() {
	return del(['dist/**/*'])
})

gulp.task('watch', function() {
	gulp.watch('src/**/*.{html,md}', ['jekyll'])
	gulp.watch('src/assets/css/**/*.{sass,scss}', ['sass'])
	gulp.watch('src/assets/js/**/*.js', ['js'])
	gulp.watch('src/assets/img/**/*', ['image'])
})

gulp.task('default', function(cb) {
	runsequence(
		'build',
		'browsersync',
		'watch',
		cb
	)
})

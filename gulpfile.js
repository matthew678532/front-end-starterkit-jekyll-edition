'use strict'

const gulp = require('gulp'),
			sass = require('gulp-sass'),
			prefix = require('gulp-autoprefixer'),
			cache = require('gulp-cache'),
			concat = require('gulp-concat'),
			cssnano = require('gulp-cssnano'),
			imagemin = require('gulp-imagmin'),
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

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
			browserSync = require('browser-sync').create(),
			pump = require('pump'),
			del = require('del'),
			runsequence = require('run-sequence'),
			cp = require('child_process')

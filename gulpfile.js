var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var deploy = require('gulp-gh-pages');

var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin');

var runSequence = require('run-sequence');

var del = require('del');

gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('files', function(){
	return gulp.src('app/files/**/*')
		.pipe(gulp.dest('dist/files'));
});

gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('app/scss/main.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'sass', 'useref', 'images', 'fonts','files', ], function(){
	console.log('Building our awesome site yo!');
});

gulp.task('build', function(callback){
	runSequence('clean:dist', ['sass','useref', 'images', 'fonts', 'files'],
		callback
		);
});

gulp.task('default', function(callback){
	runSequence(['sass', 'browserSync', 'watch'],
		callback
		);
});

gulp.task('clean:dist', function(){
	return del.sync('dist');
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  });
});

gulp.task('sass', function(){
	return gulp.src('app/scss/main.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('useref',function(){
	return gulp.src('app/*.html')
		.pipe(useref())
		//minifies only if js file
		.pipe(gulpIf('*.js', uglify()))
		//minifies only if css file
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'));
});

/**
 * Push build to gh-pages
 */
gulp.task('deploy', function () {
  return gulp.src("../dist/**/*")
    .pipe(deploy())
});
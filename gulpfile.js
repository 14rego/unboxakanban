var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    moment      = require('moment'),
    notify      = require('gulp-notify'),
    less        = require('gulp-less'),
    serve       = require('gulp-serve'),
    template    = require('gulp-template-html');

require('gulp-help')(gulp, {
    description: 'Help listing.'
});

gulp.task('uglify-js', 'Concat, Uglify JavaScript into a single JS.', function() {
    gulp.src([
    		'resources/lib/jquery.min.js', 
    		'resources/lib/angular2.sfx.dev.js', 
       		//'resources/lib/bootstrap-3.3.7/js/*.js', 
    		'resources/lib/bootstrap-3.3.7/js/affix.js', 
    		'resources/lib/bootstrap-3.3.7/js/button.js', 
    		'resources/lib/bootstrap-3.3.7/js/collapse.js', 
    		'resources/lib/bootstrap-3.3.7/js/dropdown.js', 
    		'resources/lib/bootstrap-3.3.7/js/modal.js', 
    		'resources/lib/bootstrap-3.3.7/js/tab.js', 
    		'resources/lib/bootstrap-3.3.7/js/transition.js',
    		'resources/script/unboxakanban.js'
    	])
        .pipe(concat('unboxakanban'))
        .pipe(uglify())
        .on('error', notify.onError('Error: <%= error.message %>'))
        .pipe(rename({
            extname: '.min.js'
         }))
        .pipe(gulp.dest('resources/script/min'))
        .pipe(notify('JS ( ' + moment().format('h:mm:ss') + ' )'));
});

gulp.task('less', 'Compile less into a single CSS.', function() {
    gulp.src(['resources/style/*.less'])
        .pipe(concat('unboxakanban'))
        .pipe(less())
        .on('error', notify.onError('Error: <%= error.message %>'))
		.pipe(rename({
		    extname: '.min.css'
		 }))
        .pipe(gulp.dest('resources/style/min'))
        .pipe(notify('CSS ( ' + moment().format('h:mm:ss') + ' )'));
});

gulp.task('html-build-user', 'Build HTML files with partials.', function() {
    gulp.src('views/user/*.html')
          .pipe(template('views/layouts/user.html'))
          .pipe(gulp.dest('views/dist'))
          .pipe(notify('HTML ( ' + moment().format('h:mm:ss') + ' )'));
});

gulp.task('watch', 'Watch for changes.', function() {

    watch({
        glob: 'resources/script/*.js'
    }, function() {
        gulp.start('uglify-js');
    });

    watch({
        glob: 'resources/style/*.less',
    }, function() {
        gulp.start('less');
    });

    watch({
        glob: 'views/user/*.html',
    }, function() {
        gulp.start('html-build-user');
    });
});

gulp.task('default', ['watch']);
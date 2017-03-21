var gulp = require ('gulp');
var nodemon = require ('gulp-nodemon');
var livereload = require ('gulp-livereload');
var notify = require ('gulp-notify');

gulp.task ('server', () => {
	livereload.listen();

	nodemon ({
		script: './bin/start',
		ext: 'js'
	}).on ('restart', () => {
		gulp.src ('./bin/start')
			.pipe (livereload());
	});
});
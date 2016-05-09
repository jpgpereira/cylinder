module.exports = {

	js_vendor: {
		files: [ '<%= project.dev_vendor %>/**' ],
		tasks: [ 'copy:vendor' ],
		options: { spawn: false }
	},

	js_cylinder: {
		files: [ '<%= project.dev_core %>/**', '<%= project.dev_extensions %>/**', '<%= project.dev_modules %>/**' ],
		tasks: [ 'browserify:dist', 'uglify:dist', 'clean:docs', 'jsdoc:docs' ],
		options: { spawn: false }
	}

};

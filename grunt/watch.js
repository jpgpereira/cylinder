module.exports = {

	js_vendor: {
		files: [
			'<%= project.dev_vendor %>/**'
		],
		tasks: [
			'copy:vendor'
		],
		options: {
			spawn: false
		}
	},

	js_cylinder: {
		files: [
			'<%= project.dev_classes %>/**',
			'<%= project.dev_extensions %>/**',
			'<%= project.dev_modules %>/**'
		],
		tasks: [
			'browserify:dist',
			'uglify:dist',
			'uglify:pkgd',
			'clean:docs',
			'jsdoc2md:docs'
		],
		options: {
			spawn: false
		}
	}

};

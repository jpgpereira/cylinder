module.exports = {

	root: './',

	// build-related folders
	bower: './bower_components',
	grunt: './grunt',
	node: './node_modules',

	// development folders
	dev: './dev',
	dev_classes: '<%= project.dev %>/classes',
	dev_extensions: '<%= project.dev %>/extensions',
	dev_modules: '<%= project.dev %>/modules',
	dev_vendor: '<%= project.dev %>/vendor',

	// dist folders
	dist: './dist',
	dist_vendor: '<%= project.dist %>/vendor',

	// docs folders
	docs: './docs',
	docs_generated: '<%= project.docs %>/generated',
	docs_vendor: '<%= project.docs %>/library/js/cylinder'

};

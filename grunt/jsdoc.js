module.exports = {

	docs: {
		src: [
			'<%= project.dev_core %>/class.js',
			'<%= project.dev_core %>/exception.js',
			'<%= project.dev_extensions %>/controllers.js',
			'<%= project.dev_modules %>/analytics.js',
			'<%= project.dev_modules %>/dom.js',
			'<%= project.dev_modules %>/resize.js',
			'<%= project.dev_modules %>/router.js',
			'<%= project.dev_modules %>/scroll.js',
			'<%= project.dev_modules %>/store.js',
			'<%= project.dev_modules %>/templates.js',
			'<%= project.dev_modules %>/utils.js'
		],
		options: {
			destination: '<%= project.docs %>',
			configure: 'jsdoc.json'
			// template: 'node_modules/docdash'
		}
	}

};
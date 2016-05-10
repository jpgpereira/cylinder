module.exports = {

	options: {
		sourceMap: true,
		banner:
			'/*\n' +
			' * <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>)\n' +
			' * @author <%= pkg.author %>\n' +
			' */\n'
	},

	dist: {
		files: {
			'<%= project.dist %>/cylinder.min.js': [
				'<%= project.dist %>/cylinder.js'
			]
		}
	},

	pkgd: {
		files: {
			'<%= project.dist %>/cylinder.pkgd.js': [
				'<%= project.bower %>/async/dist/async.js',
				'<%= project.bower %>/jquery/dist/jquery.js',
				'<%= project.bower %>/underscore/underscore.js',
				'<%= project.bower %>/underscore.string/dist/underscore.string.js',
				'<%= project.bower %>/backbone/backbone.js',
				'<%= project.bower %>/mustache/mustache.js',
				'<%= project.dist %>/cylinder.js'
			]
		}
	}

};
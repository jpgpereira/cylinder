module.exports = {

	options: {
		force: true,
		banner:
			'/*\n' +
			' * <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>)\n' +
			' * @author <%= pkg.author %>\n' +
			' */\n\n'
	},

	dist: {
		files: {
			'<%= project.dist %>/cylinder.js': [
				'<%= project.dev %>/index.js'
			]
		}
	}

};

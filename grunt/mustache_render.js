module.exports = {

	dist: {
		files: [
			{
				data: { v: '<%= pkg.version %>' },
				template: '<%= project.dist %>/cylinder.js',
				dest: '<%= project.dist %>/cylinder.js'
			}
		]
	}

};

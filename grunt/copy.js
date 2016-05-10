module.exports = {

	vendor: {
		files: [

			// copy async
			{
				expand: true,
				cwd: '<%= project.bower %>/async/dist/',
				src: [ 'async.min.js' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy underscore (and map)
			{
				expand: true,
				cwd: '<%= project.bower %>/underscore/',
				src: [ 'underscore-min.js', 'underscore-min.map' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy underscore.string
			{
				expand: true,
				cwd: '<%= project.bower %>/underscore.string/dist/',
				src: [ 'underscore.string.min.js' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy jquery (and map)
			{
				expand: true,
				cwd: '<%= project.bower %>/jquery/dist/',
				src: [ 'jquery.min.js', 'jquery.min.map' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy backbone (and map)
			{
				expand: true,
				cwd: '<%= project.bower %>/backbone/',
				src: [ 'backbone-min.js', 'backbone-min.map' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy mustache.js
			{
				expand: true,
				cwd: '<%= project.bower %>/mustache.js/',
				src: [ 'mustache.min.js' ],
				dest: '<%= project.dist_vendor %>'
			}

		]
	}

};

module.exports = {

	vendor: {
		files: [
			{
				expand: true,
				cwd: '<%= project.dev_vendor %>',
				src: '**',
				dest: '<%= project.dist_vendor %>'
			}
		]
	}

};

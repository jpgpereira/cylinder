module.exports = {

	dist: {
		src: ['<%= project.dist %>'],
		options: { force: true }
	},

	docs: {
		src: ['<%= project.docs %>'],
		options: { force: true }
	}

};

module.exports = {

	dist: {
		src: ['<%= project.dist %>'],
		options: { force: true }
	},

	docs: {
		src: ['<%= project.docs_generated %>'],
		options: { force: true }
	}

};

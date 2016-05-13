module.exports = {

	dist: {
		src: ['<%= project.dist %>'],
		options: { force: true }
	},

	docs: {
		src: ['<%= project.docs_generated %>'],
		options: { force: true }
	},

	docs_vendor: {
		src: ['<%= project.docs_vendor %>'],
		options: { force: true }
	}

};

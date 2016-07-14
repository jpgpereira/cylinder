'use strict';

module.exports = function (cylinder, _module) {

	/**
	 * Analytics module for CylinderClass.
	 * @exports analytics
	 */
	var module = _.extend({}, _module);

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {Boolean} debug - If true, requests won't be sent.
	 * @property {Boolean} log   - Should the module log into the console?
	 */
	module.options = {
		debug: false,
		log: false
	};

	// compiles a ga(...) function and executes it
	// this will read the method's parameters
	function call_ga (args) {
		if (typeof ga == 'undefined' || _.isNull(ga) || !_.isFunction(ga)) return null;

		var s = '\'' + args.join('\',\'') + '\'';
		return !module.options.debug // execute if debug == false
			? eval('ga(' + s + ')')
			: 'ga(' + s + ')';
	};

	// compiles a _gaq.push([...]) function and executes it
	// this will read the method's parameters
	function call_gaq (args) {
		if (typeof _gaq == 'undefined' || _.isNull(_gaq)) return null;

		var s = '\'' + args.join('\',\'') + '\'';
		return !module.options.debug // execute if debug == false
			? _gaq.push(args)
			: '_gaq.push([' + s + '])';
	};

	/**
	 * Send an Analytics pageview to both <code>ga.js</code> and <code>analytics.js</code>.
	 * @param {String} path - The path to send to analytics.
	 */
	module.pageview = function (path) {
		if (module.options.log && !_.isUndefined(console.log))
			console.log('Pageview: ' + path);

		call_ga([ 'send', 'pageview', path ]);
		call_gaq([ '_trackEvent', path ]);
	};

	/**
	 * Send an Analytics event to both <code>ga.js</code> and <code>analytics.js</code>.
	 * @param {String|Number} category - The event's category.
	 * @param {String|Number} action   - The event's action.
	 * @param {String|Number} [label]  - The event's label for that action.
	 * @param {String|Number} [value]  - The event's value for that action.
	 */
	module.event = function (category, action, label, value) {
		if (module.options.log && !_.isUndefined(console.log))
			console.log('Event: ' + category + ' ' + action + ' ' + label + ' ' + value);

		var args = _.toArray(arguments);
		call_ga( _.union([ 'send', 'event' ], args) );
		call_gaq( _.union([ '_trackEvent' ], args) );
	};

	return module; // finish

};

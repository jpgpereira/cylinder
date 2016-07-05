module.exports = function (cylinder, _module) {

	/**
	 * Router module for CylinderClass.
	 * @exports router
	 */
	var module = _.extend({}, _module);

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {Boolean} push     - If true, the module will attempt to use HTML5's pushState.<br />
	 *                                See <a href="http://backbonejs.org/#History" target="_blank">http://backbonejs.org/#History</a>
	 *                                for more details about how pushState works.
	 * @property {Boolean} clicks   - If false, clicking on a link covered by <code>addHandler()</code> will bypass the module's default behaviour.
	 * @property {Boolean} prefix   - Sets up a prefix for all links.
	 * @property {Boolean} selector - The default element selector for the click handler given by <code>addHandler()</code>.
	 * @property {Boolean} navigate_defaults - Allows for default properties to be passed to the module's internal Backbone.Router on <code>go()</code>.
	 */
	module.options = {
		push: false, // is pushState navigation on?
		clicks: true, // is the hyperlink event handler on?
		prefix: '', // should there be a prefix for all links?
		selector: 'a:not([data-bypass])', // this is the default element selector for the click handler

		// other options!
		navigate_defaults: {
			trigger: true
		}
	};

	/**
	 * Has the router triggered?
	 * @type {Boolean}
	 */
	module.done = false;

	/**
	 * Current router URL.
	 * @type {String}
	 */
	module.url = null;

	/**
	 * Current route name.
	 * @type {String}
	 */
	module.route = null;

	/**
	 * Previous router URL.
	 * @type {String}
	 */
	module.previous_url = null;

	/**
	 * Previous route name.
	 * @type {String}
	 */
	module.previous_route = null;

	var routes = {}; // this will contain all routes and middleware!
	var middlewares = []; // this will contain all global middleware that is ALWAYS executed on route change!

	var path_domain = ''; // this will be the domain!
	var path_root = ''; // this will be the root path when navigating!
	var path_full = ''; // this will be the proper path when detecting links!

	function middleware_global (router, composition, args, finish) {
		// this runs through every function in the global middleware!
		// if there's no middleware, ignore.
		if (middlewares.length < 1) return finish();

		return async.eachSeries(
			middlewares,
			function (mid, mid_callback) {
				// this executes the middleware!
				// if it's not a function, then ignore it
				if (!_.isFunction(mid)) mid_callback();
				else mid.apply(router, [ function () { mid_callback(); }, composition.name, args ]);
			},
			function (err) {
				return finish();
			}
		);
	};

	function middleware_specific (router, composition, args, finish) {
		// this runs through every function in the route's specific middleware!
		// if there's no middleware, ignore.
		if (composition.middleware.length < 1) return finish();

		return async.eachSeries(
			composition.middleware,
			function (mid, mid_callback) {
				// this executes the middleware!
				// if it's not a function, then ignore it
				if (!_.isFunction(mid)) mid_callback();
				else mid.apply(router, [ function () { mid_callback(); } ].concat(args));
			},
			function (err) {
				return finish();
			}
		);
	};

	var cylinder_router = Backbone.Router.extend({
		// this custom method will check its name,
		// and execute any middleware before doing the final callback!
		execute: function (callback, args, name) {
			var composition = routes[name]; // current composed route
			var router = this; // recommended context

			// trim the argument list,
			// since it always returns a "null" element
			args = _.initial(args);

			// here we run through potential global middlewares,
			// and then specific middlewares, followed by the actual route callback!
			return middleware_global(router, composition, args, function () {
				return middleware_specific(router, composition, args, function () {
					module.previous_route = module.route; // save the previous route...
					module.route = name; // set the current route...

					module.previous_url = module.url; // save the previous url...
					module.url = (module.options.push) // set the new url...
						? Backbone.history.location.pathname.replace(path_root, '')
						: Backbone.history.location.hash.replace('!', '').replace('#', '');

					// events for the previous route
					if (module.previous_route) {
						cylinder.trigger('routeout:' + module.previous_route, name, args); // trigger a specific event for the framework...
						cylinder.trigger('routeout', module.previous_route, name, args); // trigger a global event for the framework...
					}

					// events for the new route
					cylinder.trigger('route:' + name, args); // trigger a specific event for the framework...
					cylinder.trigger('route', name, args); // trigger a global event for the framework...

					// signal the module that a route has been triggered...
					module.done = true;

					if (callback) callback.apply(router, args); // ...and finished!
				});
			});
		}
	});

	// this will be the router itself!
	// it will manage all routes and even callbacks!
	var obj = new cylinder_router;

	var reload_timeout = null;

	/**
	 * Reloads the page instantaneously, unless a delay is set.
	 *
	 * @param {Number} [delay] - The delay of the reload, in seconds.
	 */
	module.reload = function (delay) {
		reload_timeout = clearTimeout(reload_timeout);

		// if a delay is defined,
		// do a timeout and return it.
		if (_.isNumber(delay) && delay > 0) {
			reload_timeout = setTimeout(function () { module.reload(); }, delay);
			return reload_timeout;
		}

		return window.location.reload();
	};

	/**
	 * Sets up the domain and root this router will operate on.
	 *
	 * @param  {String} [domain] - The base domain for this router.
	 * @param  {String} [root]   - The base path (after domain, the immutable part) for this router.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.setup = function (domain, root) {
		// reuse current variables!
		if (!_.isString(domain)) domain = path_domain;
		if (!_.isString(root)) root = path_root;

		// first step of all: checks if the domain is correct.
		// it shouldn't have more than the domain itself - that part belongs to "path_root"!
		if (!cylinder.s.isBlank(domain)) {
			var first_slash = domain.replace('//', '||').indexOf('/');
			if (first_slash < domain.length) {
				var part_to_move = domain.slice(first_slash + 1);
				domain = domain.replace(part_to_move, '');
				root = part_to_move + root;
			}
		}

		// sets up the appropriate paths.
		// this will set up the hidden vars - if they're to be reconfigured, use this method again!
		path_domain = (!cylinder.s.isBlank(domain) ? cylinder.s.trim(domain, '/') : location.protocol + "//" + location.host) + '/';
		path_root = (!cylinder.s.isBlank(root) ? '/' + cylinder.s.trim(root, '/') : '').replace(path_domain, '') + '/';
		path_full = // domain + root without unnecessary slashes
			cylinder.s.rtrim(path_domain, '/') + '/' +
			cylinder.s.ltrim(path_root, '/');

		// if the router had already been started,
		// restart it so that we don't operate on an older domain/path!
		if (Backbone.History.started) module.start(true);

		return module; // return the module itself.
	};

	/**
	 * Returns the current router's domain.
	 * @return {String}
	 */
	module.domain = function () { return path_domain; };

	/**
	 * Returns the current router's root path.
	 * @return {String}
	 */
	module.root = function () { return path_root; };

	/**
	 * Returns the current router's full path (domain + root).
	 * @return {String}
	 */
	module.path = function () { return path_full; };

	/**
	 * Starts the router.
	 * It will automatically start processing URL changes.
	 *
	 * @param  {Boolean} [silent] - Determines whether the router should fire initial events or not.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.start = function (silent) {
		module.stop(); // stop the router first before doing anything else!
		Backbone.history.start({ pushState: module.options.push, root: path_root, silent: silent || false });
		return module; // return the module itself.
	};

	/**
	 * Stops the router.
	 *
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.stop = function () {
		if (Backbone.History.started)
			Backbone.history.stop();
		return module; // return the module itself.
	};

	/**
	 * Changes the current URL to the one specified.<br />
	 * If <code>start()</code> wasn't called, then it will change URL location natively instead of going through the router's methods.
	 *
	 * @param  {String}  url       - The URL to navigate to.
	 * @param  {Boolean} [options] - Options to pass to Backbone.Router's method.
	 * @param  {Boolean} [prefix]  - Should the method include the prefix set in the module's <code>options.prefix</code>?
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.go = function (url, options, prefix) {
		if (!Backbone.History.started) {
			if (module.options.push) window.location = path_full + url; // change full location!
			else window.location.hash = '#' + url; // only do it if using hash-navigation!
			return module; // return the module itself.
		}

		Backbone.history.navigate(
			(prefix !== false ? module.options.prefix : '') + url,
			_.extend({}, module.options.navigate_defaults, options)
		);

		return module; // return the module itself.
	};

	/**
	 * Adds a handler to the router.
	 * This handler will be triggered every time the URL matches the syntax provided.
	 *
	 * @param {String}      [name]     - Name of the handler for identification purposes inside added middleware. This name will be slugified once added.
	 * @param {String}      syntax     - The URL syntax that will be hash mapped to the handler.
	 * @param {...Function} middleware - Callback functions specific to this handler. They will be executed in the order they're provided.
	 */
	module.add = function () {
		var args = _.flatten(arguments);

		// get the name and the syntax
		var name = _.isString(args[0]) && !cylinder.s.isBlank(args[0]) ? args[0] : false;
		var syntax = _.isString(args[1]) && !cylinder.s.isBlank(args[1]) ? args[1] : args[0];
		if (cylinder.s.isBlank(syntax)) throw new CylinderException('Trying to add a handler to router but no valid syntax provided.');

		// convert name into a valid name
		name = cylinder.s.slugify(name);

		// calculate the prefix
		var prefix = module.options.prefix || '';
		if (
			!cylinder.s.isBlank(prefix) && cylinder.s.endsWith(prefix, '/') &&
			(cylinder.s.startsWith(syntax, '/') || cylinder.s.startsWith(syntax, '(/)'))
		) {
			prefix = prefix.slice(0, prefix.length - 1);
		}

		// get all of the functions
		var functions = _.filter(arguments, _.isFunction);
		var callback = _.last(functions); // get the callback!
		var middleware = _.initial(functions); // get possible middleware!
		var composition = {
			name: name,
			syntax: syntax,
			callback: callback,
			middleware: middleware
		};

		// add the route to our internal object
		// to check if we have middleware to run and stuff...
		routes[name] = composition;

		// and finally, add the route
		// to the proper Backbone.Router object!
		return obj.route(prefix + syntax, name, callback);
	};

	/**
	 * Adds a middleware layer to the global router.
	 * The provided callback will be executed every time the URL changes.
	 *
	 * @param  {Function} func - The middleware function to add.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.use = function (func) {
		middlewares.push(func);
		return module; // return the module itself.
	};

	/**
	 * Removes a middleware layer from the global router.
	 * You must provide the same callback you provided in <code>add()</code>, otherwise this method will do no good.
	 *
	 * @param  {Function} func - The middleware function to add.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.unuse = function (func) {
		middlewares = _.without(middlewares, func);
		return module; // return the module itself.
	};

	// this method will add an event handler that will capture all clicks on internal site links, and call ".navigate".
	// the default selector will NOT capture clicks on hyperlinks with the [data-bypass] attribute.
	/**
	 * Adds an event handler that will capture all clicks on internal site links, and calls the module's <code>go()</code> method.<br />
	 * The default selector will not capture clicks on hyperlinks with the [data-bypass] attribute.
	 *
	 * @param  {String} [selector] - Override the default selector provided to jQuery, in order to target custom elements.<br />
	 *                               If empty, the method will provide the selector from <code>options.selector</code>.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.addHandler = function (selector) {
		var callback = _.last(_.flatten(arguments)); // check for the last argument
		if (!_.isFunction(callback)) callback = null; // reset to null!

		cylinder.dom.$document.on('click.clrouter', _.isString(selector) && !cylinder.s.isBlank(selector) ? selector : module.options.selector, function (e) {
			if (!module.options.clicks) return; // don't do a thing if the event isn't allowed!

			var $this = cylinder.$(this);
			var href = {
				attr: $this.attr('href'),
				prop: $this.prop('href'),
				target: $this.prop('target')
			};

			if (!(cylinder.s.isBlank(href.target) || href.target == '_self')) return; // do not route if target is different than own page or blank link
			if (href.attr == '#' && module.options.push) return e.preventDefault(); // do not route if it's a regular hash, but don't let Backbone catch this event either!

			// checks if there is a valid address in the hyperlink.
			// then, it checks whether or not the address is in the local domain!
			if (
				href.prop &&
				href.prop.slice(0, path_full.length) === path_full &&
				href.prop.indexOf(module.options.prefix) !== -1
			) {
				e.preventDefault();
				module.go(href.prop.replace(path_full, ''));
				if (_.isFunction(callback)) callback($this, href);
			}
		});

		return module; // return the module itself.
	};

	/**
	 * Removes the event handler added by <code>addHandler()</code>.
	 *
	 * @param  {String} [selector] - Previously provided selector to override the default one provided to jQuery, in order to target custom elements.<br />
	 *                               If empty, the method will provide the selector from <code>options.selector</code>.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.removeHandler = function (selector) {
		cylinder.dom.$document.off('click.clrouter', _.isString(selector) && !cylinder.s.isBlank(selector) ? selector : module.options.selector);
		return module; // return the module itself.
	};

	// run the setup at least once
	// so we can have some proper values at start
	module.setup('', cylinder.$(location).attr('pathname'));

	return module; // finish

};

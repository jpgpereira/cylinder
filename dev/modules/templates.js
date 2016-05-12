/**
 * Templates module for CylinderClass.
 * @module Cylinder/templates
 * @param {CylinderClass} cylinder - The running Cylinder instance.
 * @param {Object} module - A premade module.
 */

module.exports = function (cylinder, _module) {

	/** @exports Cylinder/templates */
	var module = _.extend({}, _module);

	// ALL DEPENDENCIES FIRST!
	// If we don't do this, the framework will just
	// die in the water. We don't want to die like that.
	cylinder.dependency('Mustache');

	var add_counter = 0; // counts how many templates have been added
	var replace_counter = 0; // counts how many templates have been replaced by using replace()
	var cache_templates = {}; // cache for templates!
	var cache_partials = {}; // cache for partials!
	var cache_replaced = {}; // cache for replaced html from replace()!

	var load_jobs = {}; // object that will contain templates in loading!
	var load_errored = {}; // object that will contain templates that couldn't be loaded!

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {Boolean}        options.load           - If true, the module will try to load templates automatically.
	 * @property {Boolean}        options.load_cache     - If true, the browser will cache any remotely-fetched templates.
	 * @property {Boolean}        options.load_base_path - Remote template base path.
	 * @property {Boolean}        options.load_extension - Remote template file extension.
	 * @property {Boolean}        options.fire_events    - Fires all events when rendering or doing other things.
	 * @property {Boolean}        options.partials       - All templates will always be available as partials.
	 * @property {String|Boolean} options.premades       - If not false, the module will look for a specific object variable for templates (default: JST).
	 */
	module.options = {
		load: false,
		load_cache: false,
		load_base_path: 'tpl/',
		load_extension: '.mustache',
		fire_events: true,
		partials: true,
		premades: 'JST'
	};

	/**
	 * Default options for templates.
	 *
	 * @type {Object}
	 */
	module.defaults = {};

	/**
	 * Checks if a template is in the local cache.
	 *
	 * @param  {String}  id - The template's unique identifier.
	 * @return {Boolean}
	 */
	module.has = function (id) {
		return _.has(cache_templates, id);
	};

	/**
	 * Adds a template to the local cache.
	 *
	 * @param  {String} id         - The template's unique identifier.
	 * @param  {String} template   - The template's HTML structure.
	 * @param  {Object} [defaults] - Default values for this template.
	 * @param  {Object} [partials] - Included partial templates.
	 * @return {Object} Returns the generated internal template module's object.
	 */
	module.add = function (id, template, defaults, partials) {
		var o = {
			'id': id || 'temp' + add_counter,
			'defaults': _.isObject(defaults) ? defaults : {},
			'partials': _.isObject(partials) ? partials : {},
			'html': (_.isString(template) ? template : '')
				.replace(/<javascript/gi, '<script type="text/javascript"')
				.replace(/<\/javascript>/gi, '</script>')
		};

		Mustache.parse(o.html); // caching
		cache_templates[id] = o; // add to collection
		add_counter++; // add counter

		if (module.options.partials) {
			// generates partial templates
			// so every template can be used
			cache_partials = _.object(_.keys(cache_templates), _.pluck(cache_templates, 'html'));
		}

		return o;
	};

	/**
	 * Returns a template if it exists, and attempts to fetch from the local DOM if it doesn't.
	 *
	 * @param  {String} id - The template's unique identifier.
	 * @return {Object} Returns the generated internal template module's object, or an empty object if not found.
	 */
	module.get = function (id) {
		if (module.has(id)) return cache_templates[id];

		var template_name = cylinder.s.replaceAll(id, '/', '_');
		var $template = cylinder.$('#template_' + template_name);
		if ($template.length > 0) {
			// try to get default values.
			// if fail, it will return an empty object.
			var d = {};
			try {
				// why eval? because template defaults might have functions,
				// and JSON.parse wouldn't pass those to the object!
				d = eval('(' + $template.attr('data-defaults') + ')');
			}
			catch (e) {}

			var template = module.add(id, cylinder.s.trim($template.html()), d); // add it to the cache...
			$template.remove(); // remove from DOM to reduce memory footprint...
			return template; // and return the template!
		}

		return {}; // template wasn't found!
	};

	/**
	 * Attempts to load a remote template.<br />
	 * If multiple strings are provided, the method will call <code>Promise.fail(err)</code> if one of them fails to load, regardless of whether others succeeded.<br /><br />
	 * Notice: this method should be considered and used as an asynchronous method.
	 *
	 * @param  {...String} ids - The unique identifier(s) of the template(s) to load.
	 * @return {Promise} Returns a Promise object.
	 */
	module.load = function () {
		var deferred = $.Deferred();

		// fetch the provided strings
		var ids = _.chain(arguments)
			.flatten()
			.filter(function (id) { return _.isString(id) && !cylinder.s.isBlank(id); })
			.value();

		// if we have more than one ID,
		// we'll re-run this method for each ID provided
		if (ids.length > 1) {
			async.each(ids, function (id, done) {
				module.load(id)
					.done(function (template) { done(null, template); })
					.fail(function (err) { done(err); });
			}, function (err, results) {
				if (err) deferred.reject(err);
				else deferred.resolve();
			});
			return deferred;
		}

		// get the ID of the single template to fetch
		var id = _.first(ids);

		// if the template had an error before,
		// we will error out now!
		if (_.has(load_errored, id)) {
			deferred.reject(load_errored[id]);
			return deferred;
		}

		// if the template is already loading,
		// just add the callback to the job.
		if (_.has(load_jobs, id)) {
			load_jobs[id].promises.push(deferred);
			return deferred;
		}

		// since we now know that it's not in loading or errored,
		// attempt to fetch it from the dom,
		// and if that fails, load it with ajax!
		var template = module.get(id);
		if (!_.isEmpty(template)) {
			deferred.resolve(template);
			return deferred;
		}

		// attempt to fetch the base path for templates.
		// adds a slash if none exists at the end!
		var path_base = module.options.load_base_path;
		if (!cylinder.s.endsWith(path_base, '/')) {
			path_base += '/';
		}

		// attempt to fetch the file name for the path.
		// adds the file extension if it doesn't exist at the last node!
		var path_file = id;
		var path_file_parts = path_file.split('/');
		var path_file_name = _.last(path_file_parts);
		if (!cylinder.s.include(path_file_name, module.options.load_extension)) {
			path_file += module.options.load_extension;
		}

		var job = {
			id: id, // job id
			path: path_base + path_file, // path for file
			date: new Date(), // current job date
			request: null, // current request
			promises: [ deferred ] // deferred object so we can plug into it
		};

		job.request = $.ajax({
			url: job.path,
			cache: module.options.load_cache,
			method: 'get',
			dataType: 'html',
			error: function (jxhr, text, thrown) {
				delete load_jobs[id]; // remove the job from the hashmap...
				var err = { jxhr: jxhr, text: text, thrown: thrown, status: jxhr.status }; // create an error variable...
				load_errored[id] = err; // add the error to the collection...
				_.each(job.promises, function (promise) { promise.reject(err); }); // reject each job promise
			},
			success: function (data) {
				delete load_jobs[id]; // remove the job from the hashmap...
				template = module.add(id, data); // add the template to our collection...
				_.each(job.promises, function (promise) { promise.resolve(template); }); // callback each job
			}
		});

		load_jobs[id] = job; // add it to the running jobs
		return deferred; // and return false because we don't have this template... yet!
	};

	/**
	 * Renders a template.
	 *
	 * @param  {String} id         - The unique identifier of the template to render.
	 * @param  {Object} [options]  - The object of options for the template to use.
	 * @param  {Object} [partials] - The object of partials the template can use.
	 * @return {String} Returns the rendered template.
	 */
	module.render = function (id, options, partials) {
		var template = module.get(id);
		var result = Mustache.render(
			template.html || '!! Template "' + id + '" not found !!',
			_.extend({}, module.defaults, template.defaults, options),
			_.extend({}, cache_partials, template.partials, partials)
		);

		if (module.options.fire_events) {
			var parts = id.split('/');
			cylinder.trigger('render', id, options, partials); // trigger the generic event...
			_.reduce(parts, function (memo, part) {
				// and then trigger specific events...
				// we'll do this based on namespace, for ease of programming!
				memo = cylinder.s.trim(memo + '/' + part, '/');
				cylinder.trigger('render:' + memo, options, partials);
				return memo;
			}, '');
		}

		return result;
	};

	// helper function to simply return a jQuery object
	function getElementFromVariable ($el) {
		if ($el instanceof cylinder.$) {
			return $el;
		}

		// it's not a jQuery object
		// so attempt to convert it to one
		return (_.isString($el) && !cylinder.s.isBlank($el)) || ($el != null && ($el.tagName || $el.nodeName))
			? cylinder.$($el)
			: null;
	}

	/**
	 * Renders a template and applies it to a jQuery element.<br /><br />
	 * If the element is not a jQuery element, it will throw an exception.<br />
	 * If the template does not exist and 'options.load' is enabled, then it will attempt to load the template first.<br /><br />
	 * Notice: this method should be considered and used as an asynchronous method.
	 *
	 * @param  {jQueryObject} $el        - The element to which the template should be rendered and applied to.
	 * @param  {String}       id         - The unique identifier of the template to render.
	 * @param  {Object}       [options]  - The object of options for the template to use.
	 * @param  {Object}       [partials] - The object of partials the template can use.
	 * @return {Promise} Returns a Promise object.
	 */
	module.apply = function ($el, id, options, partials) {
		var deferred = $.Deferred();

		// many times we'd apply stuff to an element that would not yet exist.
		// this time, we'll warn the developer that such element should not be null!
		// TODO: should we throw an exception or just fail gracefully?
		$el = getElementFromVariable($el);
		if ($el === null || $el.length == 0)
			throw new CylinderException('Trying to apply a template to an empty or unknown jQuery element.');

		var ev = function () {
			// this will trigger events
			// so the developer can do interesting stuff!
			if (module.options.fire_events) {
				var parts = id.split('/');
				_.reduce(parts, function (memo, part) {
					// trigger specific events...
					// we'll do this based on namespace, for ease of programming!
					memo = cylinder.s.trim(memo + '/' + part, '/');
					cylinder.trigger('apply:' + memo, $el, id, options, partials);
					return memo;
				}, '');
				cylinder.trigger('apply', $el, id, options, partials); // and then trigger the generic event!
			}
		};

		if (module.options.load) {
			// asynchronous loading is enabled,
			// so we'll do the asynchronous rendering stuff!
			module
				.load(id)
				.fail(function (err) {
					deferred.reject(err); // error occurred while loading the template...
				})
				.done(function () {
					$el.html(module.render(id, options, partials)); // rendering the template if no error...
					deferred.resolve($el, id, options, partials); // call the final callback...
					ev(); // and call events, just to finish!
				});
		}
		else {
			// "load" is not active, just return and do render!
			$el.html(module.render(id, options, partials)); // rendering the template...
			deferred.resolve($el, id, options, partials); // call the final callback...
			ev(); // and call events, just to finish!
		}

		return deferred.promise(); // return the promise so we can declare deferred callbacks!
	};

	/**
	 * Replaces the entire HTML of an element with a rendered version of it.<br /><br />
	 * This method will store the original HTML of the selected element in cache.
	 * If replace is called again on the same element, it will reuse that HTML instead of rendering on top of that rendered result.<br />
	 * If the element is not a jQuery element, it will throw an exception.<br /><br />
	 * Notice: this method is synchronous, however it still returns a promise object
	 * in order to keep consistency between it and <code>apply()</code>, and should be used as such.
	 *
	 * @param  {jQueryObject} $el        - The element to replace the HTML on.
	 * @param  {Object}       [options]  - The object of options for the template to use.
	 * @param  {Object}       [partials] - The object of partials the template can use.
	 * @return {Promise} Returns a Promise object.
	 */
	module.replace = function ($el, options, partials) {
		var deferred = $.Deferred();

		// many times we'd apply stuff to an element that would not yet exist.
		// this time, we'll warn the developer that such element should not be null!
		// TODO: should we throw an exception or just fail gracefully?
		$el = getElementFromVariable($el);
		if ($el === null || $el.length == 0)
			throw new CylinderException('Trying to replace contents on an empty or unknown jQuery element.');

		var ev = function () {
			// this will trigger events
			// so the developer can do interesting stuff!
			if (module.options.fire_events) {
				cylinder.trigger('replace', $el, options, partials); // and then trigger the generic event!
			}
		};

		// this will be the HTML to render
		var template = '';

		// get the id and check against cache
		var id = $el.data('template-id');
		if (!_.str.isBlank(id) && _.has(cache_replaced, id)) {
			template = cache_replaced[id]; // get the HTML from cache
		}
		else {
			id = '' + (new Date()).getTime() + replace_counter; // generate new ID
			$el.data('template-id', id); // associate the new ID to the element in question
			template = cylinder.s.unescapeHTML( $el.html() ); // get the full HTML from the element
			cache_replaced[id] = template; // store template in cache
			replace_counter++; // up the counter by 1
		}

		// render the HTML
		var result = Mustache.render(
			template,
			_.extend({}, module.defaults, options),
			_.extend({}, cache_partials, partials)
		);

		$el.html(result); // applying template...
		deferred.resolve($el, options, partials); // call the final callback...
		ev(); // and call events, just to finish!

		return deferred.promise(); // return the promise so we can declare deferred callbacks!
	};

	if (module.options.premades !== false) {
		// PRE-INITIALIZATION!
		// if there is a "premades" object, then do it!
		var variable = _.isString(module.options.premades) ? module.options.premades : 'JST';
		_.each(_.isObject(window[variable]) ? window[variable] : {}, function (tpl, name) {
			module.add(name, _.isFunction(tpl) ? tpl() : tpl); // add the template
		});
	}

	return module; // finish

};

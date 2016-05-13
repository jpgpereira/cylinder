var cl = Cylinder.init(function () {

	var $container = cl.$('.container');

	// store config
	cl.store.fetch();

	// templates config
	cl.templates.options.load = true;
	cl.templates.options.load_base_path = 'tpl/';
	cl.templates.defaults['markdown'] = function () {
		// parse markdown with renderer above
		// ATTENTION: trim the value, otherwise the first part will turn into a code block!
		return function (val, render) {
			var content = render( cl.s.trim(val) );
			return marked(content);
		};
	};

	// router config
	cl.router.options.push = false; // tell it we want hash navigation
	cl.router.addHandler(); // setup the default handler

	cl.router.use(function (next, route) {
		cl.templates.replace('[data-route-indicator]', { route: route });
		next();
	});

	cl.router.add('error', '*path', function (path) {
		cl.templates.apply($container, 'error', { status: 404, path: path });
	});

	cl.router.add('(home)(/)', function () {
		cl.templates.apply($container, 'home', { app: 'cylinder', adjective: 'awesome', action: 'try it out' });
	});

	cl.router.add('docs(/*path)', function (path) {
		path = cylinder.s(path).trim('/').replaceAll('/', '.').value();

		if (cl.s.isBlank(path)) {
			cl.templates.apply($container, 'docs', { content: 'Pick an item on the right' });
			return;
		}

		$.ajax({
			url: '../docs/' + path + '.md',
			method: 'get',
			dataType: 'html',
			success: function (result) {
				var options = {
					content: result
				};
				options['is_' + path.replace('.', '_')] = true;

				cl.templates.apply($container, 'docs', options)
					.done(function ($el) {
						// on click inside the markdown-body
						$el.find('.markdown-body').on('click', 'a', function (e) {
							var $this = cl.$(this);
							var href = {
								attr: $this.attr('href'),
								prop: $this.prop('href'),
								target: $this.prop('target')
							};
							if (cl.s.startsWith(href.attr, '#')) {
								e.preventDefault();
								e.stopPropagation();
								var $target = $el.find('[name="' + href.attr.replace('#', '') + '"]');
								cl.scroll.go($target);
							}
						});
					})
					.fail(function (err) {
						cl.templates.apply($container, 'error', { status: err.status });
						return;
					});
			}
		});
	});

	cl.router.add('comp(/:path)(/)', function (path) {
		cl.templates.apply($container, 'comp/' + path)
			.done(function () {
				console.log('loaded ' + path + '.tpl because yes!');
			})
			.fail(function (err) {
				cl.templates.apply($container, 'error', { status: err.status });
				return;
			});
	});

	cl.router.start(); // start the process! this must be done after all the routes are set up!

});
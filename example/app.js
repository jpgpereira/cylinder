var cl = Cylinder.init(function () {

	var $container = cl.$('.container');

	// store config
	cl.store.load();

	// templates config
	cl.templates.options.load = true;
	cl.templates.options.load_base_path = 'tpl/';

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
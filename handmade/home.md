<a name="Cylinder"></a>

# Cylinder

Cylinder is a Javascript framework created by [comOn group](http://www.comon.pt/) for our front-end applications.

It gathers and uses multiple **popular libraries** that we've used on our websites - like [jQuery](http://jquery.com/), [Underscore.js](http://underscorejs.org/), [Backbone.js](http://backbonejs.org/) and [Mustache.js](https://github.com/janl/mustache.js), - gathers their functionalities and builds upon them, creating **modules** such as Router, Templates and Store.

## Extensions, models and controllers

You can easily expand the framework with your own methods and properties, by directly extending it, or through modules that provide common functionality for your app.

```
var cl = Cylinder.init(function () {
    // Cylinder.init executes $(document).ready(),
    // so you can run all your jQuery code safely here.

    // adding variables to the instance
    cl.$container = $('#container');

    // changing module-related stuff
    cl.store.switch('localstorage');
    cl.store.fetch();
    cl.store.set('start', Date.now());
    cl.templates.options.load = true;
    cl.templates.defaults['hello'] = function () { return 'world'; };
    cl.router.options.push = true;

    // starting controllers
    cl.initControllers(function () {
        // stuff after initializing controllers,
        // like telling the router to start processing the window location
        cl.router.addHandler();
        cl.router.start();
    });
});
```

Cylinder also allows you to create basic controllers, to help you keep your code organized.

```
// this is a very rudimentary, barebones example
// of how you can organize your controllers.
Cylinder.controller('Todo', function (cl, controller) {
    controller.$element = $('#todo');
    controller.list = new TodoList(); // a previously created Backbone.Collection

    controller.list.on('add', function (model) {
        if (model.view) {
            model.view.$el.appendTo(controller.$element);
        }
    });

    controller.list.on('remove', function (model) {
        if (model.view) {
            model.view.$el.detach();
        }
    });

    window.Todo = controller;
    return controller; // always return your controllers!
});
```

## Dependencies used

Cylinder uses these libraries for common functionality. Some are only used on certain modules and not on the core framework itself, so they can be removed if those modules are not included.

- async - https://github.com/caolan/async
- jQuery - http://jquery.com/
- Underscore - http://underscorejs.org/
- Underscore.string - http://epeli.github.io/underscore.string/
- Backbone - http://backbonejs.org/
- Mustache - https://github.com/janl/mustache.js

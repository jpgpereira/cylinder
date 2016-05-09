/**
 * @augments CylinderClass
 */

module.exports = function (instance) {

	var initialized = false;
	var controllers = {}; // controllers!

	// this method allows for controllers to be indexed to the framework!
	// the controller will be added to a cache until the framework is initialized.
	// when or if it is initialized, then the module will be initialized as well.
	instance.controller = function (name, ctor) {
		// check if we have a name and if it is a string!
		// if the name is blank, then forget about it and throw error!
		if (!_.isString(name) || instance.s.isBlank(name)) throw new CylinderException('Trying to add a nameless controller!');

		// check if ctor is null, cause it's probably just trying to return the controller!
		// if so, check if the module exists, and return it!
		if (_.isUndefined(ctor) || _.isNull(ctor)) {
			if (initialized && _.has(controllers, name)) return controllers[name].instance;
			return null;
		}

		controllers[name] = { constructor: ctor, instance: {} }; // add module to cache
		if (!initialized) return controllers[name].instance; // return the framework instance!

		controllers[name].instance = typeof ctor == 'function' // initialize controller...
			? ctor(instance, controllers[name].instance) // run constructor
			: _.extend(controllers[name].instance, ctor); // it's an object, so just extend it
		instance.trigger('controller', name, controllers[name].instance); // trigger an event for when extended...
		return controllers[name].instance; // and return the module itself!
	};

	// this method just allows us to have a list of indexed controllers!
	// it'll fetch the controller cache and then add the real object to it!
	instance.controllers = function () {
		var result = {};
		_.each(controllers, function (ctrl, name) {
			result[name] = ctrl.instance;
		});
		return result;
	};

	// this method initializes all controllers!
	// it runs through all modules and initializes everything!
	instance.initControllers = function (callback) {
		if (initialized) return instance; // don't do a thing if this already ran!
		initialized = true; // tell the framework that we're set up and ready to go!

		instance.$(function () {
			// runs through each controller
			// and initializes it!
			_.each(controllers, function (ctrl, name) {
				instance.controller(name, ctrl.constructor);
			});

			// run callback, if it's a method!
			if (_.isFunction(callback)) callback(instance);

			// call event so that the app can finish stuff!
			// this will be assyncronous!
			instance.trigger('initcontrollers', instance);
		});

		// return the instance itself because the programmer
		// will be able to customize the short tag!
		return instance;
	};

	return instance;

};

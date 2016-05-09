/**
 * Store module for CylinderClass.
 * @module Cylinder/store
 * @param {CylinderClass} cylinder - The running Cylinder instance.
 * @param {Object} module - A premade module.
 */

module.exports = function (cylinder, _module) {

	/** @exports Cylinder/store */
	var module = _.extend({}, _module);

	var collection = {}; // this will save everything temporarily!

	var method_load_callback = null; // the previous load callback. it will be used by the methods' load functions.
	var method_default = 'localstorage'; // the default method to load the collection from.

	// multiple methods of loading and saving.
	// you can add more methods and then change which one is used.
	var methods = {

		localstorage: {
			// REQUIRES IE8+, FF4+, CHROME4+, SAFARI4+, OPERA10.5+, iOS7+, ANDROID2.1+!
			// http://caniuse.com/#search=localstorage
			load: function () {
				if (cylinder.dependency('localStorage', false)) { // CHECK DEPENDENCY!
					collection = JSON.parse(window.localStorage.getItem('cylinder_data') || '{}');
					if (_.isFunction(method_load_callback)) method_load_callback(collection);
				}
			},
			save: function () {
				if (cylinder.dependency('localStorage', false)) { // CHECK DEPENDENCY!
					window.localStorage.removeItem('cylinder_data');
					window.localStorage.setItem('cylinder_data', JSON.stringify(collection));
				}
			}
		}

	};

	// loads data from an available method.
	// if specified, calls a callback at the end of that loading.
	module.load = function (m, callback) {
		if (cylinder.s.isBlank(m)) m = method_default;
		if (_.isFunction(callback)) method_load_callback = callback;
		if (m in methods) return methods[m].load(callback);
	};

	// saves the current data collection into the specified method.
	// if no method is specified, the default method is used!
	module.save = function (m) {
		if (cylinder.s.isBlank(m)) m = method_default;
		if (m in methods) return methods[m].save();
	};

	// grabs values from one or more variables.
	// a callback can be specified, but it must be the last argument passed!
	module.get = function () {
		var result = {};
		var names = null;
		var callback = null;

		if (arguments.length > 0) {
			// check if we have arguments in this method,
			// and if we do, check if the last one is a function!
			names = _.flatten(arguments);
			callback = _.last(names);
			if (!_.isFunction(callback)) callback = null; // reset to null!
			else names = _.initial(names); // otherwise, cut the callback from the names array!
		}

		// if there's only one name in the array
		// then don't even bother to fetch as an array!
		if (_.isArray(names) && names.length == 1) names = names[0];

		if (_.isArray(names) && !_.isEmpty(names)) _.each(names, function (v) { result[v] = _.has(collection, v) ? collection[v] : undefined; }); // returns several
		else if (_.isString(names) && !cylinder.s.isBlank(names)) result = _.has(collection, names) ? collection[names] : undefined; // returns only one
		else result = collection; // RETURNS EVERYTHING!

		if (_.isFunction(callback)) callback(result);
		return result; // finish and return stuff!
	};

	// saves one or more values onto the collection.
	// if saving multiple values, an object should be passed.
	module.set = function (name, value) {
		if (_.isObject(name)) _.extend(collection, name || {}); // MERGES EVERYTHING!
		else if (!cylinder.s.isBlank(name)) collection[name] = value; // sets only one

		module.save(); // save onto the storage method
	};

	// clears one or more values.
	// the method can receive one or more arguments representing keys in the collection.
	module.clear = function (names) {
		if (arguments.length > 1) names = _.flatten(arguments); // if we have multiple arguments, use them!

		if (_.isArray(names) && !_.isEmpty(names)) _.each(names, function (v) { delete collection[v]; }); // deletes several
		else if (_.isString(names) && !cylinder.s.isBlank(names)) delete collection[names]; // deletes only one
		else collection = {}; // RESETS EVERYTHING!

		module.save(); // save onto the storage method
	};

	return module; // finish

};

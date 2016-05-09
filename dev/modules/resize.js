/*! viewportSize | Author: Tyson Matanich, 2013 | License: MIT */
(function(n){n.viewportSize={},n.viewportSize.getHeight=function(){return t("Height")},n.viewportSize.getWidth=function(){return t("Width")};var t=function(t){var f,o=t.toLowerCase(),e=n.document,i=e.documentElement,r,u;return n["inner"+t]===undefined?f=i["client"+t]:n["inner"+t]!=i["client"+t]?(r=e.createElement("body"),r.id="vpw-test-b",r.style.cssText="overflow:scroll",u=e.createElement("div"),u.id="vpw-test-d",u.style.cssText="position:absolute;top:-1000px",u.innerHTML="<style>@media("+o+":"+i["client"+t]+"px){body#vpw-test-b div#vpw-test-d{"+o+":7px!important}}<\/style>",r.appendChild(u),i.insertBefore(r,e.head),f=u["offset"+t]==7?i["client"+t]:n["inner"+t],i.removeChild(r)):f=n["inner"+t],f}})(window);

/**
 * Resize module for CylinderClass.
 *
 * @module Cylinder/resize
 * @param {CylinderClass} cylinder - The running Cylinder instance.
 * @param {Object} module - A premade module.
 */

module.exports = function (cylinder, _module) {

	/** @exports Cylinder/resize */
	var module = _.extend({}, _module);

	// ALL DEPENDENCIES FIRST!
	// If we don't do this, the framework will just
	// die in the water. We don't want to die like that.
	cylinder.dependency('Cylinder.dom');

	/**
	 * Has the window been resized?
	 * @type {Boolean}
	 */
	module.done = false;

	/**
	 * Current window width.
	 * @type {Number}
	 */
	module.width = 0;

	/**
	 * Current window height.
	 * @type {Number}
	 */
	module.height = 0;

	/**
	 * Previous window width.
	 * @type {Number}
	 */
	module.previous_width = 0;

	/**
	 * Previous window height.
	 * @type {Number}
	 */
	module.previous_height = 0;

	/**
	 * Creates a new rule to be used with the Cylinder/Resize.
	 *
	 * @class CylinderResizeRule
	 * @param  {Object}  options            - The options for this rule.
	 * @param  {Number}  options.width_min  - The mininum width.
	 * @param  {Number}  options.width_max  - The maximum width.
	 * @param  {Number}  options.height_min - The mininum height.
	 * @param  {Number}  options.height_max - The maximum height.
	 * @param  {Function} options.callback<Number,Number,CylinderResizeRule> - A callback function defining the rule given a width and height. Must return a boolean.
	 * @return {CylinderResizeRule} The new resize rule.
	 *
	 * @example
	 * // creates a new rule
	 * var rule = new CylinderResizeRule({
	 *     min_width: 0,
	 *     max_width: 767,
	 *     callback: function (width, height, rule) {
	 *         return width >= rule.min_width && width <= rule.min_height;
	 *     }
	 * });
	 *
	 * // adds the rule into the module
	 * Cylinder.resize.addRule('layout-xs', rule);
	 *
	 * // on a resize, if the callback returns true,
	 * // the name of the rule will be added as a class to the <body> element
	 * // example: <body class="layout-xs">
	 */
	function CylinderResizeRule (options) {
		var r = _.extend({
			name: null,
			width_min: null,
			width_max: null,
			height_min: null,
			height_max: null,
			callback: _.noop
		}, options);

		/**
		 * Turns the rule into a string.
		 * @return {String}
		 */
		r.toString = function () {
			return JSON.stringify(r);
		}

		return r;
	}

	// just a default rule callback
	// for the rules we define below.
	function defaultRuleCallback (width, height, rule) {
		return width >= rule.width && (_.isNumber(rule.width_max) ? width <= rule.width_max : true);
	}

	var rules = {
		// THIS WILL HOLD THE DEFAULT RULES!
		// BASIC RULES: in between widths!
		'layout-xs': new CylinderResizeRule({ width_min: 0, width_max: 767 }),
		'layout-sm': new CylinderResizeRule({ width_min: 768, width_max: 991 }),
		'layout-md': new CylinderResizeRule({ width_min: 992, width_max: 1199 }),
		'layout-lg': new CylinderResizeRule({ width_min: 1200 })
	};

	/**
	 * Adds a rule to the module.
	 * @param    {String}             name - The name of the rule to add.
	 * @param    {CylinderResizeRule} rule - The rule object to add.
	 */
	module.addRule = function (name, rule) {
		rules[name] = rule;
	}

	/**
	 * Removes a rule from the module.
	 * @function
	 * @param    {String} name - The name of the rule to remove.
	 */
	module.removeRule = function (name) {
		delete rules[name];
	}

	/**
	 * Returns a collection of names and their CylinderResizeRules.
	 * @return   {Array.<CylinderResizeRule>} The collection of rules.
	 */
	module.rules = function () {
		return rules;
	}

	// this is the method that will handle resizing!
	// will calc values, call styles according to rules,
	// and call events for components
	function handler (trigger) {
		module.previous_width = module.width;
		module.previous_height = module.height;

		// calc current values!
		module.width = viewportSize.getWidth();
		module.height = viewportSize.getHeight();

		// check every rule to see if we should add classes to the body.
		// we'll use the 'callback' property to evaluate that.
		_.each(rules, function (rule, name) {
			if (!(rule instanceof CylinderResizeRule)) return;
			cylinder.dom.$body.toggleClass(name, (_.isFunction(rule.callback) ? rule.callback : defaultRuleCallback)(module.width, module.height, rule));
		});

		// call the event!
		if (trigger) module.trigger();
	};

	/**
	 * Triggers a <code>resize</code> event on the instance this module is running on,
	 * providing it the current width and height of the window.
	 */
	module.trigger = function () {
		cylinder.trigger('resize', module.width, module.height);
		module.done = true;
	};

	// final setup.
	// this will bind the handler to the event!
	cylinder.dom.$window.on('resize', function (e) { handler(true); });

	// and call the event once, without triggering the event,
	// just so we have proper values!
	handler(false);

	return module; // finish

};

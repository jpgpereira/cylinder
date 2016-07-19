'use strict';

/*! viewportSize | Author: Tyson Matanich, 2013 | License: MIT */
(function(n){n.viewportSize={},n.viewportSize.getHeight=function(){return t("Height")},n.viewportSize.getWidth=function(){return t("Width")};var t=function(t){var f,o=t.toLowerCase(),e=n.document,i=e.documentElement,r,u;return n["inner"+t]===undefined?f=i["client"+t]:n["inner"+t]!=i["client"+t]?(r=e.createElement("body"),r.id="vpw-test-b",r.style.cssText="overflow:scroll",u=e.createElement("div"),u.id="vpw-test-d",u.style.cssText="position:absolute;top:-1000px",u.innerHTML="<style>@media("+o+":"+i["client"+t]+"px){body#vpw-test-b div#vpw-test-d{"+o+":7px!important}}<\/style>",r.appendChild(u),i.insertBefore(r,e.head),f=u["offset"+t]==7?i["client"+t]:n["inner"+t],i.removeChild(r)):f=n["inner"+t],f}})(window);

var CylinderResizeRule = require('../classes/resizerule');

module.exports = function (cylinder, _module) {

	/**
	 * Resize module for CylinderClass.
	 * @exports resize
	 */
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
	module.width = null;

	/**
	 * Current window height.
	 * @type {Number}
	 */
	module.height = null;

	/**
	 * Previous window width.
	 * @type {Number}
	 */
	module.previous_width = null;

	/**
	 * Previous window height.
	 * @type {Number}
	 */
	module.previous_height = null;

	// just a default rule callback
	// for the rules we define below.
	function defaultRuleCallback (width, height, rule) {
		return width >= rule.width_min && (_.isNumber(rule.width_max) ? width <= rule.width_max : true);
	}

	var rules = {
		// THIS WILL HOLD THE DEFAULT RULES!
		// These rules are based on sizes from Bootstrap v4.0.0-alpha.2
		'layout-xs': new CylinderResizeRule({ width_min: 0, width_max: 543 }),
		'layout-sm': new CylinderResizeRule({ width_min: 544, width_max: 767 }),
		'layout-md': new CylinderResizeRule({ width_min: 768, width_max: 991 }),
		'layout-lg': new CylinderResizeRule({ width_min: 992, width_max: 1199 }),
		'layout-xl': new CylinderResizeRule({ width_min: 1200 })
	};

	/**
	 * Adds a rule to the module.
	 *
	 * @param    {String}             name - The name of the rule to add.
	 * @param    {CylinderResizeRule} rule - The rule object to add.
	 */
	module.addRule = function (name, rule) {
		// if the passed rule is not an instance of CylinderResizeRule,
		// then we'll just throw an exception.
		if (!(rule instanceof CylinderResizeRule)) {
			throw new CylinderException('Trying to add something that is not a CylinderResizeRule to the resize module!');
		}

		// add the rule
		rules[name] = rule;

		if (module.width !== null && module.height !== null) {
			// if the module already triggered a resize event,
			// then, from now on, we'll always evaluate new rules as soon as they're added.
			cylinder.dom.$body.toggleClass(name, (_.isFunction(rule.callback) ? rule.callback : defaultRuleCallback)(module.width, module.height, rule));
		}
	}

	/**
	 * Removes a rule from the module.
	 *
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

'use strict';

/**
 * Creates a new CylinderException object.
 *
 * @class
 * @param {String} message - The message for this exception.
 * @param {Mixed}  [value] - A value for this exception.
 */
function CylinderException (message, value) {

	/**
	 * The exception's value.
	 * @type {Mixed}
	 */
	this.value = value;

	/**
	 * The exception's message.
	 * @type {String}
	 */
	this.message = message != null
		? message.toString()
		: message;

	/**
	 * Turns the exception into a string.
	 * @return {String}
	 */
	this.toString = function () {
		return this.message;
	};

};

module.exports = CylinderException;

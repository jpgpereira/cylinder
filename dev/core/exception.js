module.exports = function CylinderException (message, value) {

	/**
	 * Creates a new CylinderException object.
	 * @exports CylinderException
	 * @param {String} message - The message for this exception.
	 * @param {Mixed}  [value] - A value for this exception.
	 */
	var exception = this;

	/**
	 * The exception's value.
	 * @type {Mixed}
	 */
	exception.value = value;

	/**
	 * The exception's message.
	 * @type {String}
	 */
	exception.message = message != null
		? message.toString()
		: message;

	/**
	 * Turns the exception into a string.
	 * @return {String}
	 */
	exception.toString = function () {
		return exception.message;
	};

	return exception;

};

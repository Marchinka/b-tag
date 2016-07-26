var safeExtend = require("./../utils/safeExtend.js");
var formBase = require("./../base/form-base.js");

module.exports = safeExtend(formBase, {
	onFormSubmit: function (callback) {
		this.querySelector("form").onsubmit = callback;
	}
});
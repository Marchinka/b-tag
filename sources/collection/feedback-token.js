var logger = require("./../utils/logger.js");

module.exports = {
	get key() {
	    return this.getAttribute("key");
	},
	set key(val) {
	    this.setAttribute("key", val);
	},
	get default() {
	    return this.getAttribute("default");
	},
	set default(val) {
	    this.setAttribute("default", val);
	},
	createdCallback: function () {
		this.renderFrom({});
	},
	renderFrom: function (data) {
		if (!this.key) {
			logger.warn("No key defined in <feedback-token>");
		}

		var value = data[this.key];
		this.innerHTML = value || this.default;
	}
};
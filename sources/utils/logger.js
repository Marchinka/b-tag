module.exports = {
	disable: false,
	log: function (text) {
		if (!this.disable) {
			console.log(text);
		}
	},
	warn: function (text) {
		if (!this.disable) {
			console.warn(text);
		}
	}
};
var tagPrototypes = {};

module.exports = {
	addPrototype: function (tagName, proto) {
		tagPrototypes[tagName] = proto;
	},
	getPrototype: function (tagName) {
		return tagPrototypes[tagName];
	}
};
var registerElement = require("./registerElement.js");
var safeExtend = require("./safeExtend.js");
var tagPrototypes = require("./tag-prototypes.js");

var getTagPrototype = function (tagName) {
	var proto = tagPrototypes.getPrototype(tagName);
	if (!proto) {
		throw new Error("Cannot find a prototype for tag <" + tagName + ">");
	}
	return proto;
};

var CreateTagStatement = function (tagName) {
	this.tagName = tagName;

	this.from = function (elementPrototype) {
		return registerElement(this.tagName, elementPrototype);
	};

	this.extending = function (argument) {
		var baseElementPrototype = _(argument).isString() ? getTagPrototype(argument) : argument;
		var extendingStatement = new ExtendingStatement(this.tagName, baseElementPrototype);
		return extendingStatement;
	};
};

var ExtendingStatement = function (tagName, baseElementPrototype) {
	this.tagName = tagName;
	this.baseElementPrototype = baseElementPrototype;

	this.from = function (elementPrototype) {
		var proto = safeExtend(this.baseElementPrototype, elementPrototype);
		return registerElement(this.tagName, proto);
	};
};

module.exports = function (tagName) {
	var createTagStatement = new CreateTagStatement(tagName);
	return createTagStatement;
};

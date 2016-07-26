var extend = require("./extend.js");
var tagPrototypes = require("./tag-prototypes.js");

module.exports = function (tagName, element) {
    var elementPrototype = Object.create(HTMLElement.prototype);

    var proto = extend(elementPrototype, element);

    tagPrototypes.addPrototype(tagName, elementPrototype);
    var htmlElement = document.registerElement(tagName, {
        prototype: elementPrototype
    });

    return htmlElement;
};
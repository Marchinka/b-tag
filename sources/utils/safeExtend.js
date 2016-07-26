// Copy all of the properties in the source objects
// over to the destination object, 
// and return the destination object. 
// It's in-order, so the last source will override 
// properties of the same name in previous arguments.
module.exports = function (destination, source) {
	var clonedDestination = {};

    for (var prop1 in destination) {
        var descriptor1 = Object.getOwnPropertyDescriptor(destination, prop1);
        if(descriptor1) Object.defineProperty(clonedDestination, prop1, descriptor1);
    }

    for (var prop2 in source) {
		var descriptor2 = Object.getOwnPropertyDescriptor(source, prop2);
		Object.defineProperty(clonedDestination, prop2, descriptor2);
    }

    clonedDestination.super = destination;
    return clonedDestination;
};

var cloneObject = function (source) {
    var key,value;
    var clone = Object.create(source);

    for (key in source) {
        if (source.hasOwnProperty(key) === true) {
            value = source[key];

            if (value !== null && typeof value === "object") {
                clone[key] = cloneObject(value);
            } else {
                clone[key] = value;
            }
        }
    }
    return clone;
};


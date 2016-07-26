// Copy all of the properties in the source objects
// over to the destination object, 
// and return the destination object. 
// It's in-order, so the last source will override 
// properties of the same name in previous arguments.
module.exports = function (destination, source) {
    for (var prop in source) {
        var descriptor = Object.getOwnPropertyDescriptor(source, prop);
        Object.defineProperty(destination, prop, descriptor);
    }
    return destination;
};
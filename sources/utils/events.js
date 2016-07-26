module.exports = {
	raise: function (element, eventName, obj) {
		if (!eventName) {
			throw new Error("Not valid event name");
		}
		var event = new CustomEvent(eventName);
		event.content = obj;
		element.dispatchEvent(event);
	},
	attachListener: function (element, eventName, callback) {
		element.addEventListener(eventName, callback, false);
	}
};
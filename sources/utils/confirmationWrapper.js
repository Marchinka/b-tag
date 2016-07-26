var events = require("./../utils/events.js");
var constants = require("./../utils/constants.js");

module.exports = function (options) {
	var modal = document.createElement("confirmation-modal");

	modal.title = options.title;
	modal.message = options.message;
	modal.yes = options.yes;
	modal.no = options.no;
	modal.jquery = options.jquery || "$";

	if (_(options.onConfirmation).isFunction()) {
		events.attachListener(modal, constants.onModalConfirmation, function (e) {
			options.onConfirmation(e);
		});
	}

	if (_(options.onDismiss).isFunction()) {
		events.attachListener(modal, constants.onModalDismiss, function (e) {
			options.onDismiss(e);
			modal.destroy();
		});
	}

	document.body.appendChild(modal);
	modal.open();
};
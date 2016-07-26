var fs = require('fs');
var html = fs.readFileSync("./sources/misc/confirmation-modal.html", 'utf8');
var logger = require("./../utils/logger.js");
var events = require("./../utils/events.js");
var constants = require("./../utils/constants.js");

module.exports = {
	get jquery() {
	    return this.getAttribute("jquery");
	},
	set jquery(val) {
	    this.setAttribute("jquery", val);
	},
	get yes() {
	    return this.getAttribute("yes");
	},
	set yes(val) {
	    this.setAttribute("yes", val);
	},
	get no() {
	    return this.getAttribute("no");
	},
	set no(val) {
	    this.setAttribute("no", val);
	},
	get title() {
	    return this.getAttribute("title");
	},
	set title(val) {
	    this.setAttribute("title", val);
	},
	get message() {
	    return this.getAttribute("message");
	},
	set message(val) {
	    this.setAttribute("message", val);
	},		
	createdCallback: function () {
		this.render();
	},	
	attachedCallback: function () {
		this.dataBind();
	},
	render: function () {
		this.innerHTML = html;
		this.content = {
			mainModal: this.querySelector("div.modal"),
			modalTitle: this.querySelector("h4.modal-title"),
			modalMessage: this.querySelector("p.modal-text"),
			yesButton: this.querySelector("button.btn.btn-success"),
			noButton: this.querySelector("button.btn.btn-default")
		};
	},
	dataBind: function () {
		if(this.content.modalTitle) this.content.modalTitle.textContent = this.title;
		if(this.content.modalMessage) this.content.modalMessage.textContent = this.message;
		if(this.content.yesButton) this.content.yesButton.textContent = this.yes;
		if(this.content.noButton) this.content.noButton.textContent = this.no;
	
		var self = this;
		var $ = self.getJquery();
        $(self).children(".modal").on('hidden.bs.modal', function () {
			events.raise(self, constants.onModalDismiss);
        });

        self.content.yesButton.onclick = function (e) {
			events.raise(self, constants.onModalConfirmation, e);
        };		
	},
	open: function () {
		var $ = this.getJquery();
		if (!$) {
			logger.warn("No jquery found for <confirmation-modal> on property '" + this.jquery + "'.");
			return;
		}

		$(this.content.mainModal).modal("show");
	},
	close: function () {
		var $ = this.getJquery();
		if (!$) {
			logger.warn("No jquery found for <confirmation-modal> on property '" + this.jquery + "'.");
			return;
		}

		var modal = this.content.mainModal;
		$(modal).modal("hide");
	},
	getJquery: function () {
		if (!this.jquery) {
			logger.warn("No jquery attribute defined on <confirmation-modal>");
			return undefined;
		}

		var $ = window[this.jquery];
		return $;
	},
	destroy: function () {
		this.parentElement.removeChild(this);
	}
};


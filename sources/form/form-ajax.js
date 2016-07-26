var safeExtend = require("./../utils/safeExtend.js");
var formBase = require("./../base/form-base.js");
var logger = require("./../utils/logger.js");
var events = require("./../utils/events.js");
var constants = require("./../utils/constants.js");

module.exports = safeExtend(formBase, {
	get postUrl() {
	    return this.getAttribute("post-url");
	},
	set postUrl(val) {
	    this.setAttribute("post-url", val);
	},
	get ajaxService() {
	    return this.getAttribute("ajaxService");
	},
	set ajaxService(val) {
	    this.setAttribute("ajaxService", val);
	},
	get loader() {
	    return this.getAttribute("loader");
	},
	set loader(val) {
	    this.setAttribute("loader", val);
	},	
	createdCallback: function () {
		var self = this;
	    self.render();
	    self.onsubmit = function (e) {
	    	e.preventDefault();
	    	self.submit();
	    };
	},	
	submit: function () {
		var $ = window[this.ajaxService];
		if (!$ || !_($.ajax).isFunction()) {
			var ajaxServiceMessage = 
				"Cannot find a valid ajax service '" +
				this.ajaxService + 
				"' on main window for <form-ajax/> tag.";
			logger.warn(ajaxServiceMessage);
			return;
		}

		if (!this.postUrl) {
			var urlMessage = "Undefined postUrl for <form-ajax/> tag.";
			logger.warn(urlMessage);
			return;
		}

		events.raise(this, constants.beforeValidate, {});
		var validationResult = this.validate();

		if (!validationResult) {
			events.raise(this, constants.onClientValidationFailure, {});
			return;
		}

		var self = this;
		var formData = self.getData();
		events.raise(this, constants.beforeSubmit, formData);
				
		self.showLoader();
        $.ajax({
            url: self.postUrl,
            method: "POST",
            data: formData,
            success: function (result) {
				events.raise(self, constants.onSubmitResponse, result);
				self.hideLoader();
				self.clearErrorsAndWarnings();
				if (result.isValid) {
					events.raise(self, constants.onServerValidationSuccess, result);
				} else {
					self.setErrors(result.errors);
					self.setWarnings(result.warnings);
					events.raise(self, constants.onServerValidationFailure, result);
				}
            },
            error: function (result) {
            	self.hideLoader();
				events.raise(self, constants.onSubmitResponse, result);
				//events.raise(this, constants.onSubmitError, {});
            }
        });
	},
	showLoader: function () {
		if (this.loader && !this.querySelector(this.loader)) {
			var loaderElement = document.createElement(this.loader);
			this.appendChild(loaderElement);
		}
	},
	hideLoader: function () {
		if (this.loader) {
			var loaderElements = this.querySelectorAll(this.loader);
			_(loaderElements).forEach(function (loaderElement) {
				loaderElement.parentElement.removeChild(loaderElement);
			});
		}
	}
});

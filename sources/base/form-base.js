var fs = require('fs');
var html = fs.readFileSync("./sources/form/form-ajax.html", 'utf8');
var containerBase = require("./../base/container-base.js");
var safeExtend = require("./../utils/safeExtend.js");
var inputSelectors = "input-text,input-radio-group,input-checkbox,input-textarea,input-select,[custom-input]";
var logger = require("./../utils/logger.js");

module.exports = safeExtend(containerBase, {
	createdCallback: function () {
	    this.render();
	},
	attributeChangedCallback: function () {
	},
	render: function () {
		this.renderWithinInnerContent(html, ".form-ajax-content");
	},
	validate: function () {
		var inputs = this.getInnerInputs();
		var isFormValid = true;
		_(inputs).forEach(function (input) {
			if (_(input.validate).isFunction()) {
				var validationResult = input.validate();
				isFormValid = isFormValid && validationResult;
			} else {
				var message = 
					"<" + 
					input.nodeName.toLowerCase() +
					"> has not validate() method.";
				logger.warn(message);
			}
		});
		return isFormValid;
	},
	getData: function () {
		var inputs = this.getInnerInputs();
		var data = {};
		_(inputs).forEach(function (input) {
			if (input.field) {
				data[input.field] = input.value;	
			} else {
				var message = 
					"<" + 
					this.nodeName.toLowerCase() +
					"> has found a tag of type <" + 
					input.nodeName.toLowerCase() + 
					"> without 'field' attribute. It will be ignored by <form-ajax/>.";
				logger.warn(message);
			}
		});
		return data;
	},
	setData: function (data) {
		var inputs = this.getInnerInputs();
		_(inputs).forEach(function (input) {
			if (data[input.field] !== undefined) {
				input.value = data[input.field];
			}
		});
		return data;
	},
	clearData: function () {
		var inputs = this.getInnerInputs();
		_(inputs).forEach(function (input) {
			input.value = "";
		});
	},
	getInnerInputs: function () {
		var inputs = this.querySelectorAll(inputSelectors);
		return inputs;
	},
	clearErrorsAndWarnings: function () {
		var inputs = this.getInnerInputs();
		_(inputs).forEach(function (input) {
			input.error = "";
			input.warning = "";
		});
	},
	setErrors: function (errors) {
		_(errors).forEach(function (error) {
			var input = this.querySelector("[field=" + error.field + "]");
			if(input) input.error = error.message;
		}, this);		
	},
	setWarnings: function (warnings) {
		_(warnings).forEach(function (warning) {
			var input = this.querySelector("[field=" + warning.field + "]");
			if(input) input.warning = warning.message;
		}, this);		
	}
});

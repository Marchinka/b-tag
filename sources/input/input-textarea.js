var fs = require('fs');
var html = fs.readFileSync("./sources/input/input-textarea.html", 'utf8');
var browserChecker = require("./../utils/browserChecker.js");
var logger = require("./../utils/logger.js");

module.exports = {
	get field() {
	    return this.getAttribute("field");
	},
	set field(val) {
	    this.setAttribute("field", val);
	},
	get rows() {
	    return this.getAttribute("rows") || 1;
	},
	set rows(val) {
	    this.setAttribute("rows", val);
	},	
	get value() {
	    return  this.content.textarea.value;
	},
	set value(val) {
		if (!val) val = "";
		this.content.textarea.value = val;
	    this.setAttribute("value", val);
	},	
	get readonly() {
	    return this.hasAttribute("readonly");
	},
	set readonly(val) {
		if (val) {
			this.setAttribute("readonly", val);
		} else {
			this.removeAttribute("readonly");
		}
	},
	get placeholder() {
	    return this.getAttribute("placeholder");
	},
	set placeholder(val) {
	    this.setAttribute("placeholder", val);
	},    
	get label() {
	    return this.getAttribute("label");
	},
	set label(val) {
	    this.setAttribute("label", val);
	},    
	get error() {
	    return this.getAttribute("error");
	},
	set error(val) {
	    this.setAttribute("error", val);
	},
	get warning() {
	    return this.getAttribute("warning");
	},
	set warning(val) {
	    this.setAttribute("warning", val);
	},
	get required() {
	    return this.hasAttribute("required");
	},
	set required(val) {
		if (val) {
			this.setAttribute("required", val);
		} else {
			this.removeAttribute("required");
		}
	},
	get requiredMessage() {
	    return this.getAttribute("required-message");
	},
	set requiredMessage(val) {
	    this.setAttribute("required-message", val);
	},
	get regex() {
	    return this.getAttribute("regex");
	},
	set regex(val) {
		this.setAttribute("regex", val);
	},
	get regexMessage() {
	    return this.getAttribute("regex-message");
	},
	set regexMessage(val) {
	    this.setAttribute("regex-message", val);
	},
	get maxLength() {
	    return this.getAttribute("max-length");
	},
	set maxLength(val) {
		this.setAttribute("max-length", val);
	},
	get maxLengthMessage() {
	    return this.getAttribute("max-length-message");
	},
	set maxLengthMessage(val) {
	    this.setAttribute("max-length-message", val);
	},	
	get formGroupClass() {
		if (this.error) {
			return "form-group has-error";
		} else if (this.warning) {
			return "form-group has-warning";
		} else if (this.value) {
			return "form-group has-success";	
		}
		return "form-group";
	},  
	createdCallback: function () {
		var self = this;
	    self.render();
	    self.value = self.getAttribute("value");
	    self.dataBind();
	    self.content.formGroup.className = "form-group";
	    self.onkeyup = function (e) {
	    	self.validate();
	    };
	    self.onkeydown = function (e) {
			self.validate();
	    };
	},
	attributeChangedCallback: function () {
		this.dataBind();
	},
	render: function () {
		this.innerHTML = html;
		this.content = { 
			formGroup: this.querySelector(".form-group"),
			textarea: this.querySelector("textarea"),
			label: this.querySelector("label"),
			errorSpan: this.querySelector(".error"),
			warningSpan: this.querySelector(".warning"),
		};
	},
	dataBind: function () {
		if (!this.field) {
			var message = 
				"Tag <" + 
				this.nodeName.toLowerCase() + 
				"> without 'field' attribute. " +
				"This will prevent a correct behaviour inside <form-ajax> or <collection-search-form>.";
			logger.warn(message);			
		}

		// Label Binding
		this.content.label.htmlFor = this.field;
		this.content.label.textContent = this.label;

		// Input Binding
		if (this.content.textarea.value != this.value) this.content.textarea.value = this.value;
		this.content.textarea.name = this.field;
		this.content.textarea.id = this.field;
		this.content.textarea.rows = this.rows;
		if(!browserChecker.isIe()) this.content.textarea.placeholder = this.placeholder || "";

		if (this.readonly) {
			this.content.textarea.setAttribute("readonly", this.readonly);
		} else {
			this.content.textarea.removeAttribute("readonly");
		}

		// Error Binding
		this.content.errorSpan.textContent = this.error;

		// Warning Binding
		this.content.warningSpan.textContent = this.warning;

		// Form Group Binding
		this.content.formGroup.className = this.formGroupClass;
	},
	validate: function () {
		this.error = "";
		this.warning = "";
		
		if (this.required) {
			if (!this.value) {
				this.error = this.requiredMessage;
				return false;
			}
		}

		if (this.regex) {
			var regularExpression = new RegExp(this.regex);
			var isMatching = regularExpression.test(this.value);
			if (!isMatching) {
				this.error = this.regexMessage;
				return false;
			}
		}

		if (this.value && this.maxLength) {
			if (this.value.trim().length > this.maxLength) {
				this.error = this.maxLengthMessage;
				return false;			
			}
		}

		return true;
	}
};


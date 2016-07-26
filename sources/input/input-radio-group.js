var fs = require('fs');
var html = fs.readFileSync("./sources/input/input-radio-group.html", 'utf8');
var safeExtend = require("./../utils/safeExtend.js");
var containerBase = require("./../base/container-base.js");
var logger = require("./../utils/logger.js");

module.exports = safeExtend(containerBase,  {
	get field() {
	    return this.getAttribute("field");
	},
	set field(val) {
	    this.setAttribute("field", val);
	},
	get value() {
	    return this.getCheckedValue();
	},
	set value(val) {
		if (!val) val = "";
		this.checkInnerRadios(val);
	    this.setAttribute("value", val);
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
	    self.dataBind();
	    this.content.formGroup.className = "form-group";
	    self.onclick = function (e) {
	    	self.validate();
	    };	    
	},
	attributeChangedCallback: function () {
		this.dataBind();
	},
	render: function () {
		this.renderWithinInnerContent(html, ".radio-group-content");
		this.content = { 
			formGroup: this.querySelector(".form-group"),
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

		// Error Binding
		this.content.errorSpan.textContent = this.error;

		// Warning Binding
		this.content.warningSpan.textContent = this.warning;

		// Form Group Binding
		this.content.formGroup.className = this.formGroupClass;

		// Inner Radio Binding
		var radios = this.querySelectorAll("input-radio");
		_(radios).forEach(function (radio) {
			radio.field = this.field;
		}, this);		
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

		return true;
	},
	checkInnerRadios: function (val) {
		var radios = this.querySelectorAll("input-radio");
		_(radios).forEach(function (radio) {
			radio.checked = radio.value === val;
		});
	},
	getCheckedValue: function () {
		var radios = this.querySelectorAll("input-radio");
		var checkedRadio = _(radios).find(function (radio) {
			return radio.checked;
		});
		if (checkedRadio) {
			return checkedRadio.value;
		}
		return undefined;
	},
	appendChild: function (child) {
		this.querySelector("content").appendChild(child);
	}
});
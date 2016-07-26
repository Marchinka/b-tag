var fs = require('fs');
var html = fs.readFileSync("./sources/input/input-checkbox.html", 'utf8');
var logger = require("./../utils/logger.js");

module.exports = {
	get field() {
	    return this.getAttribute("field");
	},
	set field(val) {
	    this.setAttribute("field", val);
	},
	get value() {
	    return this.content.input.checked;
	},
	set value(val) {
		if (val) {
			this.content.input.checked = true;
	    	this.setAttribute("checked", true);
		} else {
			this.content.input.checked = false;
	    	this.removeAttribute("checked");
		}
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
	    self.content.formGroup.className = "form-group";
		self.onclick = function (e) {
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
			input: this.querySelector("input"),
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
		this.content.input.value = this.value;
		this.content.input.name = this.field;
		this.content.input.id = this.field;

		if (this.readonly) {
			this.content.input.setAttribute("readonly", this.readonly);
		} else {
			this.content.input.removeAttribute("readonly");
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
		return true;
	}
};


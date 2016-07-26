var fs = require('fs');
var html = fs.readFileSync("./sources/input/input-select.html", 'utf8');
var logger = require("./../utils/logger.js");
var containerBase = require("./../base/container-base.js");
var safeExtend = require("./../utils/safeExtend.js");

module.exports = safeExtend(containerBase, {
	get ajaxService() {
	    return this.getAttribute("ajaxService") || 100;
	},
	set ajaxService(val) {
	    this.setAttribute("ajaxService", val);
	},
	get fetchTimeout() {
	    return this.getAttribute("fetch-timeout");
	},
	set fetchTimeout(val) {
	    this.setAttribute("fetch-timeout", val);
	},	
	get getUrl() {
	    return this.getAttribute("get-url");
	},
	set getUrl(val) {
	    this.setAttribute("get-url", val);
	},	
	get field() {
	    return this.getAttribute("field");
	},
	set field(val) {
	    this.setAttribute("field", val);
	},
	get value() {
	    return  this.content.select.value;
	},
	set value(val) {
		if (!val) val = "";
		this.content.select.value = val;
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
	attachedCallback: function () {
		var self = this;
		self.firstFetchTimeout = setTimeout(function () {
			self.renderOptions();
		}, self.fetchTimeout);
	},
	detachedCallback: function () {
		clearTimeout(this.firstFetchTimeout);
	},	
	render: function () {
		this.renderWithinInnerContent(html, "select.select-content");
		this.content = { 
			formGroup: this.querySelector(".form-group"),
			select: this.querySelector("select"),
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
		this.content.select.name = this.field;
		this.content.select.id = this.field;

		if (this.readonly) {
			this.content.select.setAttribute("readonly", this.readonly);
		} else {
			this.content.select.removeAttribute("readonly");
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

		return true;
	},
	appendChild: function (child) {
		var content = this.querySelector("select");
		if (!content) {
			console.warn("An <input-select> element must contain an inner <select> tag.");
			return;
		}
		content.appendChild(child);
	},
	renderOptions: function () {
		if (!this.getUrl) {
			return;
		}

		var $ = window[this.ajaxService];
		if (!$ || !_($.ajax).isFunction()) {
			var ajaxServiceMessage = 
				"Cannot find a valid ajax service '" +
				this.ajaxService + 
				"' on main window for <collection-container/> tag.";
			logger.warn(ajaxServiceMessage);
			return;
		}

		var self = this;
        $.ajax({
            url: self.getUrl,
            method: "GET",
            data: {},
            success: function (result) {
				var optionList = result.data;
				if (optionList) {
					_(optionList).forEach(function (item) {
						var option = document.createElement("option");
						option.value = item.value;
						option.textContent = item.textContent;
						self.appendChild(option);
					});
				} else {
					logger.warn("No collection data defined. The result should have a structure of type { data: [ { value: '', textContent: '' }, ... ] }.");
				}
            },
            error: function (result) {
				
            }
        });
	}
});

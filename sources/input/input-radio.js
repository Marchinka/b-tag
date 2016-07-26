var fs = require('fs');
var html = fs.readFileSync("./sources/input/input-radio.html", 'utf8');

module.exports = {
	get checked() {
	    return this.content.input.checked;
	},
	set checked(val) {
		if (val) {
			this.content.input.checked = true;
			this.setAttribute("checked", val);
		} else {
			this.content.input.checked = false;
			this.removeAttribute("checked");
		}
	},
	get field() {
	    return this.getAttribute("field");
	},
	set field(val) {
	    this.setAttribute("field", val);
	},
	get value() {
	    return this.getAttribute("value");
	},
	set value(val) {
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
	get label() {
	    return this.getAttribute("label");
	},
	set label(val) {
	    this.setAttribute("label", val);
	},
	createdCallback: function () {
	    this.render();
	    this.dataBind();
	    if (this.hasAttribute("checked")) {
	    	this.content.input.checked = true;
	    } else {
	    	this.content.input.checked = false;
	    }	    
	},
	attributeChangedCallback: function () {
		this.dataBind();
	},
	render: function () {
		this.innerHTML = html;
		this.content = { 
			input: this.querySelector("input"),
			label: this.querySelector("label"),
			radioLabel: this.querySelector(".radio-label"),
		};
	},
	dataBind: function () {
		// Label Binding
		this.content.label.htmlFor = this.field + this.value;
		this.content.radioLabel.textContent = this.label;

		// Input Binding
		this.content.input.value = this.value;
		this.content.input.name = this.field;
		this.content.input.id = this.field + this.value;

		if (this.readonly) {
			this.content.input.setAttribute("disabled", this.readonly);
		} else {
			this.content.input.removeAttribute("disabled");
		}
	}
};


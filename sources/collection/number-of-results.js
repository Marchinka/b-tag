module.exports = {
	get value() {
	    return this.getAttribute("value");
	},
	set value(val) {
	    this.setAttribute("value", val);
	},
	createdCallback: function () {
		this.render();
	},
	attributeChangedCallback: function () {
		this.render();
	},
	render: function () {
		this.innerHTML = this.value || 0;
	}
};
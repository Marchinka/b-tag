var containerBase = require("./../base/container-base.js");
var safeExtend = require("./../utils/safeExtend.js");
var logger = require("./../utils/logger.js");
var containerBase = require("./../base/container-base.js");

module.exports = safeExtend(containerBase, {
	get dataSource() {
	    return this._dataSource;
	},
	get template() {
	    return this.getAttribute("template");
	},
	set template(val) {
	    this.setAttribute("template", val);
	},	
	get loader() {
	    return this.getAttribute("loader");
	},
	set loader(val) {
	    this.setAttribute("loader", val);
	},		
	createdCallback: function () {
		var html = "<content class='collection-elements-content'></content><content style='display: none' class='collection-elements-template'></content>";
		this.renderWithinInnerContent(html, ".collection-elements-template");		
		this._dataSource = [];

		var children = this.querySelector(".collection-elements-template").children;
		var firstChild;
		for (var i = 0; i < children.length; i++) {
			var item = children[i];
			if (item !== null && item.nodeType !== 3) {
				firstChild = item;
				break;
			}
		}

		if(firstChild) {
			var deepClone = false;
			var templateNode = firstChild.cloneNode(deepClone);
			this.templateNode = templateNode;
		}
	},
	appendData: function (list) {
		_(list).forEach(function (item) {
			var listItem = this.getListItem(item);
			if(listItem) {
				this._dataSource.push(item);
				this.appendChild(listItem);
			}
		}, this);
	},
	clearData: function () {
		this.querySelector(".collection-elements-content").innerHTML = "";
		this._dataSource = [];
	},
	getListItem: function (item) {
		if (this.templateNode && this.template) {
			var message = 
				"Tag <" + 
				this.nodeName.toLowerCase() + 
				"> has both an inner template and a defined 'template'property. " +
				"In case of ambiguity, inner template will be used";
			logger.warn(message);			
		}

		if (this.templateNode) {
			var deepClone = false;
			var templateItemFromNode = this.templateNode.cloneNode(deepClone);
			return this.renderTemplateItem(templateItemFromNode, item);			
		}

		if (this.template) {
			var templateItem = document.createElement(this.template);
			return this.renderTemplateItem(templateItem, item);
		}
		
		var textItem = document.createElement("p");
		textItem.textContent = JSON.stringify(item);
		return textItem;
	},
	renderTemplateItem: function (templateItem, item) {
		if (templateItem.renderFrom && _(templateItem.renderFrom).isFunction()) {
			templateItem.renderFrom(item);
			return templateItem;
		} else {
			var message = 
				"Tag <" + 
				templateItem.nodeName.toLowerCase() + 
				"> must have a renderFrom() method is order to be used as a template";
			logger.warn(message);
			return;
		}
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

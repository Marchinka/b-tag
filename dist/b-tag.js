(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (!window._) {
    throw new Error("Underscore.js must be loaded as dependency");
}

var registerElement = require("./utils/registerElement.js");
var createTag = require("./utils/createTag.js");
var safeExtend = require("./utils/safeExtend.js");
var elementDictionary = require("./utils/elementDictionary.js");
var browserChecker = require("./utils/browserChecker.js");
var logger = require("./utils/logger.js");
var events = require("./utils/events.js");
var constants = require("./utils/constants.js");
var confirmationWrapper = require("./utils/confirmationWrapper.js");

window.b = {
    tag: {
        registerElement: registerElement,
        createTag: createTag,
        safeExtend: safeExtend,
        logger: logger,
        events: events,
        confirmationWrapper: confirmationWrapper,
        elements: {
            // Input
            InputText: createTag("input-text").from(elementDictionary.inputText),
            InputTextarea: createTag("input-textarea").from(elementDictionary.inputTextarea),
            InputCheckbox: createTag("input-checkbox").from(elementDictionary.inputCheckbox),
            InputRadio: createTag("input-radio").from(elementDictionary.inputRadio),
            InputRadioGroup: createTag("input-radio-group").from(elementDictionary.inputRadioGroup),
            InputSelect: createTag("input-select").from(elementDictionary.inputSelect),

            // Misc
            PartialAjax: createTag("partial-ajax").from(elementDictionary.partialAjax),
            ConfirmationModal: createTag("confirmation-modal").from(elementDictionary.confirmationModal),

            // Form
            FormAjax: createTag("form-ajax").from(elementDictionary.formAjax),

            // Collection
            CollectionSearchForm: createTag("collection-search-form").from(elementDictionary.collectionSearchForm),
            CollectionElements: createTag("collection-elements").from(elementDictionary.collectionElements),
            CollectionContainer: createTag("collection-container").from(elementDictionary.collectionContainer),
            FeedbackToken: createTag("feedback-token").from(elementDictionary.feedbackToken),
            NumberOfResults: createTag("number-of-results").from(elementDictionary.numberOfResults),
        }
    }
};

if ( typeof module === "object" && typeof module.exports === "object" ) {
    // For CommonJS and CommonJS-like environments
    module.exports = window.btag;
}

var cloackedElements = document.querySelectorAll("[" + constants.cloakingClass + "]");

_(cloackedElements).forEach(function (element) {
    element.removeAttribute(constants.cloakingClass);
});
},{"./utils/browserChecker.js":18,"./utils/confirmationWrapper.js":19,"./utils/constants.js":20,"./utils/createTag.js":21,"./utils/elementDictionary.js":22,"./utils/events.js":23,"./utils/logger.js":25,"./utils/registerElement.js":26,"./utils/safeExtend.js":27}],2:[function(require,module,exports){
module.exports = {
	appendChild: function (child) {
		var content = this.querySelector("content");
		if (!content) {
			console.warn("A container element must contain an innr <content> tag.");
			return;
		}
		content.appendChild(child);
	},
	renderWithinInnerContent: function (html, selector) {
		var innerContent;
		var innerContentContainer = this.querySelector(selector);
		
		if (innerContentContainer) {
			innerContent = innerContentContainer.innerHTML;
			this.innerHTML = html;
			this.querySelector(selector).innerHTML = innerContent;
		}
		
		else {
			innerContent = this.innerHTML;
			this.innerHTML = html;
			this.querySelector(selector).innerHTML = innerContent;
		}
	}	
};
},{}],3:[function(require,module,exports){

var html = "<form>\r\n\t<content class=\"form-ajax-content\"></content>\r\n</form>";
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

},{"./../base/container-base.js":2,"./../utils/logger.js":25,"./../utils/safeExtend.js":27}],4:[function(require,module,exports){
var containerBase = require("./../base/container-base.js");
var safeExtend = require("./../utils/safeExtend.js");
var logger = require("./../utils/logger.js");
var constants = require("./../utils/constants.js");
var events = require("./../utils/events.js");

module.exports = safeExtend(containerBase, {
	get page() {
	    return this.getAttribute("page");
	},
	set page(val) {
	    this.setAttribute("page", val);
	},
	get elementsPerPage() {
	    return this.getAttribute("elements-per-page");
	},
	set elementsPerPage(val) {
	    this.setAttribute("elements-per-page", val);
	},	
	get getUrl() {
	    return this.getAttribute("get-url");
	},
	set getUrl(val) {
	    this.setAttribute("get-url", val);
	},
	get ajaxService() {
	    return this.getAttribute("ajaxService");
	},
	set ajaxService(val) {
	    this.setAttribute("ajaxService", val);
	},
	get showMoreStrategy() {
	    return this.hasAttribute("show-more-strategy");
	},
	set showMoreStrategy(val) {
		if (val) {
			this.setAttribute("show-more-strategy", val);
		} else {
			this.removeAttribute("show-more-strategy");
		}
	},
	get infiniteScrollingStrategy() {
	    return this.hasAttribute("infinite-scrolling-strategy");
	},
	set infiniteScrollingStrategy(val) {
		if (val) {
			this.setAttribute("infinite-scrolling-strategy", val);
		} else {
			this.removeAttribute("infinite-scrolling-strategy");
		}
	},
	get automaticFirstFetch() {
	    return this.getAttribute("automatic-first-fetch");
	},
	set automaticFirstFetch(val) {
		this.setAttribute("automatic-first-fetch", val);
	},
	get automaticRefresh() {
	    return this.getAttribute("automatic-refresh");
	},
	set automaticRefresh(val) {
		this.setAttribute("automatic-refresh", val);
	},	
	createdCallback: function () {
	    this.render();
	},
	attachedCallback: function () {
		var self = this;

		if (self.automaticFirstFetch) {
			self.firstFetchTimeout = setTimeout(function () {
				self.fetchData();
			}, self.automaticFirstFetch);
		}

		if (self.automaticRefresh) {
			self.refreshInterval = setInterval(function () {
				self.clearData();
				self.page = 1;
				self.fetchData();
			}, self.automaticRefresh);
		}		
	},
	detachedCallback: function () {
		clearTimeout(this.firstFetchTimeout);
		clearIntervalTimeout(this.refreshInterval);
	},
	render: function () {
		var self = this;
		var html = "<content class='collection-container-content'></content>";
		self.renderWithinInnerContent(html, ".collection-container-content");
		self.content = { 
			searchForm: self.querySelector("collection-search-form"),
			elements: self.querySelector("collection-elements"),
			showMoreButton: self.querySelector("[show-more-button]")
		};
		self.page = 1;
		if (!self.content.elements) {
			logger.warn("No <collection-elements> tag defined inside <collection-container>");
		}

		self.addListenerToForm();

		if (self.showMoreStrategy) {
			self.activateShowMoreButton();
		}

		if (self.infiniteScrollingStrategy) {
			self.activateInfiniteScrolling();
		}		
	},
	addListenerToForm: function ()
	{
		var self = this;
		if (self.content.searchForm) {
			self.addEventListener("submit", function (e) {
		    	e.preventDefault();
		    	self.clearData();
		    	self.page = 1;
		    	self.fetchData();
		    });
		}		
	},
	activateShowMoreButton: function () {
		var self = this;
		if (self.content.showMoreButton) {
			self.content.showMoreButton.onclick = function (e) {
				self.page++;
				self.fetchData();
			};
		}
	},
    activateInfiniteScrolling: function () {
        var self = this;
        var scrollCallback =  function () {                    
            var positionOffset = window.outerHeight + (window.scrollY || pageYOffset) - document.body.offsetHeight;
            //console.log(positionOffset);
            if (positionOffset >= 0) {
				self.page++;
				self.fetchData();
			}                    
        };
        var throttledFunction = _.throttle(scrollCallback, 300);
        window.addEventListener("scroll", throttledFunction, false);
    },	
	clearData: function() {
		if (!this.content.elements) {
			logger.warn("No <collection-elements> tag defined inside <collection-container>");
			return;
		} else {
			this.content.elements.clearData();
		}
	},
	appendData: function(data) {
		if (!this.content.elements) {
			logger.warn("No <collection-elements> tag defined inside <collection-container>");
			return;
		} else {
			this.content.elements.appendData(data);
		}
	},
	showLoader: function () {
		if (this.numberOfLastFetchResults !== 0) {
			this.content.elements.showLoader();
		}
	},
	hideLoader: function () {
		this.content.elements.hideLoader();
	},	
	handleData: function (data) {
		this.appendData(data);
	},
	updateFeedbackTokens: function (data) {
		var feedbackTokens = this.querySelectorAll("feedback-token,[feedback-token]");
		_(feedbackTokens).forEach(function (feedbackToken) {
			feedbackToken.renderFrom(data);
		});
	},
	updateNumberOfResults: function (data) {
		var numberOfResults = this.querySelector("number-of-results");
		if (numberOfResults) {
			numberOfResults.value = this.content.elements.dataSource.length;
		}
	},	
	validate: function () {
		if (this.content.searchForm) {
			return this.content.searchForm.validate();
		} else {
			return false;
		}
	},
	getSearchData: function () {
		if (this.content.searchForm) {
			return this.content.searchForm.getData();
		} else {
			return undefined;
		}
	},
	fetchData: function () {
		var $ = window[this.ajaxService];
		if (!$ || !_($.ajax).isFunction()) {
			var ajaxServiceMessage = 
				"Cannot find a valid ajax service '" +
				this.ajaxService + 
				"' on main window for <collection-container/> tag.";
			logger.warn(ajaxServiceMessage);
			return;
		}

		if (!this.getUrl) {
			var urlMessage = "Undefined getUrl for <collection-container/> tag.";
			logger.warn(urlMessage);
			return;
		}

		var searchData = {};

		if (this.content.searchForm) {
			events.raise(this, constants.beforeValidate, {});
			var validationResult = this.validate();

			if (!validationResult) {
				events.raise(this, constants.onClientValidationFailure, {});
				return;
			}

			searchData = this.getSearchData();
			events.raise(this, constants.beforeSubmit, searchData);

			var formHasSameValues = _.matcher(this.lastSearchData);
			if (!formHasSameValues(searchData)) {
				this.page = 1;
				this.numberOfLastFetchResults = undefined;
				this.clearData();
			}
			this.lastSearchData = _(searchData).clone();
		}
		searchData.page = this.page;
		searchData.elementsPerPage = this.elementsPerPage;
					
		var self = this;
		self.showLoader();

        $.ajax({
            url: self.getUrl,
            method: "GET",
            data: searchData,
            success: function (result) {
            	self.hideLoader();
				var collectionData = result.data;
				if (collectionData) {
					self.numberOfLastFetchResults = collectionData.length;
					self.handleData(collectionData);
					self.updateFeedbackTokens(result);
					self.updateNumberOfResults();
				} else {
					logger.warn("No collection data defined. The result should have a structure of type { dat: [] }.");
				}
            },
            error: function (result) {
				self.hideLoader();
				events.raise(self, constants.onSubmitResponse, result);
				//events.raise(this, constants.onSubmitError, {});
            }
        });
	}
});

},{"./../base/container-base.js":2,"./../utils/constants.js":20,"./../utils/events.js":23,"./../utils/logger.js":25,"./../utils/safeExtend.js":27}],5:[function(require,module,exports){
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

},{"./../base/container-base.js":2,"./../utils/logger.js":25,"./../utils/safeExtend.js":27}],6:[function(require,module,exports){
var safeExtend = require("./../utils/safeExtend.js");
var formBase = require("./../base/form-base.js");

module.exports = safeExtend(formBase, {
	onFormSubmit: function (callback) {
		this.querySelector("form").onsubmit = callback;
	}
});
},{"./../base/form-base.js":3,"./../utils/safeExtend.js":27}],7:[function(require,module,exports){
var logger = require("./../utils/logger.js");

module.exports = {
	get key() {
	    return this.getAttribute("key");
	},
	set key(val) {
	    this.setAttribute("key", val);
	},
	get default() {
	    return this.getAttribute("default");
	},
	set default(val) {
	    this.setAttribute("default", val);
	},
	createdCallback: function () {
		this.renderFrom({});
	},
	renderFrom: function (data) {
		if (!this.key) {
			logger.warn("No key defined in <feedback-token>");
		}

		var value = data[this.key];
		this.innerHTML = value || this.default;
	}
};
},{"./../utils/logger.js":25}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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

},{"./../base/form-base.js":3,"./../utils/constants.js":20,"./../utils/events.js":23,"./../utils/logger.js":25,"./../utils/safeExtend.js":27}],10:[function(require,module,exports){

var html = "<div class=\"form-group\">\r\n\t<label></label>\r\n\t<input type=\"checkbox\" />\r\n\t<span class=\"error help-block\"></span>\r\n\t<span class=\"warning help-block\"></span>\r\n</div>";
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


},{"./../utils/logger.js":25}],11:[function(require,module,exports){

var html = "<div class=\"form-group\">\r\n    <label></label>\r\n    <content class=\"radio-group-content\"></content>\r\n    <span class=\"error help-block\"></span>\r\n    <span class=\"warning help-block\"></span>\r\n</div>";
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
},{"./../base/container-base.js":2,"./../utils/logger.js":25,"./../utils/safeExtend.js":27}],12:[function(require,module,exports){

var html = "<div class=\"radio\">\r\n  <label>\r\n    <input type=\"radio\"/>\r\n    <span class=\"radio-label\"></span>\r\n  </label>\r\n</div>";

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


},{}],13:[function(require,module,exports){

var html = "<div class=\"form-group\">\r\n\t<label></label>\r\n\t<select class=\"form-control select-content\"></select>\r\n\t<span class=\"error help-block\"></span>\r\n\t<span class=\"warning help-block\"></span>\r\n</div>";
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

},{"./../base/container-base.js":2,"./../utils/logger.js":25,"./../utils/safeExtend.js":27}],14:[function(require,module,exports){

var html = "<div class=\"form-group\">\r\n\t<label></label>\r\n\t<input class=\"form-control\" type=\"text\"/>\r\n\t<span class=\"error help-block\"></span>\r\n\t<span class=\"warning help-block\"></span>\r\n</div>";
var browserChecker = require("./../utils/browserChecker.js");
var logger = require("./../utils/logger.js");

module.exports = {
	get field() {
	    return this.getAttribute("field");
	},
	set field(val) {
	    this.setAttribute("field", val);
	},
	get value() {
	    return  this.content.input.value;
	},
	set value(val) {
		if (!val) val = "";
		this.content.input.value = val;
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
	    self.value = this.getAttribute("value");
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
		if (this.content.input.value != this.value) this.content.input.value = this.value;
		this.content.input.name = this.field;
		this.content.input.id = this.field;
		if(!browserChecker.isIe()) this.content.input.placeholder = this.placeholder || "";

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


},{"./../utils/browserChecker.js":18,"./../utils/logger.js":25}],15:[function(require,module,exports){

var html = "<div class=\"form-group\">\r\n\t<label></label>\r\n\t<textarea type=\"text\" class=\"form-control\"></textarea>\r\n\t<span class=\"error help-block\"></span>\r\n\t<span class=\"warning help-block\"></span>\r\n</div>";
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


},{"./../utils/browserChecker.js":18,"./../utils/logger.js":25}],16:[function(require,module,exports){

var html = "<div class=\"modal fade\"role=\"dialog\">\r\n  <div class=\"modal-dialog\">\r\n  \r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n        <h4 class=\"modal-title\">Confirmation</h4>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <p class=\"modal-text\">Are you sure you want to complete this operation?</p>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">No</button>\r\n        <button type=\"button\" class=\"btn btn-success\" data-dismiss=\"modal\">Yes</button>\r\n      </div>\r\n    </div>\r\n    \r\n  </div>\r\n</div>";
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


},{"./../utils/constants.js":20,"./../utils/events.js":23,"./../utils/logger.js":25}],17:[function(require,module,exports){
module.exports = {
	get url() {
	    return this.getAttribute("url");
	},
	set url(val) {
	    this.setAttribute("url", val);
	},
	get errorTag() {
	    return this.getAttribute("errorTag");
	},
	set errorTag(val) {
	    this.setAttribute("errorTag", val);
	},		
	get loaderTag() {
	    return this.getAttribute("loaderTag");
	},
	set loaderTag(val) {
	    this.setAttribute("loaderTag", val);
	},	
	get ajaxService() {
	    return this.getAttribute("ajax-service");
	},
	set ajaxService(val) {
	    this.setAttribute("ajax-service", val);
	},  	
	attachedCallback: function () {
	    this.render();
	},
	attributeChangedCallback: function () {
		this.render();
	},
	render: function () {
		var $ = window[this.ajaxService];
		var self = this;
		self.innerHTML = "";
		self.renderLoader();
		$.ajax({
			url: self.url,
			method: 'GET',
			success: function (result) {
				self.innerHTML = result;
			},
			error: function () {
				self.renderError();
			}
		});
	},
    getLoaderElement: function () {
        if (!this.loaderTag) {
            var loaderTag = document.createElement("span");
            loaderTag.textContent = "Loading...";
            return loaderTag;
        } else {
            return document.createElement(this.loaderTag);
        }
    },
    getErrorElement: function () {
        if (!this.errorTag) {
            var errorElement = document.createElement("span");
            errorElement.textContent = "An error has occurred loading the content.";
            return errorElement;
        } else {
            return document.createElement(this.errorTag);
        }
    },        
    renderError: function () {
        var errorElement = this.getErrorElement();
        this.innerHTML = '';
        this.appendChild(errorElement);
    },
    renderLoader: function () {
        var loaderTag = this.getLoaderElement();
        this.innerHTML = '';
        this.appendChild(loaderTag);
    }
};


},{}],18:[function(require,module,exports){
module.exports = {
	isIe: function () {
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		return isIE;
	}
};
},{}],19:[function(require,module,exports){
var events = require("./../utils/events.js");
var constants = require("./../utils/constants.js");

module.exports = function (options) {
	var modal = document.createElement("confirmation-modal");

	modal.title = options.title;
	modal.message = options.message;
	modal.yes = options.yes;
	modal.no = options.no;
	modal.jquery = options.jquery || "$";

	if (_(options.onConfirmation).isFunction()) {
		events.attachListener(modal, constants.onModalConfirmation, function (e) {
			options.onConfirmation(e);
		});
	}

	if (_(options.onDismiss).isFunction()) {
		events.attachListener(modal, constants.onModalDismiss, function (e) {
			options.onDismiss(e);
			modal.destroy();
		});
	}

	document.body.appendChild(modal);
	modal.open();
};
},{"./../utils/constants.js":20,"./../utils/events.js":23}],20:[function(require,module,exports){
module.exports = {

	// Events
	beforeValidate: "before-validate",
	onClientValidationFailure: "on-client-validation-failure",
	onServerValidationFailure: "on-server-validation-failure",
	onServerValidationSuccess: "on-server-validation-success",
	beforeSubmit: "before-submit",
	onSubmitResponse: "on-submit-response",
	onSubmitError: "on-submit-error",
	cloakingClass: "initial-cloak",
	onModalDismiss: "on-modal-dismiss",
	onModalConfirmation: "on-modal-confirmation",
};
},{}],21:[function(require,module,exports){
var registerElement = require("./registerElement.js");
var safeExtend = require("./safeExtend.js");
var tagPrototypes = require("./tag-prototypes.js");

var getTagPrototype = function (tagName) {
	var proto = tagPrototypes.getPrototype(tagName);
	if (!proto) {
		throw new Error("Cannot find a prototype for tag <" + tagName + ">");
	}
	return proto;
};

var CreateTagStatement = function (tagName) {
	this.tagName = tagName;

	this.from = function (elementPrototype) {
		return registerElement(this.tagName, elementPrototype);
	};

	this.extending = function (argument) {
		var baseElementPrototype = _(argument).isString() ? getTagPrototype(argument) : argument;
		var extendingStatement = new ExtendingStatement(this.tagName, baseElementPrototype);
		return extendingStatement;
	};
};

var ExtendingStatement = function (tagName, baseElementPrototype) {
	this.tagName = tagName;
	this.baseElementPrototype = baseElementPrototype;

	this.from = function (elementPrototype) {
		var proto = safeExtend(this.baseElementPrototype, elementPrototype);
		return registerElement(this.tagName, proto);
	};
};

module.exports = function (tagName) {
	var createTagStatement = new CreateTagStatement(tagName);
	return createTagStatement;
};

},{"./registerElement.js":26,"./safeExtend.js":27,"./tag-prototypes.js":28}],22:[function(require,module,exports){
module.exports = {
	inputText: require("./../input/input-text.js"),
	inputCheckbox: require("./../input/input-checkbox.js"),
	inputTextarea: require("./../input/input-textarea.js"),
	inputRadio: require("./../input/input-radio.js"),
	inputRadioGroup: require("./../input/input-radio-group.js"),
	inputSelect: require("./../input/input-select.js"),
	partialAjax: require("./../misc/partial-ajax.js"),
	formAjax: require("./../form/form-ajax.js"),
	confirmationModal: require("./../misc/confirmation-modal.js"),
	collectionSearchForm: require("./../collection/collection-search-form.js"),
	collectionElements: require("./../collection/collection-elements.js"),
	collectionContainer: require("./../collection/collection-container.js"),
	feedbackToken: require("./../collection/feedback-token.js"),
	numberOfResults: require("./../collection/number-of-results.js")
};
},{"./../collection/collection-container.js":4,"./../collection/collection-elements.js":5,"./../collection/collection-search-form.js":6,"./../collection/feedback-token.js":7,"./../collection/number-of-results.js":8,"./../form/form-ajax.js":9,"./../input/input-checkbox.js":10,"./../input/input-radio-group.js":11,"./../input/input-radio.js":12,"./../input/input-select.js":13,"./../input/input-text.js":14,"./../input/input-textarea.js":15,"./../misc/confirmation-modal.js":16,"./../misc/partial-ajax.js":17}],23:[function(require,module,exports){
module.exports = {
	raise: function (element, eventName, obj) {
		if (!eventName) {
			throw new Error("Not valid event name");
		}
		var event = new CustomEvent(eventName);
		event.content = obj;
		element.dispatchEvent(event);
	},
	attachListener: function (element, eventName, callback) {
		element.addEventListener(eventName, callback, false);
	}
};
},{}],24:[function(require,module,exports){
// Copy all of the properties in the source objects
// over to the destination object, 
// and return the destination object. 
// It's in-order, so the last source will override 
// properties of the same name in previous arguments.
module.exports = function (destination, source) {
    for (var prop in source) {
        var descriptor = Object.getOwnPropertyDescriptor(source, prop);
        Object.defineProperty(destination, prop, descriptor);
    }
    return destination;
};
},{}],25:[function(require,module,exports){
module.exports = {
	disable: false,
	log: function (text) {
		if (!this.disable) {
			console.log(text);
		}
	},
	warn: function (text) {
		if (!this.disable) {
			console.warn(text);
		}
	}
};
},{}],26:[function(require,module,exports){
var extend = require("./extend.js");
var tagPrototypes = require("./tag-prototypes.js");

module.exports = function (tagName, element) {
    var elementPrototype = Object.create(HTMLElement.prototype);

    var proto = extend(elementPrototype, element);

    tagPrototypes.addPrototype(tagName, elementPrototype);
    var htmlElement = document.registerElement(tagName, {
        prototype: elementPrototype
    });

    return htmlElement;
};
},{"./extend.js":24,"./tag-prototypes.js":28}],27:[function(require,module,exports){
// Copy all of the properties in the source objects
// over to the destination object, 
// and return the destination object. 
// It's in-order, so the last source will override 
// properties of the same name in previous arguments.
module.exports = function (destination, source) {
	var clonedDestination = {};

    for (var prop1 in destination) {
        var descriptor1 = Object.getOwnPropertyDescriptor(destination, prop1);
        if(descriptor1) Object.defineProperty(clonedDestination, prop1, descriptor1);
    }

    for (var prop2 in source) {
		var descriptor2 = Object.getOwnPropertyDescriptor(source, prop2);
		Object.defineProperty(clonedDestination, prop2, descriptor2);
    }

    clonedDestination.super = destination;
    return clonedDestination;
};

var cloneObject = function (source) {
    var key,value;
    var clone = Object.create(source);

    for (key in source) {
        if (source.hasOwnProperty(key) === true) {
            value = source[key];

            if (value !== null && typeof value === "object") {
                clone[key] = cloneObject(value);
            } else {
                clone[key] = value;
            }
        }
    }
    return clone;
};


},{}],28:[function(require,module,exports){
var tagPrototypes = {};

module.exports = {
	addPrototype: function (tagName, proto) {
		tagPrototypes[tagName] = proto;
	},
	getPrototype: function (tagName) {
		return tagPrototypes[tagName];
	}
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2VzL2ItdGFnLmpzIiwic291cmNlcy9iYXNlL2NvbnRhaW5lci1iYXNlLmpzIiwic291cmNlcy9iYXNlL2Zvcm0tYmFzZS5qcyIsInNvdXJjZXMvY29sbGVjdGlvbi9jb2xsZWN0aW9uLWNvbnRhaW5lci5qcyIsInNvdXJjZXMvY29sbGVjdGlvbi9jb2xsZWN0aW9uLWVsZW1lbnRzLmpzIiwic291cmNlcy9jb2xsZWN0aW9uL2NvbGxlY3Rpb24tc2VhcmNoLWZvcm0uanMiLCJzb3VyY2VzL2NvbGxlY3Rpb24vZmVlZGJhY2stdG9rZW4uanMiLCJzb3VyY2VzL2NvbGxlY3Rpb24vbnVtYmVyLW9mLXJlc3VsdHMuanMiLCJzb3VyY2VzL2Zvcm0vZm9ybS1hamF4LmpzIiwic291cmNlcy9pbnB1dC9pbnB1dC1jaGVja2JveC5qcyIsInNvdXJjZXMvaW5wdXQvaW5wdXQtcmFkaW8tZ3JvdXAuanMiLCJzb3VyY2VzL2lucHV0L2lucHV0LXJhZGlvLmpzIiwic291cmNlcy9pbnB1dC9pbnB1dC1zZWxlY3QuanMiLCJzb3VyY2VzL2lucHV0L2lucHV0LXRleHQuanMiLCJzb3VyY2VzL2lucHV0L2lucHV0LXRleHRhcmVhLmpzIiwic291cmNlcy9taXNjL2NvbmZpcm1hdGlvbi1tb2RhbC5qcyIsInNvdXJjZXMvbWlzYy9wYXJ0aWFsLWFqYXguanMiLCJzb3VyY2VzL3V0aWxzL2Jyb3dzZXJDaGVja2VyLmpzIiwic291cmNlcy91dGlscy9jb25maXJtYXRpb25XcmFwcGVyLmpzIiwic291cmNlcy91dGlscy9jb25zdGFudHMuanMiLCJzb3VyY2VzL3V0aWxzL2NyZWF0ZVRhZy5qcyIsInNvdXJjZXMvdXRpbHMvZWxlbWVudERpY3Rpb25hcnkuanMiLCJzb3VyY2VzL3V0aWxzL2V2ZW50cy5qcyIsInNvdXJjZXMvdXRpbHMvZXh0ZW5kLmpzIiwic291cmNlcy91dGlscy9sb2dnZXIuanMiLCJzb3VyY2VzL3V0aWxzL3JlZ2lzdGVyRWxlbWVudC5qcyIsInNvdXJjZXMvdXRpbHMvc2FmZUV4dGVuZC5qcyIsInNvdXJjZXMvdXRpbHMvdGFnLXByb3RvdHlwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYgKCF3aW5kb3cuXykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5kZXJzY29yZS5qcyBtdXN0IGJlIGxvYWRlZCBhcyBkZXBlbmRlbmN5XCIpO1xyXG59XHJcblxyXG52YXIgcmVnaXN0ZXJFbGVtZW50ID0gcmVxdWlyZShcIi4vdXRpbHMvcmVnaXN0ZXJFbGVtZW50LmpzXCIpO1xyXG52YXIgY3JlYXRlVGFnID0gcmVxdWlyZShcIi4vdXRpbHMvY3JlYXRlVGFnLmpzXCIpO1xyXG52YXIgc2FmZUV4dGVuZCA9IHJlcXVpcmUoXCIuL3V0aWxzL3NhZmVFeHRlbmQuanNcIik7XHJcbnZhciBlbGVtZW50RGljdGlvbmFyeSA9IHJlcXVpcmUoXCIuL3V0aWxzL2VsZW1lbnREaWN0aW9uYXJ5LmpzXCIpO1xyXG52YXIgYnJvd3NlckNoZWNrZXIgPSByZXF1aXJlKFwiLi91dGlscy9icm93c2VyQ2hlY2tlci5qc1wiKTtcclxudmFyIGxvZ2dlciA9IHJlcXVpcmUoXCIuL3V0aWxzL2xvZ2dlci5qc1wiKTtcclxudmFyIGV2ZW50cyA9IHJlcXVpcmUoXCIuL3V0aWxzL2V2ZW50cy5qc1wiKTtcclxudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL3V0aWxzL2NvbnN0YW50cy5qc1wiKTtcclxudmFyIGNvbmZpcm1hdGlvbldyYXBwZXIgPSByZXF1aXJlKFwiLi91dGlscy9jb25maXJtYXRpb25XcmFwcGVyLmpzXCIpO1xyXG5cclxud2luZG93LmIgPSB7XHJcbiAgICB0YWc6IHtcclxuICAgICAgICByZWdpc3RlckVsZW1lbnQ6IHJlZ2lzdGVyRWxlbWVudCxcclxuICAgICAgICBjcmVhdGVUYWc6IGNyZWF0ZVRhZyxcclxuICAgICAgICBzYWZlRXh0ZW5kOiBzYWZlRXh0ZW5kLFxyXG4gICAgICAgIGxvZ2dlcjogbG9nZ2VyLFxyXG4gICAgICAgIGV2ZW50czogZXZlbnRzLFxyXG4gICAgICAgIGNvbmZpcm1hdGlvbldyYXBwZXI6IGNvbmZpcm1hdGlvbldyYXBwZXIsXHJcbiAgICAgICAgZWxlbWVudHM6IHtcclxuICAgICAgICAgICAgLy8gSW5wdXRcclxuICAgICAgICAgICAgSW5wdXRUZXh0OiBjcmVhdGVUYWcoXCJpbnB1dC10ZXh0XCIpLmZyb20oZWxlbWVudERpY3Rpb25hcnkuaW5wdXRUZXh0KSxcclxuICAgICAgICAgICAgSW5wdXRUZXh0YXJlYTogY3JlYXRlVGFnKFwiaW5wdXQtdGV4dGFyZWFcIikuZnJvbShlbGVtZW50RGljdGlvbmFyeS5pbnB1dFRleHRhcmVhKSxcclxuICAgICAgICAgICAgSW5wdXRDaGVja2JveDogY3JlYXRlVGFnKFwiaW5wdXQtY2hlY2tib3hcIikuZnJvbShlbGVtZW50RGljdGlvbmFyeS5pbnB1dENoZWNrYm94KSxcclxuICAgICAgICAgICAgSW5wdXRSYWRpbzogY3JlYXRlVGFnKFwiaW5wdXQtcmFkaW9cIikuZnJvbShlbGVtZW50RGljdGlvbmFyeS5pbnB1dFJhZGlvKSxcclxuICAgICAgICAgICAgSW5wdXRSYWRpb0dyb3VwOiBjcmVhdGVUYWcoXCJpbnB1dC1yYWRpby1ncm91cFwiKS5mcm9tKGVsZW1lbnREaWN0aW9uYXJ5LmlucHV0UmFkaW9Hcm91cCksXHJcbiAgICAgICAgICAgIElucHV0U2VsZWN0OiBjcmVhdGVUYWcoXCJpbnB1dC1zZWxlY3RcIikuZnJvbShlbGVtZW50RGljdGlvbmFyeS5pbnB1dFNlbGVjdCksXHJcblxyXG4gICAgICAgICAgICAvLyBNaXNjXHJcbiAgICAgICAgICAgIFBhcnRpYWxBamF4OiBjcmVhdGVUYWcoXCJwYXJ0aWFsLWFqYXhcIikuZnJvbShlbGVtZW50RGljdGlvbmFyeS5wYXJ0aWFsQWpheCksXHJcbiAgICAgICAgICAgIENvbmZpcm1hdGlvbk1vZGFsOiBjcmVhdGVUYWcoXCJjb25maXJtYXRpb24tbW9kYWxcIikuZnJvbShlbGVtZW50RGljdGlvbmFyeS5jb25maXJtYXRpb25Nb2RhbCksXHJcblxyXG4gICAgICAgICAgICAvLyBGb3JtXHJcbiAgICAgICAgICAgIEZvcm1BamF4OiBjcmVhdGVUYWcoXCJmb3JtLWFqYXhcIikuZnJvbShlbGVtZW50RGljdGlvbmFyeS5mb3JtQWpheCksXHJcblxyXG4gICAgICAgICAgICAvLyBDb2xsZWN0aW9uXHJcbiAgICAgICAgICAgIENvbGxlY3Rpb25TZWFyY2hGb3JtOiBjcmVhdGVUYWcoXCJjb2xsZWN0aW9uLXNlYXJjaC1mb3JtXCIpLmZyb20oZWxlbWVudERpY3Rpb25hcnkuY29sbGVjdGlvblNlYXJjaEZvcm0pLFxyXG4gICAgICAgICAgICBDb2xsZWN0aW9uRWxlbWVudHM6IGNyZWF0ZVRhZyhcImNvbGxlY3Rpb24tZWxlbWVudHNcIikuZnJvbShlbGVtZW50RGljdGlvbmFyeS5jb2xsZWN0aW9uRWxlbWVudHMpLFxyXG4gICAgICAgICAgICBDb2xsZWN0aW9uQ29udGFpbmVyOiBjcmVhdGVUYWcoXCJjb2xsZWN0aW9uLWNvbnRhaW5lclwiKS5mcm9tKGVsZW1lbnREaWN0aW9uYXJ5LmNvbGxlY3Rpb25Db250YWluZXIpLFxyXG4gICAgICAgICAgICBGZWVkYmFja1Rva2VuOiBjcmVhdGVUYWcoXCJmZWVkYmFjay10b2tlblwiKS5mcm9tKGVsZW1lbnREaWN0aW9uYXJ5LmZlZWRiYWNrVG9rZW4pLFxyXG4gICAgICAgICAgICBOdW1iZXJPZlJlc3VsdHM6IGNyZWF0ZVRhZyhcIm51bWJlci1vZi1yZXN1bHRzXCIpLmZyb20oZWxlbWVudERpY3Rpb25hcnkubnVtYmVyT2ZSZXN1bHRzKSxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5pZiAoIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiICkge1xyXG4gICAgLy8gRm9yIENvbW1vbkpTIGFuZCBDb21tb25KUy1saWtlIGVudmlyb25tZW50c1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuYnRhZztcclxufVxyXG5cclxudmFyIGNsb2Fja2VkRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW1wiICsgY29uc3RhbnRzLmNsb2FraW5nQ2xhc3MgKyBcIl1cIik7XHJcblxyXG5fKGNsb2Fja2VkRWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGNvbnN0YW50cy5jbG9ha2luZ0NsYXNzKTtcclxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0YXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uIChjaGlsZCkge1xyXG5cdFx0dmFyIGNvbnRlbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJjb250ZW50XCIpO1xyXG5cdFx0aWYgKCFjb250ZW50KSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihcIkEgY29udGFpbmVyIGVsZW1lbnQgbXVzdCBjb250YWluIGFuIGlubnIgPGNvbnRlbnQ+IHRhZy5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG5cdH0sXHJcblx0cmVuZGVyV2l0aGluSW5uZXJDb250ZW50OiBmdW5jdGlvbiAoaHRtbCwgc2VsZWN0b3IpIHtcclxuXHRcdHZhciBpbm5lckNvbnRlbnQ7XHJcblx0XHR2YXIgaW5uZXJDb250ZW50Q29udGFpbmVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFxyXG5cdFx0aWYgKGlubmVyQ29udGVudENvbnRhaW5lcikge1xyXG5cdFx0XHRpbm5lckNvbnRlbnQgPSBpbm5lckNvbnRlbnRDb250YWluZXIuaW5uZXJIVE1MO1xyXG5cdFx0XHR0aGlzLmlubmVySFRNTCA9IGh0bWw7XHJcblx0XHRcdHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MID0gaW5uZXJDb250ZW50O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aW5uZXJDb250ZW50ID0gdGhpcy5pbm5lckhUTUw7XHJcblx0XHRcdHRoaXMuaW5uZXJIVE1MID0gaHRtbDtcclxuXHRcdFx0dGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5pbm5lckhUTUwgPSBpbm5lckNvbnRlbnQ7XHJcblx0XHR9XHJcblx0fVx0XHJcbn07IiwiXHJcbnZhciBodG1sID0gXCI8Zm9ybT5cXHJcXG5cXHQ8Y29udGVudCBjbGFzcz1cXFwiZm9ybS1hamF4LWNvbnRlbnRcXFwiPjwvY29udGVudD5cXHJcXG48L2Zvcm0+XCI7XHJcbnZhciBjb250YWluZXJCYXNlID0gcmVxdWlyZShcIi4vLi4vYmFzZS9jb250YWluZXItYmFzZS5qc1wiKTtcclxudmFyIHNhZmVFeHRlbmQgPSByZXF1aXJlKFwiLi8uLi91dGlscy9zYWZlRXh0ZW5kLmpzXCIpO1xyXG52YXIgaW5wdXRTZWxlY3RvcnMgPSBcImlucHV0LXRleHQsaW5wdXQtcmFkaW8tZ3JvdXAsaW5wdXQtY2hlY2tib3gsaW5wdXQtdGV4dGFyZWEsaW5wdXQtc2VsZWN0LFtjdXN0b20taW5wdXRdXCI7XHJcbnZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9sb2dnZXIuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhZmVFeHRlbmQoY29udGFpbmVyQmFzZSwge1xyXG5cdGNyZWF0ZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdCAgICB0aGlzLnJlbmRlcigpO1xyXG5cdH0sXHJcblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0fSxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMucmVuZGVyV2l0aGluSW5uZXJDb250ZW50KGh0bWwsIFwiLmZvcm0tYWpheC1jb250ZW50XCIpO1xyXG5cdH0sXHJcblx0dmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBpbnB1dHMgPSB0aGlzLmdldElubmVySW5wdXRzKCk7XHJcblx0XHR2YXIgaXNGb3JtVmFsaWQgPSB0cnVlO1xyXG5cdFx0XyhpbnB1dHMpLmZvckVhY2goZnVuY3Rpb24gKGlucHV0KSB7XHJcblx0XHRcdGlmIChfKGlucHV0LnZhbGlkYXRlKS5pc0Z1bmN0aW9uKCkpIHtcclxuXHRcdFx0XHR2YXIgdmFsaWRhdGlvblJlc3VsdCA9IGlucHV0LnZhbGlkYXRlKCk7XHJcblx0XHRcdFx0aXNGb3JtVmFsaWQgPSBpc0Zvcm1WYWxpZCAmJiB2YWxpZGF0aW9uUmVzdWx0O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhciBtZXNzYWdlID0gXHJcblx0XHRcdFx0XHRcIjxcIiArIFxyXG5cdFx0XHRcdFx0aW5wdXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSArXHJcblx0XHRcdFx0XHRcIj4gaGFzIG5vdCB2YWxpZGF0ZSgpIG1ldGhvZC5cIjtcclxuXHRcdFx0XHRsb2dnZXIud2FybihtZXNzYWdlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gaXNGb3JtVmFsaWQ7XHJcblx0fSxcclxuXHRnZXREYXRhOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgaW5wdXRzID0gdGhpcy5nZXRJbm5lcklucHV0cygpO1xyXG5cdFx0dmFyIGRhdGEgPSB7fTtcclxuXHRcdF8oaW5wdXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCkge1xyXG5cdFx0XHRpZiAoaW5wdXQuZmllbGQpIHtcclxuXHRcdFx0XHRkYXRhW2lucHV0LmZpZWxkXSA9IGlucHV0LnZhbHVlO1x0XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIG1lc3NhZ2UgPSBcclxuXHRcdFx0XHRcdFwiPFwiICsgXHJcblx0XHRcdFx0XHR0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgK1xyXG5cdFx0XHRcdFx0XCI+IGhhcyBmb3VuZCBhIHRhZyBvZiB0eXBlIDxcIiArIFxyXG5cdFx0XHRcdFx0aW5wdXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSArIFxyXG5cdFx0XHRcdFx0XCI+IHdpdGhvdXQgJ2ZpZWxkJyBhdHRyaWJ1dGUuIEl0IHdpbGwgYmUgaWdub3JlZCBieSA8Zm9ybS1hamF4Lz4uXCI7XHJcblx0XHRcdFx0bG9nZ2VyLndhcm4obWVzc2FnZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHRzZXREYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0dmFyIGlucHV0cyA9IHRoaXMuZ2V0SW5uZXJJbnB1dHMoKTtcclxuXHRcdF8oaW5wdXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCkge1xyXG5cdFx0XHRpZiAoZGF0YVtpbnB1dC5maWVsZF0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGlucHV0LnZhbHVlID0gZGF0YVtpbnB1dC5maWVsZF07XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHRjbGVhckRhdGE6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBpbnB1dHMgPSB0aGlzLmdldElubmVySW5wdXRzKCk7XHJcblx0XHRfKGlucHV0cykuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpIHtcclxuXHRcdFx0aW5wdXQudmFsdWUgPSBcIlwiO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRJbm5lcklucHV0czogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGlucHV0cyA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChpbnB1dFNlbGVjdG9ycyk7XHJcblx0XHRyZXR1cm4gaW5wdXRzO1xyXG5cdH0sXHJcblx0Y2xlYXJFcnJvcnNBbmRXYXJuaW5nczogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGlucHV0cyA9IHRoaXMuZ2V0SW5uZXJJbnB1dHMoKTtcclxuXHRcdF8oaW5wdXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCkge1xyXG5cdFx0XHRpbnB1dC5lcnJvciA9IFwiXCI7XHJcblx0XHRcdGlucHV0Lndhcm5pbmcgPSBcIlwiO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzZXRFcnJvcnM6IGZ1bmN0aW9uIChlcnJvcnMpIHtcclxuXHRcdF8oZXJyb3JzKS5mb3JFYWNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHR2YXIgaW5wdXQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJbZmllbGQ9XCIgKyBlcnJvci5maWVsZCArIFwiXVwiKTtcclxuXHRcdFx0aWYoaW5wdXQpIGlucHV0LmVycm9yID0gZXJyb3IubWVzc2FnZTtcclxuXHRcdH0sIHRoaXMpO1x0XHRcclxuXHR9LFxyXG5cdHNldFdhcm5pbmdzOiBmdW5jdGlvbiAod2FybmluZ3MpIHtcclxuXHRcdF8od2FybmluZ3MpLmZvckVhY2goZnVuY3Rpb24gKHdhcm5pbmcpIHtcclxuXHRcdFx0dmFyIGlucHV0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiW2ZpZWxkPVwiICsgd2FybmluZy5maWVsZCArIFwiXVwiKTtcclxuXHRcdFx0aWYoaW5wdXQpIGlucHV0Lndhcm5pbmcgPSB3YXJuaW5nLm1lc3NhZ2U7XHJcblx0XHR9LCB0aGlzKTtcdFx0XHJcblx0fVxyXG59KTtcclxuIiwidmFyIGNvbnRhaW5lckJhc2UgPSByZXF1aXJlKFwiLi8uLi9iYXNlL2NvbnRhaW5lci1iYXNlLmpzXCIpO1xyXG52YXIgc2FmZUV4dGVuZCA9IHJlcXVpcmUoXCIuLy4uL3V0aWxzL3NhZmVFeHRlbmQuanNcIik7XHJcbnZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9sb2dnZXIuanNcIik7XHJcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi8uLi91dGlscy9jb25zdGFudHMuanNcIik7XHJcbnZhciBldmVudHMgPSByZXF1aXJlKFwiLi8uLi91dGlscy9ldmVudHMuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhZmVFeHRlbmQoY29udGFpbmVyQmFzZSwge1xyXG5cdGdldCBwYWdlKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwYWdlXCIpO1xyXG5cdH0sXHJcblx0c2V0IHBhZ2UodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwicGFnZVwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IGVsZW1lbnRzUGVyUGFnZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwiZWxlbWVudHMtcGVyLXBhZ2VcIik7XHJcblx0fSxcclxuXHRzZXQgZWxlbWVudHNQZXJQYWdlKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImVsZW1lbnRzLXBlci1wYWdlXCIsIHZhbCk7XHJcblx0fSxcdFxyXG5cdGdldCBnZXRVcmwoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImdldC11cmxcIik7XHJcblx0fSxcclxuXHRzZXQgZ2V0VXJsKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImdldC11cmxcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCBhamF4U2VydmljZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwiYWpheFNlcnZpY2VcIik7XHJcblx0fSxcclxuXHRzZXQgYWpheFNlcnZpY2UodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYWpheFNlcnZpY2VcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCBzaG93TW9yZVN0cmF0ZWd5KCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoXCJzaG93LW1vcmUtc3RyYXRlZ3lcIik7XHJcblx0fSxcclxuXHRzZXQgc2hvd01vcmVTdHJhdGVneSh2YWwpIHtcclxuXHRcdGlmICh2YWwpIHtcclxuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoXCJzaG93LW1vcmUtc3RyYXRlZ3lcIiwgdmFsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKFwic2hvdy1tb3JlLXN0cmF0ZWd5XCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0IGluZmluaXRlU2Nyb2xsaW5nU3RyYXRlZ3koKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShcImluZmluaXRlLXNjcm9sbGluZy1zdHJhdGVneVwiKTtcclxuXHR9LFxyXG5cdHNldCBpbmZpbml0ZVNjcm9sbGluZ1N0cmF0ZWd5KHZhbCkge1xyXG5cdFx0aWYgKHZhbCkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShcImluZmluaXRlLXNjcm9sbGluZy1zdHJhdGVneVwiLCB2YWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJpbmZpbml0ZS1zY3JvbGxpbmctc3RyYXRlZ3lcIik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXQgYXV0b21hdGljRmlyc3RGZXRjaCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwiYXV0b21hdGljLWZpcnN0LWZldGNoXCIpO1xyXG5cdH0sXHJcblx0c2V0IGF1dG9tYXRpY0ZpcnN0RmV0Y2godmFsKSB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZShcImF1dG9tYXRpYy1maXJzdC1mZXRjaFwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IGF1dG9tYXRpY1JlZnJlc2goKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImF1dG9tYXRpYy1yZWZyZXNoXCIpO1xyXG5cdH0sXHJcblx0c2V0IGF1dG9tYXRpY1JlZnJlc2godmFsKSB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZShcImF1dG9tYXRpYy1yZWZyZXNoXCIsIHZhbCk7XHJcblx0fSxcdFxyXG5cdGNyZWF0ZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdCAgICB0aGlzLnJlbmRlcigpO1xyXG5cdH0sXHJcblx0YXR0YWNoZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChzZWxmLmF1dG9tYXRpY0ZpcnN0RmV0Y2gpIHtcclxuXHRcdFx0c2VsZi5maXJzdEZldGNoVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNlbGYuZmV0Y2hEYXRhKCk7XHJcblx0XHRcdH0sIHNlbGYuYXV0b21hdGljRmlyc3RGZXRjaCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHNlbGYuYXV0b21hdGljUmVmcmVzaCkge1xyXG5cdFx0XHRzZWxmLnJlZnJlc2hJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzZWxmLmNsZWFyRGF0YSgpO1xyXG5cdFx0XHRcdHNlbGYucGFnZSA9IDE7XHJcblx0XHRcdFx0c2VsZi5mZXRjaERhdGEoKTtcclxuXHRcdFx0fSwgc2VsZi5hdXRvbWF0aWNSZWZyZXNoKTtcclxuXHRcdH1cdFx0XHJcblx0fSxcclxuXHRkZXRhY2hlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRjbGVhclRpbWVvdXQodGhpcy5maXJzdEZldGNoVGltZW91dCk7XHJcblx0XHRjbGVhckludGVydmFsVGltZW91dCh0aGlzLnJlZnJlc2hJbnRlcnZhbCk7XHJcblx0fSxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHZhciBodG1sID0gXCI8Y29udGVudCBjbGFzcz0nY29sbGVjdGlvbi1jb250YWluZXItY29udGVudCc+PC9jb250ZW50PlwiO1xyXG5cdFx0c2VsZi5yZW5kZXJXaXRoaW5Jbm5lckNvbnRlbnQoaHRtbCwgXCIuY29sbGVjdGlvbi1jb250YWluZXItY29udGVudFwiKTtcclxuXHRcdHNlbGYuY29udGVudCA9IHsgXHJcblx0XHRcdHNlYXJjaEZvcm06IHNlbGYucXVlcnlTZWxlY3RvcihcImNvbGxlY3Rpb24tc2VhcmNoLWZvcm1cIiksXHJcblx0XHRcdGVsZW1lbnRzOiBzZWxmLnF1ZXJ5U2VsZWN0b3IoXCJjb2xsZWN0aW9uLWVsZW1lbnRzXCIpLFxyXG5cdFx0XHRzaG93TW9yZUJ1dHRvbjogc2VsZi5xdWVyeVNlbGVjdG9yKFwiW3Nob3ctbW9yZS1idXR0b25dXCIpXHJcblx0XHR9O1xyXG5cdFx0c2VsZi5wYWdlID0gMTtcclxuXHRcdGlmICghc2VsZi5jb250ZW50LmVsZW1lbnRzKSB7XHJcblx0XHRcdGxvZ2dlci53YXJuKFwiTm8gPGNvbGxlY3Rpb24tZWxlbWVudHM+IHRhZyBkZWZpbmVkIGluc2lkZSA8Y29sbGVjdGlvbi1jb250YWluZXI+XCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuYWRkTGlzdGVuZXJUb0Zvcm0oKTtcclxuXHJcblx0XHRpZiAoc2VsZi5zaG93TW9yZVN0cmF0ZWd5KSB7XHJcblx0XHRcdHNlbGYuYWN0aXZhdGVTaG93TW9yZUJ1dHRvbigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChzZWxmLmluZmluaXRlU2Nyb2xsaW5nU3RyYXRlZ3kpIHtcclxuXHRcdFx0c2VsZi5hY3RpdmF0ZUluZmluaXRlU2Nyb2xsaW5nKCk7XHJcblx0XHR9XHRcdFxyXG5cdH0sXHJcblx0YWRkTGlzdGVuZXJUb0Zvcm06IGZ1bmN0aW9uICgpXHJcblx0e1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0aWYgKHNlbGYuY29udGVudC5zZWFyY2hGb3JtKSB7XHJcblx0XHRcdHNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ICAgIFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ICAgIFx0c2VsZi5jbGVhckRhdGEoKTtcclxuXHRcdCAgICBcdHNlbGYucGFnZSA9IDE7XHJcblx0XHQgICAgXHRzZWxmLmZldGNoRGF0YSgpO1xyXG5cdFx0ICAgIH0pO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdGFjdGl2YXRlU2hvd01vcmVCdXR0b246IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdGlmIChzZWxmLmNvbnRlbnQuc2hvd01vcmVCdXR0b24pIHtcclxuXHRcdFx0c2VsZi5jb250ZW50LnNob3dNb3JlQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdHNlbGYucGFnZSsrO1xyXG5cdFx0XHRcdHNlbGYuZmV0Y2hEYXRhKCk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0fSxcclxuICAgIGFjdGl2YXRlSW5maW5pdGVTY3JvbGxpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNjcm9sbENhbGxiYWNrID0gIGZ1bmN0aW9uICgpIHsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb25PZmZzZXQgPSB3aW5kb3cub3V0ZXJIZWlnaHQgKyAod2luZG93LnNjcm9sbFkgfHwgcGFnZVlPZmZzZXQpIC0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocG9zaXRpb25PZmZzZXQpO1xyXG4gICAgICAgICAgICBpZiAocG9zaXRpb25PZmZzZXQgPj0gMCkge1xyXG5cdFx0XHRcdHNlbGYucGFnZSsrO1xyXG5cdFx0XHRcdHNlbGYuZmV0Y2hEYXRhKCk7XHJcblx0XHRcdH0gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHRocm90dGxlZEZ1bmN0aW9uID0gXy50aHJvdHRsZShzY3JvbGxDYWxsYmFjaywgMzAwKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aHJvdHRsZWRGdW5jdGlvbiwgZmFsc2UpO1xyXG4gICAgfSxcdFxyXG5cdGNsZWFyRGF0YTogZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoIXRoaXMuY29udGVudC5lbGVtZW50cykge1xyXG5cdFx0XHRsb2dnZXIud2FybihcIk5vIDxjb2xsZWN0aW9uLWVsZW1lbnRzPiB0YWcgZGVmaW5lZCBpbnNpZGUgPGNvbGxlY3Rpb24tY29udGFpbmVyPlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jb250ZW50LmVsZW1lbnRzLmNsZWFyRGF0YSgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YXBwZW5kRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0aWYgKCF0aGlzLmNvbnRlbnQuZWxlbWVudHMpIHtcclxuXHRcdFx0bG9nZ2VyLndhcm4oXCJObyA8Y29sbGVjdGlvbi1lbGVtZW50cz4gdGFnIGRlZmluZWQgaW5zaWRlIDxjb2xsZWN0aW9uLWNvbnRhaW5lcj5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY29udGVudC5lbGVtZW50cy5hcHBlbmREYXRhKGRhdGEpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c2hvd0xvYWRlcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMubnVtYmVyT2ZMYXN0RmV0Y2hSZXN1bHRzICE9PSAwKSB7XHJcblx0XHRcdHRoaXMuY29udGVudC5lbGVtZW50cy5zaG93TG9hZGVyKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRlTG9hZGVyOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLmNvbnRlbnQuZWxlbWVudHMuaGlkZUxvYWRlcigpO1xyXG5cdH0sXHRcclxuXHRoYW5kbGVEYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0dGhpcy5hcHBlbmREYXRhKGRhdGEpO1xyXG5cdH0sXHJcblx0dXBkYXRlRmVlZGJhY2tUb2tlbnM6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHR2YXIgZmVlZGJhY2tUb2tlbnMgPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmZWVkYmFjay10b2tlbixbZmVlZGJhY2stdG9rZW5dXCIpO1xyXG5cdFx0XyhmZWVkYmFja1Rva2VucykuZm9yRWFjaChmdW5jdGlvbiAoZmVlZGJhY2tUb2tlbikge1xyXG5cdFx0XHRmZWVkYmFja1Rva2VuLnJlbmRlckZyb20oZGF0YSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHVwZGF0ZU51bWJlck9mUmVzdWx0czogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdHZhciBudW1iZXJPZlJlc3VsdHMgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJudW1iZXItb2YtcmVzdWx0c1wiKTtcclxuXHRcdGlmIChudW1iZXJPZlJlc3VsdHMpIHtcclxuXHRcdFx0bnVtYmVyT2ZSZXN1bHRzLnZhbHVlID0gdGhpcy5jb250ZW50LmVsZW1lbnRzLmRhdGFTb3VyY2UubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdH0sXHRcclxuXHR2YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuY29udGVudC5zZWFyY2hGb3JtKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuc2VhcmNoRm9ybS52YWxpZGF0ZSgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0U2VhcmNoRGF0YTogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMuY29udGVudC5zZWFyY2hGb3JtKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNvbnRlbnQuc2VhcmNoRm9ybS5nZXREYXRhKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZmV0Y2hEYXRhOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgJCA9IHdpbmRvd1t0aGlzLmFqYXhTZXJ2aWNlXTtcclxuXHRcdGlmICghJCB8fCAhXygkLmFqYXgpLmlzRnVuY3Rpb24oKSkge1xyXG5cdFx0XHR2YXIgYWpheFNlcnZpY2VNZXNzYWdlID0gXHJcblx0XHRcdFx0XCJDYW5ub3QgZmluZCBhIHZhbGlkIGFqYXggc2VydmljZSAnXCIgK1xyXG5cdFx0XHRcdHRoaXMuYWpheFNlcnZpY2UgKyBcclxuXHRcdFx0XHRcIicgb24gbWFpbiB3aW5kb3cgZm9yIDxjb2xsZWN0aW9uLWNvbnRhaW5lci8+IHRhZy5cIjtcclxuXHRcdFx0bG9nZ2VyLndhcm4oYWpheFNlcnZpY2VNZXNzYWdlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5nZXRVcmwpIHtcclxuXHRcdFx0dmFyIHVybE1lc3NhZ2UgPSBcIlVuZGVmaW5lZCBnZXRVcmwgZm9yIDxjb2xsZWN0aW9uLWNvbnRhaW5lci8+IHRhZy5cIjtcclxuXHRcdFx0bG9nZ2VyLndhcm4odXJsTWVzc2FnZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgc2VhcmNoRGF0YSA9IHt9O1xyXG5cclxuXHRcdGlmICh0aGlzLmNvbnRlbnQuc2VhcmNoRm9ybSkge1xyXG5cdFx0XHRldmVudHMucmFpc2UodGhpcywgY29uc3RhbnRzLmJlZm9yZVZhbGlkYXRlLCB7fSk7XHJcblx0XHRcdHZhciB2YWxpZGF0aW9uUmVzdWx0ID0gdGhpcy52YWxpZGF0ZSgpO1xyXG5cclxuXHRcdFx0aWYgKCF2YWxpZGF0aW9uUmVzdWx0KSB7XHJcblx0XHRcdFx0ZXZlbnRzLnJhaXNlKHRoaXMsIGNvbnN0YW50cy5vbkNsaWVudFZhbGlkYXRpb25GYWlsdXJlLCB7fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWFyY2hEYXRhID0gdGhpcy5nZXRTZWFyY2hEYXRhKCk7XHJcblx0XHRcdGV2ZW50cy5yYWlzZSh0aGlzLCBjb25zdGFudHMuYmVmb3JlU3VibWl0LCBzZWFyY2hEYXRhKTtcclxuXHJcblx0XHRcdHZhciBmb3JtSGFzU2FtZVZhbHVlcyA9IF8ubWF0Y2hlcih0aGlzLmxhc3RTZWFyY2hEYXRhKTtcclxuXHRcdFx0aWYgKCFmb3JtSGFzU2FtZVZhbHVlcyhzZWFyY2hEYXRhKSkge1xyXG5cdFx0XHRcdHRoaXMucGFnZSA9IDE7XHJcblx0XHRcdFx0dGhpcy5udW1iZXJPZkxhc3RGZXRjaFJlc3VsdHMgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0dGhpcy5jbGVhckRhdGEoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmxhc3RTZWFyY2hEYXRhID0gXyhzZWFyY2hEYXRhKS5jbG9uZSgpO1xyXG5cdFx0fVxyXG5cdFx0c2VhcmNoRGF0YS5wYWdlID0gdGhpcy5wYWdlO1xyXG5cdFx0c2VhcmNoRGF0YS5lbGVtZW50c1BlclBhZ2UgPSB0aGlzLmVsZW1lbnRzUGVyUGFnZTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0c2VsZi5zaG93TG9hZGVyKCk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogc2VsZi5nZXRVcmwsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgZGF0YTogc2VhcmNoRGF0YSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBcdHNlbGYuaGlkZUxvYWRlcigpO1xyXG5cdFx0XHRcdHZhciBjb2xsZWN0aW9uRGF0YSA9IHJlc3VsdC5kYXRhO1xyXG5cdFx0XHRcdGlmIChjb2xsZWN0aW9uRGF0YSkge1xyXG5cdFx0XHRcdFx0c2VsZi5udW1iZXJPZkxhc3RGZXRjaFJlc3VsdHMgPSBjb2xsZWN0aW9uRGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHRzZWxmLmhhbmRsZURhdGEoY29sbGVjdGlvbkRhdGEpO1xyXG5cdFx0XHRcdFx0c2VsZi51cGRhdGVGZWVkYmFja1Rva2VucyhyZXN1bHQpO1xyXG5cdFx0XHRcdFx0c2VsZi51cGRhdGVOdW1iZXJPZlJlc3VsdHMoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bG9nZ2VyLndhcm4oXCJObyBjb2xsZWN0aW9uIGRhdGEgZGVmaW5lZC4gVGhlIHJlc3VsdCBzaG91bGQgaGF2ZSBhIHN0cnVjdHVyZSBvZiB0eXBlIHsgZGF0OiBbXSB9LlwiKTtcclxuXHRcdFx0XHR9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0c2VsZi5oaWRlTG9hZGVyKCk7XHJcblx0XHRcdFx0ZXZlbnRzLnJhaXNlKHNlbGYsIGNvbnN0YW50cy5vblN1Ym1pdFJlc3BvbnNlLCByZXN1bHQpO1xyXG5cdFx0XHRcdC8vZXZlbnRzLnJhaXNlKHRoaXMsIGNvbnN0YW50cy5vblN1Ym1pdEVycm9yLCB7fSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHR9XHJcbn0pO1xyXG4iLCJ2YXIgY29udGFpbmVyQmFzZSA9IHJlcXVpcmUoXCIuLy4uL2Jhc2UvY29udGFpbmVyLWJhc2UuanNcIik7XHJcbnZhciBzYWZlRXh0ZW5kID0gcmVxdWlyZShcIi4vLi4vdXRpbHMvc2FmZUV4dGVuZC5qc1wiKTtcclxudmFyIGxvZ2dlciA9IHJlcXVpcmUoXCIuLy4uL3V0aWxzL2xvZ2dlci5qc1wiKTtcclxudmFyIGNvbnRhaW5lckJhc2UgPSByZXF1aXJlKFwiLi8uLi9iYXNlL2NvbnRhaW5lci1iYXNlLmpzXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYWZlRXh0ZW5kKGNvbnRhaW5lckJhc2UsIHtcclxuXHRnZXQgZGF0YVNvdXJjZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuX2RhdGFTb3VyY2U7XHJcblx0fSxcclxuXHRnZXQgdGVtcGxhdGUoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcInRlbXBsYXRlXCIpO1xyXG5cdH0sXHJcblx0c2V0IHRlbXBsYXRlKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcInRlbXBsYXRlXCIsIHZhbCk7XHJcblx0fSxcdFxyXG5cdGdldCBsb2FkZXIoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImxvYWRlclwiKTtcclxuXHR9LFxyXG5cdHNldCBsb2FkZXIodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibG9hZGVyXCIsIHZhbCk7XHJcblx0fSxcdFx0XHJcblx0Y3JlYXRlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgaHRtbCA9IFwiPGNvbnRlbnQgY2xhc3M9J2NvbGxlY3Rpb24tZWxlbWVudHMtY29udGVudCc+PC9jb250ZW50Pjxjb250ZW50IHN0eWxlPSdkaXNwbGF5OiBub25lJyBjbGFzcz0nY29sbGVjdGlvbi1lbGVtZW50cy10ZW1wbGF0ZSc+PC9jb250ZW50PlwiO1xyXG5cdFx0dGhpcy5yZW5kZXJXaXRoaW5Jbm5lckNvbnRlbnQoaHRtbCwgXCIuY29sbGVjdGlvbi1lbGVtZW50cy10ZW1wbGF0ZVwiKTtcdFx0XHJcblx0XHR0aGlzLl9kYXRhU291cmNlID0gW107XHJcblxyXG5cdFx0dmFyIGNoaWxkcmVuID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiLmNvbGxlY3Rpb24tZWxlbWVudHMtdGVtcGxhdGVcIikuY2hpbGRyZW47XHJcblx0XHR2YXIgZmlyc3RDaGlsZDtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBjaGlsZHJlbltpXTtcclxuXHRcdFx0aWYgKGl0ZW0gIT09IG51bGwgJiYgaXRlbS5ub2RlVHlwZSAhPT0gMykge1xyXG5cdFx0XHRcdGZpcnN0Q2hpbGQgPSBpdGVtO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoZmlyc3RDaGlsZCkge1xyXG5cdFx0XHR2YXIgZGVlcENsb25lID0gZmFsc2U7XHJcblx0XHRcdHZhciB0ZW1wbGF0ZU5vZGUgPSBmaXJzdENoaWxkLmNsb25lTm9kZShkZWVwQ2xvbmUpO1xyXG5cdFx0XHR0aGlzLnRlbXBsYXRlTm9kZSA9IHRlbXBsYXRlTm9kZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGFwcGVuZERhdGE6IGZ1bmN0aW9uIChsaXN0KSB7XHJcblx0XHRfKGxpc3QpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0dmFyIGxpc3RJdGVtID0gdGhpcy5nZXRMaXN0SXRlbShpdGVtKTtcclxuXHRcdFx0aWYobGlzdEl0ZW0pIHtcclxuXHRcdFx0XHR0aGlzLl9kYXRhU291cmNlLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0sIHRoaXMpO1xyXG5cdH0sXHJcblx0Y2xlYXJEYXRhOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIuY29sbGVjdGlvbi1lbGVtZW50cy1jb250ZW50XCIpLmlubmVySFRNTCA9IFwiXCI7XHJcblx0XHR0aGlzLl9kYXRhU291cmNlID0gW107XHJcblx0fSxcclxuXHRnZXRMaXN0SXRlbTogZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdGlmICh0aGlzLnRlbXBsYXRlTm9kZSAmJiB0aGlzLnRlbXBsYXRlKSB7XHJcblx0XHRcdHZhciBtZXNzYWdlID0gXHJcblx0XHRcdFx0XCJUYWcgPFwiICsgXHJcblx0XHRcdFx0dGhpcy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICsgXHJcblx0XHRcdFx0XCI+IGhhcyBib3RoIGFuIGlubmVyIHRlbXBsYXRlIGFuZCBhIGRlZmluZWQgJ3RlbXBsYXRlJ3Byb3BlcnR5LiBcIiArXHJcblx0XHRcdFx0XCJJbiBjYXNlIG9mIGFtYmlndWl0eSwgaW5uZXIgdGVtcGxhdGUgd2lsbCBiZSB1c2VkXCI7XHJcblx0XHRcdGxvZ2dlci53YXJuKG1lc3NhZ2UpO1x0XHRcdFxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnRlbXBsYXRlTm9kZSkge1xyXG5cdFx0XHR2YXIgZGVlcENsb25lID0gZmFsc2U7XHJcblx0XHRcdHZhciB0ZW1wbGF0ZUl0ZW1Gcm9tTm9kZSA9IHRoaXMudGVtcGxhdGVOb2RlLmNsb25lTm9kZShkZWVwQ2xvbmUpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZUl0ZW0odGVtcGxhdGVJdGVtRnJvbU5vZGUsIGl0ZW0pO1x0XHRcdFxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnRlbXBsYXRlKSB7XHJcblx0XHRcdHZhciB0ZW1wbGF0ZUl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMudGVtcGxhdGUpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZUl0ZW0odGVtcGxhdGVJdGVtLCBpdGVtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIHRleHRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcblx0XHR0ZXh0SXRlbS50ZXh0Q29udGVudCA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xyXG5cdFx0cmV0dXJuIHRleHRJdGVtO1xyXG5cdH0sXHJcblx0cmVuZGVyVGVtcGxhdGVJdGVtOiBmdW5jdGlvbiAodGVtcGxhdGVJdGVtLCBpdGVtKSB7XHJcblx0XHRpZiAodGVtcGxhdGVJdGVtLnJlbmRlckZyb20gJiYgXyh0ZW1wbGF0ZUl0ZW0ucmVuZGVyRnJvbSkuaXNGdW5jdGlvbigpKSB7XHJcblx0XHRcdHRlbXBsYXRlSXRlbS5yZW5kZXJGcm9tKGl0ZW0pO1xyXG5cdFx0XHRyZXR1cm4gdGVtcGxhdGVJdGVtO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIG1lc3NhZ2UgPSBcclxuXHRcdFx0XHRcIlRhZyA8XCIgKyBcclxuXHRcdFx0XHR0ZW1wbGF0ZUl0ZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSArIFxyXG5cdFx0XHRcdFwiPiBtdXN0IGhhdmUgYSByZW5kZXJGcm9tKCkgbWV0aG9kIGlzIG9yZGVyIHRvIGJlIHVzZWQgYXMgYSB0ZW1wbGF0ZVwiO1xyXG5cdFx0XHRsb2dnZXIud2FybihtZXNzYWdlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c2hvd0xvYWRlcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMubG9hZGVyICYmICF0aGlzLnF1ZXJ5U2VsZWN0b3IodGhpcy5sb2FkZXIpKSB7XHJcblx0XHRcdHZhciBsb2FkZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLmxvYWRlcik7XHJcblx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQobG9hZGVyRWxlbWVudCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRlTG9hZGVyOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodGhpcy5sb2FkZXIpIHtcclxuXHRcdFx0dmFyIGxvYWRlckVsZW1lbnRzID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHRoaXMubG9hZGVyKTtcclxuXHRcdFx0Xyhsb2FkZXJFbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobG9hZGVyRWxlbWVudCkge1xyXG5cdFx0XHRcdGxvYWRlckVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChsb2FkZXJFbGVtZW50KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuIiwidmFyIHNhZmVFeHRlbmQgPSByZXF1aXJlKFwiLi8uLi91dGlscy9zYWZlRXh0ZW5kLmpzXCIpO1xyXG52YXIgZm9ybUJhc2UgPSByZXF1aXJlKFwiLi8uLi9iYXNlL2Zvcm0tYmFzZS5qc1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2FmZUV4dGVuZChmb3JtQmFzZSwge1xyXG5cdG9uRm9ybVN1Ym1pdDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcblx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpLm9uc3VibWl0ID0gY2FsbGJhY2s7XHJcblx0fVxyXG59KTsiLCJ2YXIgbG9nZ2VyID0gcmVxdWlyZShcIi4vLi4vdXRpbHMvbG9nZ2VyLmpzXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0IGtleSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG5cdH0sXHJcblx0c2V0IGtleSh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCBkZWZhdWx0KCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkZWZhdWx0XCIpO1xyXG5cdH0sXHJcblx0c2V0IGRlZmF1bHQodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiZGVmYXVsdFwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Y3JlYXRlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLnJlbmRlckZyb20oe30pO1xyXG5cdH0sXHJcblx0cmVuZGVyRnJvbTogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdGlmICghdGhpcy5rZXkpIHtcclxuXHRcdFx0bG9nZ2VyLndhcm4oXCJObyBrZXkgZGVmaW5lZCBpbiA8ZmVlZGJhY2stdG9rZW4+XCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB2YWx1ZSA9IGRhdGFbdGhpcy5rZXldO1xyXG5cdFx0dGhpcy5pbm5lckhUTUwgPSB2YWx1ZSB8fCB0aGlzLmRlZmF1bHQ7XHJcblx0fVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldCB2YWx1ZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XHJcblx0fSxcclxuXHRzZXQgdmFsdWUodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGNyZWF0ZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5yZW5kZXIoKTtcclxuXHR9LFxyXG5cdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5yZW5kZXIoKTtcclxuXHR9LFxyXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5pbm5lckhUTUwgPSB0aGlzLnZhbHVlIHx8IDA7XHJcblx0fVxyXG59OyIsInZhciBzYWZlRXh0ZW5kID0gcmVxdWlyZShcIi4vLi4vdXRpbHMvc2FmZUV4dGVuZC5qc1wiKTtcclxudmFyIGZvcm1CYXNlID0gcmVxdWlyZShcIi4vLi4vYmFzZS9mb3JtLWJhc2UuanNcIik7XHJcbnZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9sb2dnZXIuanNcIik7XHJcbnZhciBldmVudHMgPSByZXF1aXJlKFwiLi8uLi91dGlscy9ldmVudHMuanNcIik7XHJcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi8uLi91dGlscy9jb25zdGFudHMuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhZmVFeHRlbmQoZm9ybUJhc2UsIHtcclxuXHRnZXQgcG9zdFVybCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwicG9zdC11cmxcIik7XHJcblx0fSxcclxuXHRzZXQgcG9zdFVybCh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJwb3N0LXVybFwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IGFqYXhTZXJ2aWNlKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJhamF4U2VydmljZVwiKTtcclxuXHR9LFxyXG5cdHNldCBhamF4U2VydmljZSh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJhamF4U2VydmljZVwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IGxvYWRlcigpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwibG9hZGVyXCIpO1xyXG5cdH0sXHJcblx0c2V0IGxvYWRlcih2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsb2FkZXJcIiwgdmFsKTtcclxuXHR9LFx0XHJcblx0Y3JlYXRlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0ICAgIHNlbGYucmVuZGVyKCk7XHJcblx0ICAgIHNlbGYub25zdWJtaXQgPSBmdW5jdGlvbiAoZSkge1xyXG5cdCAgICBcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHQgICAgXHRzZWxmLnN1Ym1pdCgpO1xyXG5cdCAgICB9O1xyXG5cdH0sXHRcclxuXHRzdWJtaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciAkID0gd2luZG93W3RoaXMuYWpheFNlcnZpY2VdO1xyXG5cdFx0aWYgKCEkIHx8ICFfKCQuYWpheCkuaXNGdW5jdGlvbigpKSB7XHJcblx0XHRcdHZhciBhamF4U2VydmljZU1lc3NhZ2UgPSBcclxuXHRcdFx0XHRcIkNhbm5vdCBmaW5kIGEgdmFsaWQgYWpheCBzZXJ2aWNlICdcIiArXHJcblx0XHRcdFx0dGhpcy5hamF4U2VydmljZSArIFxyXG5cdFx0XHRcdFwiJyBvbiBtYWluIHdpbmRvdyBmb3IgPGZvcm0tYWpheC8+IHRhZy5cIjtcclxuXHRcdFx0bG9nZ2VyLndhcm4oYWpheFNlcnZpY2VNZXNzYWdlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5wb3N0VXJsKSB7XHJcblx0XHRcdHZhciB1cmxNZXNzYWdlID0gXCJVbmRlZmluZWQgcG9zdFVybCBmb3IgPGZvcm0tYWpheC8+IHRhZy5cIjtcclxuXHRcdFx0bG9nZ2VyLndhcm4odXJsTWVzc2FnZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRldmVudHMucmFpc2UodGhpcywgY29uc3RhbnRzLmJlZm9yZVZhbGlkYXRlLCB7fSk7XHJcblx0XHR2YXIgdmFsaWRhdGlvblJlc3VsdCA9IHRoaXMudmFsaWRhdGUoKTtcclxuXHJcblx0XHRpZiAoIXZhbGlkYXRpb25SZXN1bHQpIHtcclxuXHRcdFx0ZXZlbnRzLnJhaXNlKHRoaXMsIGNvbnN0YW50cy5vbkNsaWVudFZhbGlkYXRpb25GYWlsdXJlLCB7fSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZm9ybURhdGEgPSBzZWxmLmdldERhdGEoKTtcclxuXHRcdGV2ZW50cy5yYWlzZSh0aGlzLCBjb25zdGFudHMuYmVmb3JlU3VibWl0LCBmb3JtRGF0YSk7XHJcblx0XHRcdFx0XHJcblx0XHRzZWxmLnNob3dMb2FkZXIoKTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHNlbGYucG9zdFVybCxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgZGF0YTogZm9ybURhdGEsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRldmVudHMucmFpc2Uoc2VsZiwgY29uc3RhbnRzLm9uU3VibWl0UmVzcG9uc2UsIHJlc3VsdCk7XHJcblx0XHRcdFx0c2VsZi5oaWRlTG9hZGVyKCk7XHJcblx0XHRcdFx0c2VsZi5jbGVhckVycm9yc0FuZFdhcm5pbmdzKCk7XHJcblx0XHRcdFx0aWYgKHJlc3VsdC5pc1ZhbGlkKSB7XHJcblx0XHRcdFx0XHRldmVudHMucmFpc2Uoc2VsZiwgY29uc3RhbnRzLm9uU2VydmVyVmFsaWRhdGlvblN1Y2Nlc3MsIHJlc3VsdCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNlbGYuc2V0RXJyb3JzKHJlc3VsdC5lcnJvcnMpO1xyXG5cdFx0XHRcdFx0c2VsZi5zZXRXYXJuaW5ncyhyZXN1bHQud2FybmluZ3MpO1xyXG5cdFx0XHRcdFx0ZXZlbnRzLnJhaXNlKHNlbGYsIGNvbnN0YW50cy5vblNlcnZlclZhbGlkYXRpb25GYWlsdXJlLCByZXN1bHQpO1xyXG5cdFx0XHRcdH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgXHRzZWxmLmhpZGVMb2FkZXIoKTtcclxuXHRcdFx0XHRldmVudHMucmFpc2Uoc2VsZiwgY29uc3RhbnRzLm9uU3VibWl0UmVzcG9uc2UsIHJlc3VsdCk7XHJcblx0XHRcdFx0Ly9ldmVudHMucmFpc2UodGhpcywgY29uc3RhbnRzLm9uU3VibWl0RXJyb3IsIHt9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cdH0sXHJcblx0c2hvd0xvYWRlcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHRoaXMubG9hZGVyICYmICF0aGlzLnF1ZXJ5U2VsZWN0b3IodGhpcy5sb2FkZXIpKSB7XHJcblx0XHRcdHZhciBsb2FkZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLmxvYWRlcik7XHJcblx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQobG9hZGVyRWxlbWVudCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRoaWRlTG9hZGVyOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodGhpcy5sb2FkZXIpIHtcclxuXHRcdFx0dmFyIGxvYWRlckVsZW1lbnRzID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHRoaXMubG9hZGVyKTtcclxuXHRcdFx0Xyhsb2FkZXJFbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobG9hZGVyRWxlbWVudCkge1xyXG5cdFx0XHRcdGxvYWRlckVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChsb2FkZXJFbGVtZW50KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuIiwiXHJcbnZhciBodG1sID0gXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcXG5cXHQ8bGFiZWw+PC9sYWJlbD5cXHJcXG5cXHQ8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIC8+XFxyXFxuXFx0PHNwYW4gY2xhc3M9XFxcImVycm9yIGhlbHAtYmxvY2tcXFwiPjwvc3Bhbj5cXHJcXG5cXHQ8c3BhbiBjbGFzcz1cXFwid2FybmluZyBoZWxwLWJsb2NrXFxcIj48L3NwYW4+XFxyXFxuPC9kaXY+XCI7XHJcbnZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9sb2dnZXIuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXQgZmllbGQoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImZpZWxkXCIpO1xyXG5cdH0sXHJcblx0c2V0IGZpZWxkKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImZpZWxkXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgdmFsdWUoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaW5wdXQuY2hlY2tlZDtcclxuXHR9LFxyXG5cdHNldCB2YWx1ZSh2YWwpIHtcclxuXHRcdGlmICh2YWwpIHtcclxuXHRcdFx0dGhpcy5jb250ZW50LmlucHV0LmNoZWNrZWQgPSB0cnVlO1xyXG5cdCAgICBcdHRoaXMuc2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiLCB0cnVlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY29udGVudC5pbnB1dC5jaGVja2VkID0gZmFsc2U7XHJcblx0ICAgIFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJjaGVja2VkXCIpO1xyXG5cdFx0fVxyXG5cdH0sXHRcclxuXHRnZXQgcmVhZG9ubHkoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xyXG5cdH0sXHJcblx0c2V0IHJlYWRvbmx5KHZhbCkge1xyXG5cdFx0aWYgKHZhbCkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIHZhbCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xyXG5cdFx0fVxyXG5cdH0sICBcclxuXHRnZXQgbGFiZWwoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG5cdH0sXHJcblx0c2V0IGxhYmVsKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIHZhbCk7XHJcblx0fSwgICAgXHJcblx0Z2V0IGVycm9yKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJlcnJvclwiKTtcclxuXHR9LFxyXG5cdHNldCBlcnJvcih2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJlcnJvclwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHdhcm5pbmcoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcIndhcm5pbmdcIik7XHJcblx0fSxcclxuXHRzZXQgd2FybmluZyh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ3YXJuaW5nXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgZm9ybUdyb3VwQ2xhc3MoKSB7XHJcblx0XHRpZiAodGhpcy5lcnJvcikge1xyXG5cdFx0XHRyZXR1cm4gXCJmb3JtLWdyb3VwIGhhcy1lcnJvclwiO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLndhcm5pbmcpIHtcclxuXHRcdFx0cmV0dXJuIFwiZm9ybS1ncm91cCBoYXMtd2FybmluZ1wiO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnZhbHVlKSB7XHJcblx0XHRcdHJldHVybiBcImZvcm0tZ3JvdXAgaGFzLXN1Y2Nlc3NcIjtcdFxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIFwiZm9ybS1ncm91cFwiO1xyXG5cdH0sICBcclxuXHRjcmVhdGVkQ2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHQgICAgc2VsZi5yZW5kZXIoKTtcclxuXHQgICAgc2VsZi5kYXRhQmluZCgpO1xyXG5cdCAgICBzZWxmLmNvbnRlbnQuZm9ybUdyb3VwLmNsYXNzTmFtZSA9IFwiZm9ybS1ncm91cFwiO1xyXG5cdFx0c2VsZi5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuXHQgICAgXHRzZWxmLnZhbGlkYXRlKCk7XHJcblx0ICAgIH07XHJcblx0fSxcclxuXHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZGF0YUJpbmQoKTtcclxuXHR9LFxyXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5pbm5lckhUTUwgPSBodG1sO1xyXG5cdFx0dGhpcy5jb250ZW50ID0geyBcclxuXHRcdFx0Zm9ybUdyb3VwOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS1ncm91cFwiKSxcclxuXHRcdFx0aW5wdXQ6IHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLFxyXG5cdFx0XHRsYWJlbDogdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIiksXHJcblx0XHRcdGVycm9yU3BhbjogdGhpcy5xdWVyeVNlbGVjdG9yKFwiLmVycm9yXCIpLFxyXG5cdFx0XHR3YXJuaW5nU3BhbjogdGhpcy5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIiksXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0ZGF0YUJpbmQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICghdGhpcy5maWVsZCkge1xyXG5cdFx0XHR2YXIgbWVzc2FnZSA9IFxyXG5cdFx0XHRcdFwiVGFnIDxcIiArIFxyXG5cdFx0XHRcdHRoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKSArIFxyXG5cdFx0XHRcdFwiPiB3aXRob3V0ICdmaWVsZCcgYXR0cmlidXRlLiBcIiArXHJcblx0XHRcdFx0XCJUaGlzIHdpbGwgcHJldmVudCBhIGNvcnJlY3QgYmVoYXZpb3VyIGluc2lkZSA8Zm9ybS1hamF4PiBvciA8Y29sbGVjdGlvbi1zZWFyY2gtZm9ybT4uXCI7XHJcblx0XHRcdGxvZ2dlci53YXJuKG1lc3NhZ2UpO1x0XHRcdFxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIExhYmVsIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC5sYWJlbC5odG1sRm9yID0gdGhpcy5maWVsZDtcclxuXHRcdHRoaXMuY29udGVudC5sYWJlbC50ZXh0Q29udGVudCA9IHRoaXMubGFiZWw7XHJcblxyXG5cdFx0Ly8gSW5wdXQgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50LmlucHV0LnZhbHVlID0gdGhpcy52YWx1ZTtcclxuXHRcdHRoaXMuY29udGVudC5pbnB1dC5uYW1lID0gdGhpcy5maWVsZDtcclxuXHRcdHRoaXMuY29udGVudC5pbnB1dC5pZCA9IHRoaXMuZmllbGQ7XHJcblxyXG5cdFx0aWYgKHRoaXMucmVhZG9ubHkpIHtcclxuXHRcdFx0dGhpcy5jb250ZW50LmlucHV0LnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIHRoaXMucmVhZG9ubHkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jb250ZW50LmlucHV0LnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVycm9yIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC5lcnJvclNwYW4udGV4dENvbnRlbnQgPSB0aGlzLmVycm9yO1xyXG5cclxuXHRcdC8vIFdhcm5pbmcgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50Lndhcm5pbmdTcGFuLnRleHRDb250ZW50ID0gdGhpcy53YXJuaW5nO1xyXG5cclxuXHRcdC8vIEZvcm0gR3JvdXAgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50LmZvcm1Hcm91cC5jbGFzc05hbWUgPSB0aGlzLmZvcm1Hcm91cENsYXNzO1x0XHRcclxuXHR9LFxyXG5cdHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLmVycm9yID0gXCJcIjtcclxuXHRcdHRoaXMud2FybmluZyA9IFwiXCI7XHRcdFxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG59O1xyXG5cclxuIiwiXHJcbnZhciBodG1sID0gXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgPGxhYmVsPjwvbGFiZWw+XFxyXFxuICAgIDxjb250ZW50IGNsYXNzPVxcXCJyYWRpby1ncm91cC1jb250ZW50XFxcIj48L2NvbnRlbnQ+XFxyXFxuICAgIDxzcGFuIGNsYXNzPVxcXCJlcnJvciBoZWxwLWJsb2NrXFxcIj48L3NwYW4+XFxyXFxuICAgIDxzcGFuIGNsYXNzPVxcXCJ3YXJuaW5nIGhlbHAtYmxvY2tcXFwiPjwvc3Bhbj5cXHJcXG48L2Rpdj5cIjtcclxudmFyIHNhZmVFeHRlbmQgPSByZXF1aXJlKFwiLi8uLi91dGlscy9zYWZlRXh0ZW5kLmpzXCIpO1xyXG52YXIgY29udGFpbmVyQmFzZSA9IHJlcXVpcmUoXCIuLy4uL2Jhc2UvY29udGFpbmVyLWJhc2UuanNcIik7XHJcbnZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9sb2dnZXIuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNhZmVFeHRlbmQoY29udGFpbmVyQmFzZSwgIHtcclxuXHRnZXQgZmllbGQoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImZpZWxkXCIpO1xyXG5cdH0sXHJcblx0c2V0IGZpZWxkKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImZpZWxkXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgdmFsdWUoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldENoZWNrZWRWYWx1ZSgpO1xyXG5cdH0sXHJcblx0c2V0IHZhbHVlKHZhbCkge1xyXG5cdFx0aWYgKCF2YWwpIHZhbCA9IFwiXCI7XHJcblx0XHR0aGlzLmNoZWNrSW5uZXJSYWRpb3ModmFsKTtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB2YWwpO1xyXG5cdH0sICBcclxuXHRnZXQgbGFiZWwoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG5cdH0sXHJcblx0c2V0IGxhYmVsKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIHZhbCk7XHJcblx0fSwgICAgXHJcblx0Z2V0IGVycm9yKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJlcnJvclwiKTtcclxuXHR9LFxyXG5cdHNldCBlcnJvcih2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJlcnJvclwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHdhcm5pbmcoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcIndhcm5pbmdcIik7XHJcblx0fSxcclxuXHRzZXQgd2FybmluZyh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ3YXJuaW5nXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgcmVxdWlyZWQoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShcInJlcXVpcmVkXCIpO1xyXG5cdH0sXHJcblx0c2V0IHJlcXVpcmVkKHZhbCkge1xyXG5cdFx0aWYgKHZhbCkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShcInJlcXVpcmVkXCIsIHZhbCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShcInJlcXVpcmVkXCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0IHJlcXVpcmVkTWVzc2FnZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwicmVxdWlyZWQtbWVzc2FnZVwiKTtcclxuXHR9LFxyXG5cdHNldCByZXF1aXJlZE1lc3NhZ2UodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwicmVxdWlyZWQtbWVzc2FnZVwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IGZvcm1Hcm91cENsYXNzKCkge1xyXG5cdFx0aWYgKHRoaXMuZXJyb3IpIHtcclxuXHRcdFx0cmV0dXJuIFwiZm9ybS1ncm91cCBoYXMtZXJyb3JcIjtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy53YXJuaW5nKSB7XHJcblx0XHRcdHJldHVybiBcImZvcm0tZ3JvdXAgaGFzLXdhcm5pbmdcIjtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy52YWx1ZSkge1xyXG5cdFx0XHRyZXR1cm4gXCJmb3JtLWdyb3VwIGhhcy1zdWNjZXNzXCI7XHRcclxuXHRcdH1cclxuXHRcdHJldHVybiBcImZvcm0tZ3JvdXBcIjtcclxuXHR9LCAgXHJcblx0Y3JlYXRlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0ICAgIHNlbGYucmVuZGVyKCk7XHJcblx0ICAgIHNlbGYuZGF0YUJpbmQoKTtcclxuXHQgICAgdGhpcy5jb250ZW50LmZvcm1Hcm91cC5jbGFzc05hbWUgPSBcImZvcm0tZ3JvdXBcIjtcclxuXHQgICAgc2VsZi5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuXHQgICAgXHRzZWxmLnZhbGlkYXRlKCk7XHJcblx0ICAgIH07XHQgICAgXHJcblx0fSxcclxuXHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZGF0YUJpbmQoKTtcclxuXHR9LFxyXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5yZW5kZXJXaXRoaW5Jbm5lckNvbnRlbnQoaHRtbCwgXCIucmFkaW8tZ3JvdXAtY29udGVudFwiKTtcclxuXHRcdHRoaXMuY29udGVudCA9IHsgXHJcblx0XHRcdGZvcm1Hcm91cDogdGhpcy5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tZ3JvdXBcIiksXHJcblx0XHRcdGxhYmVsOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKSxcclxuXHRcdFx0ZXJyb3JTcGFuOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIuZXJyb3JcIiksXHJcblx0XHRcdHdhcm5pbmdTcGFuOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIud2FybmluZ1wiKSxcclxuXHRcdH07XHJcblx0fSxcclxuXHRkYXRhQmluZDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCF0aGlzLmZpZWxkKSB7XHJcblx0XHRcdHZhciBtZXNzYWdlID0gXHJcblx0XHRcdFx0XCJUYWcgPFwiICsgXHJcblx0XHRcdFx0dGhpcy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICsgXHJcblx0XHRcdFx0XCI+IHdpdGhvdXQgJ2ZpZWxkJyBhdHRyaWJ1dGUuIFwiICtcclxuXHRcdFx0XHRcIlRoaXMgd2lsbCBwcmV2ZW50IGEgY29ycmVjdCBiZWhhdmlvdXIgaW5zaWRlIDxmb3JtLWFqYXg+IG9yIDxjb2xsZWN0aW9uLXNlYXJjaC1mb3JtPi5cIjtcclxuXHRcdFx0bG9nZ2VyLndhcm4obWVzc2FnZSk7XHRcdFx0XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTGFiZWwgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50LmxhYmVsLmh0bWxGb3IgPSB0aGlzLmZpZWxkO1xyXG5cdFx0dGhpcy5jb250ZW50LmxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5sYWJlbDtcclxuXHJcblx0XHQvLyBFcnJvciBCaW5kaW5nXHJcblx0XHR0aGlzLmNvbnRlbnQuZXJyb3JTcGFuLnRleHRDb250ZW50ID0gdGhpcy5lcnJvcjtcclxuXHJcblx0XHQvLyBXYXJuaW5nIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC53YXJuaW5nU3Bhbi50ZXh0Q29udGVudCA9IHRoaXMud2FybmluZztcclxuXHJcblx0XHQvLyBGb3JtIEdyb3VwIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC5mb3JtR3JvdXAuY2xhc3NOYW1lID0gdGhpcy5mb3JtR3JvdXBDbGFzcztcclxuXHJcblx0XHQvLyBJbm5lciBSYWRpbyBCaW5kaW5nXHJcblx0XHR2YXIgcmFkaW9zID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQtcmFkaW9cIik7XHJcblx0XHRfKHJhZGlvcykuZm9yRWFjaChmdW5jdGlvbiAocmFkaW8pIHtcclxuXHRcdFx0cmFkaW8uZmllbGQgPSB0aGlzLmZpZWxkO1xyXG5cdFx0fSwgdGhpcyk7XHRcdFxyXG5cdH0sXHJcblx0dmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZXJyb3IgPSBcIlwiO1xyXG5cdFx0dGhpcy53YXJuaW5nID0gXCJcIjtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMucmVxdWlyZWQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLnZhbHVlKSB7XHJcblx0XHRcdFx0dGhpcy5lcnJvciA9IHRoaXMucmVxdWlyZWRNZXNzYWdlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblx0Y2hlY2tJbm5lclJhZGlvczogZnVuY3Rpb24gKHZhbCkge1xyXG5cdFx0dmFyIHJhZGlvcyA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImlucHV0LXJhZGlvXCIpO1xyXG5cdFx0XyhyYWRpb3MpLmZvckVhY2goZnVuY3Rpb24gKHJhZGlvKSB7XHJcblx0XHRcdHJhZGlvLmNoZWNrZWQgPSByYWRpby52YWx1ZSA9PT0gdmFsO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRDaGVja2VkVmFsdWU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciByYWRpb3MgPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dC1yYWRpb1wiKTtcclxuXHRcdHZhciBjaGVja2VkUmFkaW8gPSBfKHJhZGlvcykuZmluZChmdW5jdGlvbiAocmFkaW8pIHtcclxuXHRcdFx0cmV0dXJuIHJhZGlvLmNoZWNrZWQ7XHJcblx0XHR9KTtcclxuXHRcdGlmIChjaGVja2VkUmFkaW8pIHtcclxuXHRcdFx0cmV0dXJuIGNoZWNrZWRSYWRpby52YWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0fSxcclxuXHRhcHBlbmRDaGlsZDogZnVuY3Rpb24gKGNoaWxkKSB7XHJcblx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJjb250ZW50XCIpLmFwcGVuZENoaWxkKGNoaWxkKTtcclxuXHR9XHJcbn0pOyIsIlxyXG52YXIgaHRtbCA9IFwiPGRpdiBjbGFzcz1cXFwicmFkaW9cXFwiPlxcclxcbiAgPGxhYmVsPlxcclxcbiAgICA8aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiLz5cXHJcXG4gICAgPHNwYW4gY2xhc3M9XFxcInJhZGlvLWxhYmVsXFxcIj48L3NwYW4+XFxyXFxuICA8L2xhYmVsPlxcclxcbjwvZGl2PlwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0IGNoZWNrZWQoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaW5wdXQuY2hlY2tlZDtcclxuXHR9LFxyXG5cdHNldCBjaGVja2VkKHZhbCkge1xyXG5cdFx0aWYgKHZhbCkge1xyXG5cdFx0XHR0aGlzLmNvbnRlbnQuaW5wdXQuY2hlY2tlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiLCB2YWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jb250ZW50LmlucHV0LmNoZWNrZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJjaGVja2VkXCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0IGZpZWxkKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJmaWVsZFwiKTtcclxuXHR9LFxyXG5cdHNldCBmaWVsZCh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJmaWVsZFwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHZhbHVlKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcclxuXHR9LFxyXG5cdHNldCB2YWx1ZSh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHJlYWRvbmx5KCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcclxuXHR9LFxyXG5cdHNldCByZWFkb25seSh2YWwpIHtcclxuXHRcdGlmICh2YWwpIHtcclxuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB2YWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldCBsYWJlbCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcblx0fSxcclxuXHRzZXQgbGFiZWwodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGNyZWF0ZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdCAgICB0aGlzLnJlbmRlcigpO1xyXG5cdCAgICB0aGlzLmRhdGFCaW5kKCk7XHJcblx0ICAgIGlmICh0aGlzLmhhc0F0dHJpYnV0ZShcImNoZWNrZWRcIikpIHtcclxuXHQgICAgXHR0aGlzLmNvbnRlbnQuaW5wdXQuY2hlY2tlZCA9IHRydWU7XHJcblx0ICAgIH0gZWxzZSB7XHJcblx0ICAgIFx0dGhpcy5jb250ZW50LmlucHV0LmNoZWNrZWQgPSBmYWxzZTtcclxuXHQgICAgfVx0ICAgIFxyXG5cdH0sXHJcblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLmRhdGFCaW5kKCk7XHJcblx0fSxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuaW5uZXJIVE1MID0gaHRtbDtcclxuXHRcdHRoaXMuY29udGVudCA9IHsgXHJcblx0XHRcdGlucHV0OiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKSxcclxuXHRcdFx0bGFiZWw6IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpLFxyXG5cdFx0XHRyYWRpb0xhYmVsOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIucmFkaW8tbGFiZWxcIiksXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0ZGF0YUJpbmQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdC8vIExhYmVsIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC5sYWJlbC5odG1sRm9yID0gdGhpcy5maWVsZCArIHRoaXMudmFsdWU7XHJcblx0XHR0aGlzLmNvbnRlbnQucmFkaW9MYWJlbC50ZXh0Q29udGVudCA9IHRoaXMubGFiZWw7XHJcblxyXG5cdFx0Ly8gSW5wdXQgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50LmlucHV0LnZhbHVlID0gdGhpcy52YWx1ZTtcclxuXHRcdHRoaXMuY29udGVudC5pbnB1dC5uYW1lID0gdGhpcy5maWVsZDtcclxuXHRcdHRoaXMuY29udGVudC5pbnB1dC5pZCA9IHRoaXMuZmllbGQgKyB0aGlzLnZhbHVlO1xyXG5cclxuXHRcdGlmICh0aGlzLnJlYWRvbmx5KSB7XHJcblx0XHRcdHRoaXMuY29udGVudC5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCB0aGlzLnJlYWRvbmx5KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY29udGVudC5pbnB1dC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG4iLCJcclxudmFyIGh0bWwgPSBcIjxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclxcblxcdDxsYWJlbD48L2xhYmVsPlxcclxcblxcdDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbCBzZWxlY3QtY29udGVudFxcXCI+PC9zZWxlY3Q+XFxyXFxuXFx0PHNwYW4gY2xhc3M9XFxcImVycm9yIGhlbHAtYmxvY2tcXFwiPjwvc3Bhbj5cXHJcXG5cXHQ8c3BhbiBjbGFzcz1cXFwid2FybmluZyBoZWxwLWJsb2NrXFxcIj48L3NwYW4+XFxyXFxuPC9kaXY+XCI7XHJcbnZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9sb2dnZXIuanNcIik7XHJcbnZhciBjb250YWluZXJCYXNlID0gcmVxdWlyZShcIi4vLi4vYmFzZS9jb250YWluZXItYmFzZS5qc1wiKTtcclxudmFyIHNhZmVFeHRlbmQgPSByZXF1aXJlKFwiLi8uLi91dGlscy9zYWZlRXh0ZW5kLmpzXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzYWZlRXh0ZW5kKGNvbnRhaW5lckJhc2UsIHtcclxuXHRnZXQgYWpheFNlcnZpY2UoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImFqYXhTZXJ2aWNlXCIpIHx8IDEwMDtcclxuXHR9LFxyXG5cdHNldCBhamF4U2VydmljZSh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJhamF4U2VydmljZVwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IGZldGNoVGltZW91dCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwiZmV0Y2gtdGltZW91dFwiKTtcclxuXHR9LFxyXG5cdHNldCBmZXRjaFRpbWVvdXQodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiZmV0Y2gtdGltZW91dFwiLCB2YWwpO1xyXG5cdH0sXHRcclxuXHRnZXQgZ2V0VXJsKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJnZXQtdXJsXCIpO1xyXG5cdH0sXHJcblx0c2V0IGdldFVybCh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJnZXQtdXJsXCIsIHZhbCk7XHJcblx0fSxcdFxyXG5cdGdldCBmaWVsZCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwiZmllbGRcIik7XHJcblx0fSxcclxuXHRzZXQgZmllbGQodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiZmllbGRcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCB2YWx1ZSgpIHtcclxuXHQgICAgcmV0dXJuICB0aGlzLmNvbnRlbnQuc2VsZWN0LnZhbHVlO1xyXG5cdH0sXHJcblx0c2V0IHZhbHVlKHZhbCkge1xyXG5cdFx0aWYgKCF2YWwpIHZhbCA9IFwiXCI7XHJcblx0XHR0aGlzLmNvbnRlbnQuc2VsZWN0LnZhbHVlID0gdmFsO1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHZhbCk7XHJcblx0fSxcdFxyXG5cdGdldCByZWFkb25seSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKFwicmVhZG9ubHlcIik7XHJcblx0fSxcclxuXHRzZXQgcmVhZG9ubHkodmFsKSB7XHJcblx0XHRpZiAodmFsKSB7XHJcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKFwicmVhZG9ubHlcIiwgdmFsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKFwicmVhZG9ubHlcIik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXQgcGxhY2Vob2xkZXIoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xyXG5cdH0sXHJcblx0c2V0IHBsYWNlaG9sZGVyKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIHZhbCk7XHJcblx0fSwgICAgXHJcblx0Z2V0IGxhYmVsKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuXHR9LFxyXG5cdHNldCBsYWJlbCh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCB2YWwpO1xyXG5cdH0sICAgIFxyXG5cdGdldCBlcnJvcigpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwiZXJyb3JcIik7XHJcblx0fSxcclxuXHRzZXQgZXJyb3IodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiZXJyb3JcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCB3YXJuaW5nKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ3YXJuaW5nXCIpO1xyXG5cdH0sXHJcblx0c2V0IHdhcm5pbmcodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwid2FybmluZ1wiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHJlcXVpcmVkKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoXCJyZXF1aXJlZFwiKTtcclxuXHR9LFxyXG5cdHNldCByZXF1aXJlZCh2YWwpIHtcclxuXHRcdGlmICh2YWwpIHtcclxuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoXCJyZXF1aXJlZFwiLCB2YWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJyZXF1aXJlZFwiKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldCByZXF1aXJlZE1lc3NhZ2UoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcInJlcXVpcmVkLW1lc3NhZ2VcIik7XHJcblx0fSxcclxuXHRzZXQgcmVxdWlyZWRNZXNzYWdlKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcInJlcXVpcmVkLW1lc3NhZ2VcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCBmb3JtR3JvdXBDbGFzcygpIHtcclxuXHRcdGlmICh0aGlzLmVycm9yKSB7XHJcblx0XHRcdHJldHVybiBcImZvcm0tZ3JvdXAgaGFzLWVycm9yXCI7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMud2FybmluZykge1xyXG5cdFx0XHRyZXR1cm4gXCJmb3JtLWdyb3VwIGhhcy13YXJuaW5nXCI7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMudmFsdWUpIHtcclxuXHRcdFx0cmV0dXJuIFwiZm9ybS1ncm91cCBoYXMtc3VjY2Vzc1wiO1x0XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gXCJmb3JtLWdyb3VwXCI7XHJcblx0fSwgICAgXHJcblx0Y3JlYXRlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0ICAgIHNlbGYucmVuZGVyKCk7XHJcblx0ICAgIHNlbGYuZGF0YUJpbmQoKTtcclxuXHQgICAgc2VsZi5jb250ZW50LmZvcm1Hcm91cC5jbGFzc05hbWUgPSBcImZvcm0tZ3JvdXBcIjtcclxuXHQgICAgc2VsZi5vbmtleXVwID0gZnVuY3Rpb24gKGUpIHtcclxuXHQgICAgXHRzZWxmLnZhbGlkYXRlKCk7XHJcblx0ICAgIH07XHJcblx0ICAgIHNlbGYub25rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0c2VsZi52YWxpZGF0ZSgpO1xyXG5cdCAgICB9O1xyXG5cdH0sXHJcblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLmRhdGFCaW5kKCk7XHJcblx0fSxcclxuXHRhdHRhY2hlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRzZWxmLmZpcnN0RmV0Y2hUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHNlbGYucmVuZGVyT3B0aW9ucygpO1xyXG5cdFx0fSwgc2VsZi5mZXRjaFRpbWVvdXQpO1xyXG5cdH0sXHJcblx0ZGV0YWNoZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMuZmlyc3RGZXRjaFRpbWVvdXQpO1xyXG5cdH0sXHRcclxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMucmVuZGVyV2l0aGluSW5uZXJDb250ZW50KGh0bWwsIFwic2VsZWN0LnNlbGVjdC1jb250ZW50XCIpO1xyXG5cdFx0dGhpcy5jb250ZW50ID0geyBcclxuXHRcdFx0Zm9ybUdyb3VwOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS1ncm91cFwiKSxcclxuXHRcdFx0c2VsZWN0OiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJzZWxlY3RcIiksXHJcblx0XHRcdGxhYmVsOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKSxcclxuXHRcdFx0ZXJyb3JTcGFuOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIuZXJyb3JcIiksXHJcblx0XHRcdHdhcm5pbmdTcGFuOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIud2FybmluZ1wiKSxcclxuXHRcdH07XHJcblx0fSxcclxuXHRkYXRhQmluZDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCF0aGlzLmZpZWxkKSB7XHJcblx0XHRcdHZhciBtZXNzYWdlID0gXHJcblx0XHRcdFx0XCJUYWcgPFwiICsgXHJcblx0XHRcdFx0dGhpcy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICsgXHJcblx0XHRcdFx0XCI+IHdpdGhvdXQgJ2ZpZWxkJyBhdHRyaWJ1dGUuIFwiICtcclxuXHRcdFx0XHRcIlRoaXMgd2lsbCBwcmV2ZW50IGEgY29ycmVjdCBiZWhhdmlvdXIgaW5zaWRlIDxmb3JtLWFqYXg+IG9yIDxjb2xsZWN0aW9uLXNlYXJjaC1mb3JtPi5cIjtcclxuXHRcdFx0bG9nZ2VyLndhcm4obWVzc2FnZSk7XHRcdFx0XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTGFiZWwgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50LmxhYmVsLmh0bWxGb3IgPSB0aGlzLmZpZWxkO1xyXG5cdFx0dGhpcy5jb250ZW50LmxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5sYWJlbDtcclxuXHJcblx0XHQvLyBJbnB1dCBCaW5kaW5nXHJcblx0XHR0aGlzLmNvbnRlbnQuc2VsZWN0Lm5hbWUgPSB0aGlzLmZpZWxkO1xyXG5cdFx0dGhpcy5jb250ZW50LnNlbGVjdC5pZCA9IHRoaXMuZmllbGQ7XHJcblxyXG5cdFx0aWYgKHRoaXMucmVhZG9ubHkpIHtcclxuXHRcdFx0dGhpcy5jb250ZW50LnNlbGVjdC5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB0aGlzLnJlYWRvbmx5KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY29udGVudC5zZWxlY3QucmVtb3ZlQXR0cmlidXRlKFwicmVhZG9ubHlcIik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRXJyb3IgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50LmVycm9yU3Bhbi50ZXh0Q29udGVudCA9IHRoaXMuZXJyb3I7XHJcblxyXG5cdFx0Ly8gV2FybmluZyBCaW5kaW5nXHJcblx0XHR0aGlzLmNvbnRlbnQud2FybmluZ1NwYW4udGV4dENvbnRlbnQgPSB0aGlzLndhcm5pbmc7XHJcblxyXG5cdFx0Ly8gRm9ybSBHcm91cCBCaW5kaW5nXHJcblx0XHR0aGlzLmNvbnRlbnQuZm9ybUdyb3VwLmNsYXNzTmFtZSA9IHRoaXMuZm9ybUdyb3VwQ2xhc3M7XHJcblx0fSxcclxuXHR2YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5lcnJvciA9IFwiXCI7XHJcblx0XHR0aGlzLndhcm5pbmcgPSBcIlwiO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5yZXF1aXJlZCkge1xyXG5cdFx0XHRpZiAoIXRoaXMudmFsdWUpIHtcclxuXHRcdFx0XHR0aGlzLmVycm9yID0gdGhpcy5yZXF1aXJlZE1lc3NhZ2U7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fSxcclxuXHRhcHBlbmRDaGlsZDogZnVuY3Rpb24gKGNoaWxkKSB7XHJcblx0XHR2YXIgY29udGVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcclxuXHRcdGlmICghY29udGVudCkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJBbiA8aW5wdXQtc2VsZWN0PiBlbGVtZW50IG11c3QgY29udGFpbiBhbiBpbm5lciA8c2VsZWN0PiB0YWcuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRjb250ZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxuXHR9LFxyXG5cdHJlbmRlck9wdGlvbnM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICghdGhpcy5nZXRVcmwpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciAkID0gd2luZG93W3RoaXMuYWpheFNlcnZpY2VdO1xyXG5cdFx0aWYgKCEkIHx8ICFfKCQuYWpheCkuaXNGdW5jdGlvbigpKSB7XHJcblx0XHRcdHZhciBhamF4U2VydmljZU1lc3NhZ2UgPSBcclxuXHRcdFx0XHRcIkNhbm5vdCBmaW5kIGEgdmFsaWQgYWpheCBzZXJ2aWNlICdcIiArXHJcblx0XHRcdFx0dGhpcy5hamF4U2VydmljZSArIFxyXG5cdFx0XHRcdFwiJyBvbiBtYWluIHdpbmRvdyBmb3IgPGNvbGxlY3Rpb24tY29udGFpbmVyLz4gdGFnLlwiO1xyXG5cdFx0XHRsb2dnZXIud2FybihhamF4U2VydmljZU1lc3NhZ2UpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogc2VsZi5nZXRVcmwsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgZGF0YToge30sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHR2YXIgb3B0aW9uTGlzdCA9IHJlc3VsdC5kYXRhO1xyXG5cdFx0XHRcdGlmIChvcHRpb25MaXN0KSB7XHJcblx0XHRcdFx0XHRfKG9wdGlvbkxpc3QpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0dmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcblx0XHRcdFx0XHRcdG9wdGlvbi52YWx1ZSA9IGl0ZW0udmFsdWU7XHJcblx0XHRcdFx0XHRcdG9wdGlvbi50ZXh0Q29udGVudCA9IGl0ZW0udGV4dENvbnRlbnQ7XHJcblx0XHRcdFx0XHRcdHNlbGYuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsb2dnZXIud2FybihcIk5vIGNvbGxlY3Rpb24gZGF0YSBkZWZpbmVkLiBUaGUgcmVzdWx0IHNob3VsZCBoYXZlIGEgc3RydWN0dXJlIG9mIHR5cGUgeyBkYXRhOiBbIHsgdmFsdWU6ICcnLCB0ZXh0Q29udGVudDogJycgfSwgLi4uIF0gfS5cIik7XHJcblx0XHRcdFx0fVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRcdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG59KTtcclxuIiwiXHJcbnZhciBodG1sID0gXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcXG5cXHQ8bGFiZWw+PC9sYWJlbD5cXHJcXG5cXHQ8aW5wdXQgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgdHlwZT1cXFwidGV4dFxcXCIvPlxcclxcblxcdDxzcGFuIGNsYXNzPVxcXCJlcnJvciBoZWxwLWJsb2NrXFxcIj48L3NwYW4+XFxyXFxuXFx0PHNwYW4gY2xhc3M9XFxcIndhcm5pbmcgaGVscC1ibG9ja1xcXCI+PC9zcGFuPlxcclxcbjwvZGl2PlwiO1xyXG52YXIgYnJvd3NlckNoZWNrZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9icm93c2VyQ2hlY2tlci5qc1wiKTtcclxudmFyIGxvZ2dlciA9IHJlcXVpcmUoXCIuLy4uL3V0aWxzL2xvZ2dlci5qc1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldCBmaWVsZCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwiZmllbGRcIik7XHJcblx0fSxcclxuXHRzZXQgZmllbGQodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiZmllbGRcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCB2YWx1ZSgpIHtcclxuXHQgICAgcmV0dXJuICB0aGlzLmNvbnRlbnQuaW5wdXQudmFsdWU7XHJcblx0fSxcclxuXHRzZXQgdmFsdWUodmFsKSB7XHJcblx0XHRpZiAoIXZhbCkgdmFsID0gXCJcIjtcclxuXHRcdHRoaXMuY29udGVudC5pbnB1dC52YWx1ZSA9IHZhbDtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB2YWwpO1xyXG5cdH0sXHRcclxuXHRnZXQgcmVhZG9ubHkoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xyXG5cdH0sXHJcblx0c2V0IHJlYWRvbmx5KHZhbCkge1xyXG5cdFx0aWYgKHZhbCkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIHZhbCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0IHBsYWNlaG9sZGVyKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcclxuXHR9LFxyXG5cdHNldCBwbGFjZWhvbGRlcih2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCB2YWwpO1xyXG5cdH0sICAgIFxyXG5cdGdldCBsYWJlbCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcblx0fSxcclxuXHRzZXQgbGFiZWwodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgdmFsKTtcclxuXHR9LCAgICBcclxuXHRnZXQgZXJyb3IoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImVycm9yXCIpO1xyXG5cdH0sXHJcblx0c2V0IGVycm9yKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImVycm9yXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgd2FybmluZygpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwid2FybmluZ1wiKTtcclxuXHR9LFxyXG5cdHNldCB3YXJuaW5nKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcIndhcm5pbmdcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCByZXF1aXJlZCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKFwicmVxdWlyZWRcIik7XHJcblx0fSxcclxuXHRzZXQgcmVxdWlyZWQodmFsKSB7XHJcblx0XHRpZiAodmFsKSB7XHJcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKFwicmVxdWlyZWRcIiwgdmFsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKFwicmVxdWlyZWRcIik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXQgcmVxdWlyZWRNZXNzYWdlKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJyZXF1aXJlZC1tZXNzYWdlXCIpO1xyXG5cdH0sXHJcblx0c2V0IHJlcXVpcmVkTWVzc2FnZSh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJyZXF1aXJlZC1tZXNzYWdlXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgcmVnZXgoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcInJlZ2V4XCIpO1xyXG5cdH0sXHJcblx0c2V0IHJlZ2V4KHZhbCkge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoXCJyZWdleFwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHJlZ2V4TWVzc2FnZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwicmVnZXgtbWVzc2FnZVwiKTtcclxuXHR9LFxyXG5cdHNldCByZWdleE1lc3NhZ2UodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwicmVnZXgtbWVzc2FnZVwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IG1heExlbmd0aCgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwibWF4LWxlbmd0aFwiKTtcclxuXHR9LFxyXG5cdHNldCBtYXhMZW5ndGgodmFsKSB7XHJcblx0XHR0aGlzLnNldEF0dHJpYnV0ZShcIm1heC1sZW5ndGhcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCBtYXhMZW5ndGhNZXNzYWdlKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJtYXgtbGVuZ3RoLW1lc3NhZ2VcIik7XHJcblx0fSxcclxuXHRzZXQgbWF4TGVuZ3RoTWVzc2FnZSh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJtYXgtbGVuZ3RoLW1lc3NhZ2VcIiwgdmFsKTtcclxuXHR9LFx0XHJcblx0Z2V0IGZvcm1Hcm91cENsYXNzKCkge1xyXG5cdFx0aWYgKHRoaXMuZXJyb3IpIHtcclxuXHRcdFx0cmV0dXJuIFwiZm9ybS1ncm91cCBoYXMtZXJyb3JcIjtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy53YXJuaW5nKSB7XHJcblx0XHRcdHJldHVybiBcImZvcm0tZ3JvdXAgaGFzLXdhcm5pbmdcIjtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy52YWx1ZSkge1xyXG5cdFx0XHRyZXR1cm4gXCJmb3JtLWdyb3VwIGhhcy1zdWNjZXNzXCI7XHRcclxuXHRcdH1cclxuXHRcdHJldHVybiBcImZvcm0tZ3JvdXBcIjtcclxuXHR9LCAgICBcclxuXHRjcmVhdGVkQ2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHQgICAgc2VsZi5yZW5kZXIoKTtcclxuXHQgICAgc2VsZi52YWx1ZSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XHJcblx0ICAgIHNlbGYuZGF0YUJpbmQoKTtcclxuXHQgICAgc2VsZi5jb250ZW50LmZvcm1Hcm91cC5jbGFzc05hbWUgPSBcImZvcm0tZ3JvdXBcIjtcclxuXHQgICAgc2VsZi5vbmtleXVwID0gZnVuY3Rpb24gKGUpIHtcclxuXHQgICAgXHRzZWxmLnZhbGlkYXRlKCk7XHJcblx0ICAgIH07XHJcblx0ICAgIHNlbGYub25rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0c2VsZi52YWxpZGF0ZSgpO1xyXG5cdCAgICB9O1xyXG5cdH0sXHJcblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLmRhdGFCaW5kKCk7XHJcblx0fSxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuaW5uZXJIVE1MID0gaHRtbDtcclxuXHRcdHRoaXMuY29udGVudCA9IHsgXHJcblx0XHRcdGZvcm1Hcm91cDogdGhpcy5xdWVyeVNlbGVjdG9yKFwiLmZvcm0tZ3JvdXBcIiksXHJcblx0XHRcdGlucHV0OiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKSxcclxuXHRcdFx0bGFiZWw6IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpLFxyXG5cdFx0XHRlcnJvclNwYW46IHRoaXMucXVlcnlTZWxlY3RvcihcIi5lcnJvclwiKSxcclxuXHRcdFx0d2FybmluZ1NwYW46IHRoaXMucXVlcnlTZWxlY3RvcihcIi53YXJuaW5nXCIpLFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGRhdGFCaW5kOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuZmllbGQpIHtcclxuXHRcdFx0dmFyIG1lc3NhZ2UgPSBcclxuXHRcdFx0XHRcIlRhZyA8XCIgKyBcclxuXHRcdFx0XHR0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgKyBcclxuXHRcdFx0XHRcIj4gd2l0aG91dCAnZmllbGQnIGF0dHJpYnV0ZS4gXCIgK1xyXG5cdFx0XHRcdFwiVGhpcyB3aWxsIHByZXZlbnQgYSBjb3JyZWN0IGJlaGF2aW91ciBpbnNpZGUgPGZvcm0tYWpheD4gb3IgPGNvbGxlY3Rpb24tc2VhcmNoLWZvcm0+LlwiO1xyXG5cdFx0XHRsb2dnZXIud2FybihtZXNzYWdlKTtcdFx0XHRcclxuXHRcdH1cclxuXHJcblx0XHQvLyBMYWJlbCBCaW5kaW5nXHJcblx0XHR0aGlzLmNvbnRlbnQubGFiZWwuaHRtbEZvciA9IHRoaXMuZmllbGQ7XHJcblx0XHR0aGlzLmNvbnRlbnQubGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmxhYmVsO1xyXG5cclxuXHRcdC8vIElucHV0IEJpbmRpbmdcclxuXHRcdGlmICh0aGlzLmNvbnRlbnQuaW5wdXQudmFsdWUgIT0gdGhpcy52YWx1ZSkgdGhpcy5jb250ZW50LmlucHV0LnZhbHVlID0gdGhpcy52YWx1ZTtcclxuXHRcdHRoaXMuY29udGVudC5pbnB1dC5uYW1lID0gdGhpcy5maWVsZDtcclxuXHRcdHRoaXMuY29udGVudC5pbnB1dC5pZCA9IHRoaXMuZmllbGQ7XHJcblx0XHRpZighYnJvd3NlckNoZWNrZXIuaXNJZSgpKSB0aGlzLmNvbnRlbnQuaW5wdXQucGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyIHx8IFwiXCI7XHJcblxyXG5cdFx0aWYgKHRoaXMucmVhZG9ubHkpIHtcclxuXHRcdFx0dGhpcy5jb250ZW50LmlucHV0LnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIHRoaXMucmVhZG9ubHkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jb250ZW50LmlucHV0LnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEVycm9yIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC5lcnJvclNwYW4udGV4dENvbnRlbnQgPSB0aGlzLmVycm9yO1xyXG5cclxuXHRcdC8vIFdhcm5pbmcgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50Lndhcm5pbmdTcGFuLnRleHRDb250ZW50ID0gdGhpcy53YXJuaW5nO1xyXG5cclxuXHRcdC8vIEZvcm0gR3JvdXAgQmluZGluZ1xyXG5cdFx0dGhpcy5jb250ZW50LmZvcm1Hcm91cC5jbGFzc05hbWUgPSB0aGlzLmZvcm1Hcm91cENsYXNzO1xyXG5cdH0sXHJcblx0dmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZXJyb3IgPSBcIlwiO1xyXG5cdFx0dGhpcy53YXJuaW5nID0gXCJcIjtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMucmVxdWlyZWQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLnZhbHVlKSB7XHJcblx0XHRcdFx0dGhpcy5lcnJvciA9IHRoaXMucmVxdWlyZWRNZXNzYWdlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnJlZ2V4KSB7XHJcblx0XHRcdHZhciByZWd1bGFyRXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAodGhpcy5yZWdleCk7XHJcblx0XHRcdHZhciBpc01hdGNoaW5nID0gcmVndWxhckV4cHJlc3Npb24udGVzdCh0aGlzLnZhbHVlKTtcclxuXHRcdFx0aWYgKCFpc01hdGNoaW5nKSB7XHJcblx0XHRcdFx0dGhpcy5lcnJvciA9IHRoaXMucmVnZXhNZXNzYWdlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnZhbHVlICYmIHRoaXMubWF4TGVuZ3RoKSB7XHJcblx0XHRcdGlmICh0aGlzLnZhbHVlLnRyaW0oKS5sZW5ndGggPiB0aGlzLm1heExlbmd0aCkge1xyXG5cdFx0XHRcdHRoaXMuZXJyb3IgPSB0aGlzLm1heExlbmd0aE1lc3NhZ2U7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG59O1xyXG5cclxuIiwiXHJcbnZhciBodG1sID0gXCI8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcXG5cXHQ8bGFiZWw+PC9sYWJlbD5cXHJcXG5cXHQ8dGV4dGFyZWEgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCI+PC90ZXh0YXJlYT5cXHJcXG5cXHQ8c3BhbiBjbGFzcz1cXFwiZXJyb3IgaGVscC1ibG9ja1xcXCI+PC9zcGFuPlxcclxcblxcdDxzcGFuIGNsYXNzPVxcXCJ3YXJuaW5nIGhlbHAtYmxvY2tcXFwiPjwvc3Bhbj5cXHJcXG48L2Rpdj5cIjtcclxudmFyIGJyb3dzZXJDaGVja2VyID0gcmVxdWlyZShcIi4vLi4vdXRpbHMvYnJvd3NlckNoZWNrZXIuanNcIik7XHJcbnZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9sb2dnZXIuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXQgZmllbGQoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImZpZWxkXCIpO1xyXG5cdH0sXHJcblx0c2V0IGZpZWxkKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImZpZWxkXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgcm93cygpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwicm93c1wiKSB8fCAxO1xyXG5cdH0sXHJcblx0c2V0IHJvd3ModmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwicm93c1wiLCB2YWwpO1xyXG5cdH0sXHRcclxuXHRnZXQgdmFsdWUoKSB7XHJcblx0ICAgIHJldHVybiAgdGhpcy5jb250ZW50LnRleHRhcmVhLnZhbHVlO1xyXG5cdH0sXHJcblx0c2V0IHZhbHVlKHZhbCkge1xyXG5cdFx0aWYgKCF2YWwpIHZhbCA9IFwiXCI7XHJcblx0XHR0aGlzLmNvbnRlbnQudGV4dGFyZWEudmFsdWUgPSB2YWw7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdmFsKTtcclxuXHR9LFx0XHJcblx0Z2V0IHJlYWRvbmx5KCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcclxuXHR9LFxyXG5cdHNldCByZWFkb25seSh2YWwpIHtcclxuXHRcdGlmICh2YWwpIHtcclxuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB2YWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldCBwbGFjZWhvbGRlcigpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIik7XHJcblx0fSxcclxuXHRzZXQgcGxhY2Vob2xkZXIodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgdmFsKTtcclxuXHR9LCAgICBcclxuXHRnZXQgbGFiZWwoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG5cdH0sXHJcblx0c2V0IGxhYmVsKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIHZhbCk7XHJcblx0fSwgICAgXHJcblx0Z2V0IGVycm9yKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJlcnJvclwiKTtcclxuXHR9LFxyXG5cdHNldCBlcnJvcih2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJlcnJvclwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHdhcm5pbmcoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcIndhcm5pbmdcIik7XHJcblx0fSxcclxuXHRzZXQgd2FybmluZyh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ3YXJuaW5nXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgcmVxdWlyZWQoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShcInJlcXVpcmVkXCIpO1xyXG5cdH0sXHJcblx0c2V0IHJlcXVpcmVkKHZhbCkge1xyXG5cdFx0aWYgKHZhbCkge1xyXG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShcInJlcXVpcmVkXCIsIHZhbCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShcInJlcXVpcmVkXCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0IHJlcXVpcmVkTWVzc2FnZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwicmVxdWlyZWQtbWVzc2FnZVwiKTtcclxuXHR9LFxyXG5cdHNldCByZXF1aXJlZE1lc3NhZ2UodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwicmVxdWlyZWQtbWVzc2FnZVwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHJlZ2V4KCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJyZWdleFwiKTtcclxuXHR9LFxyXG5cdHNldCByZWdleCh2YWwpIHtcclxuXHRcdHRoaXMuc2V0QXR0cmlidXRlKFwicmVnZXhcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCByZWdleE1lc3NhZ2UoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcInJlZ2V4LW1lc3NhZ2VcIik7XHJcblx0fSxcclxuXHRzZXQgcmVnZXhNZXNzYWdlKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcInJlZ2V4LW1lc3NhZ2VcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCBtYXhMZW5ndGgoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcIm1heC1sZW5ndGhcIik7XHJcblx0fSxcclxuXHRzZXQgbWF4TGVuZ3RoKHZhbCkge1xyXG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoXCJtYXgtbGVuZ3RoXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgbWF4TGVuZ3RoTWVzc2FnZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwibWF4LWxlbmd0aC1tZXNzYWdlXCIpO1xyXG5cdH0sXHJcblx0c2V0IG1heExlbmd0aE1lc3NhZ2UodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibWF4LWxlbmd0aC1tZXNzYWdlXCIsIHZhbCk7XHJcblx0fSxcdFxyXG5cdGdldCBmb3JtR3JvdXBDbGFzcygpIHtcclxuXHRcdGlmICh0aGlzLmVycm9yKSB7XHJcblx0XHRcdHJldHVybiBcImZvcm0tZ3JvdXAgaGFzLWVycm9yXCI7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMud2FybmluZykge1xyXG5cdFx0XHRyZXR1cm4gXCJmb3JtLWdyb3VwIGhhcy13YXJuaW5nXCI7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMudmFsdWUpIHtcclxuXHRcdFx0cmV0dXJuIFwiZm9ybS1ncm91cCBoYXMtc3VjY2Vzc1wiO1x0XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gXCJmb3JtLWdyb3VwXCI7XHJcblx0fSwgIFxyXG5cdGNyZWF0ZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdCAgICBzZWxmLnJlbmRlcigpO1xyXG5cdCAgICBzZWxmLnZhbHVlID0gc2VsZi5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcclxuXHQgICAgc2VsZi5kYXRhQmluZCgpO1xyXG5cdCAgICBzZWxmLmNvbnRlbnQuZm9ybUdyb3VwLmNsYXNzTmFtZSA9IFwiZm9ybS1ncm91cFwiO1xyXG5cdCAgICBzZWxmLm9ua2V5dXAgPSBmdW5jdGlvbiAoZSkge1xyXG5cdCAgICBcdHNlbGYudmFsaWRhdGUoKTtcclxuXHQgICAgfTtcclxuXHQgICAgc2VsZi5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRzZWxmLnZhbGlkYXRlKCk7XHJcblx0ICAgIH07XHJcblx0fSxcclxuXHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZGF0YUJpbmQoKTtcclxuXHR9LFxyXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5pbm5lckhUTUwgPSBodG1sO1xyXG5cdFx0dGhpcy5jb250ZW50ID0geyBcclxuXHRcdFx0Zm9ybUdyb3VwOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS1ncm91cFwiKSxcclxuXHRcdFx0dGV4dGFyZWE6IHRoaXMucXVlcnlTZWxlY3RvcihcInRleHRhcmVhXCIpLFxyXG5cdFx0XHRsYWJlbDogdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIiksXHJcblx0XHRcdGVycm9yU3BhbjogdGhpcy5xdWVyeVNlbGVjdG9yKFwiLmVycm9yXCIpLFxyXG5cdFx0XHR3YXJuaW5nU3BhbjogdGhpcy5xdWVyeVNlbGVjdG9yKFwiLndhcm5pbmdcIiksXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0ZGF0YUJpbmQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICghdGhpcy5maWVsZCkge1xyXG5cdFx0XHR2YXIgbWVzc2FnZSA9IFxyXG5cdFx0XHRcdFwiVGFnIDxcIiArIFxyXG5cdFx0XHRcdHRoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKSArIFxyXG5cdFx0XHRcdFwiPiB3aXRob3V0ICdmaWVsZCcgYXR0cmlidXRlLiBcIiArXHJcblx0XHRcdFx0XCJUaGlzIHdpbGwgcHJldmVudCBhIGNvcnJlY3QgYmVoYXZpb3VyIGluc2lkZSA8Zm9ybS1hamF4PiBvciA8Y29sbGVjdGlvbi1zZWFyY2gtZm9ybT4uXCI7XHJcblx0XHRcdGxvZ2dlci53YXJuKG1lc3NhZ2UpO1x0XHRcdFxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIExhYmVsIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC5sYWJlbC5odG1sRm9yID0gdGhpcy5maWVsZDtcclxuXHRcdHRoaXMuY29udGVudC5sYWJlbC50ZXh0Q29udGVudCA9IHRoaXMubGFiZWw7XHJcblxyXG5cdFx0Ly8gSW5wdXQgQmluZGluZ1xyXG5cdFx0aWYgKHRoaXMuY29udGVudC50ZXh0YXJlYS52YWx1ZSAhPSB0aGlzLnZhbHVlKSB0aGlzLmNvbnRlbnQudGV4dGFyZWEudmFsdWUgPSB0aGlzLnZhbHVlO1xyXG5cdFx0dGhpcy5jb250ZW50LnRleHRhcmVhLm5hbWUgPSB0aGlzLmZpZWxkO1xyXG5cdFx0dGhpcy5jb250ZW50LnRleHRhcmVhLmlkID0gdGhpcy5maWVsZDtcclxuXHRcdHRoaXMuY29udGVudC50ZXh0YXJlYS5yb3dzID0gdGhpcy5yb3dzO1xyXG5cdFx0aWYoIWJyb3dzZXJDaGVja2VyLmlzSWUoKSkgdGhpcy5jb250ZW50LnRleHRhcmVhLnBsYWNlaG9sZGVyID0gdGhpcy5wbGFjZWhvbGRlciB8fCBcIlwiO1xyXG5cclxuXHRcdGlmICh0aGlzLnJlYWRvbmx5KSB7XHJcblx0XHRcdHRoaXMuY29udGVudC50ZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXCJyZWFkb25seVwiLCB0aGlzLnJlYWRvbmx5KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY29udGVudC50ZXh0YXJlYS5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBFcnJvciBCaW5kaW5nXHJcblx0XHR0aGlzLmNvbnRlbnQuZXJyb3JTcGFuLnRleHRDb250ZW50ID0gdGhpcy5lcnJvcjtcclxuXHJcblx0XHQvLyBXYXJuaW5nIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC53YXJuaW5nU3Bhbi50ZXh0Q29udGVudCA9IHRoaXMud2FybmluZztcclxuXHJcblx0XHQvLyBGb3JtIEdyb3VwIEJpbmRpbmdcclxuXHRcdHRoaXMuY29udGVudC5mb3JtR3JvdXAuY2xhc3NOYW1lID0gdGhpcy5mb3JtR3JvdXBDbGFzcztcclxuXHR9LFxyXG5cdHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLmVycm9yID0gXCJcIjtcclxuXHRcdHRoaXMud2FybmluZyA9IFwiXCI7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnJlcXVpcmVkKSB7XHJcblx0XHRcdGlmICghdGhpcy52YWx1ZSkge1xyXG5cdFx0XHRcdHRoaXMuZXJyb3IgPSB0aGlzLnJlcXVpcmVkTWVzc2FnZTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5yZWdleCkge1xyXG5cdFx0XHR2YXIgcmVndWxhckV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKHRoaXMucmVnZXgpO1xyXG5cdFx0XHR2YXIgaXNNYXRjaGluZyA9IHJlZ3VsYXJFeHByZXNzaW9uLnRlc3QodGhpcy52YWx1ZSk7XHJcblx0XHRcdGlmICghaXNNYXRjaGluZykge1xyXG5cdFx0XHRcdHRoaXMuZXJyb3IgPSB0aGlzLnJlZ2V4TWVzc2FnZTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy52YWx1ZSAmJiB0aGlzLm1heExlbmd0aCkge1xyXG5cdFx0XHRpZiAodGhpcy52YWx1ZS50cmltKCkubGVuZ3RoID4gdGhpcy5tYXhMZW5ndGgpIHtcclxuXHRcdFx0XHR0aGlzLmVycm9yID0gdGhpcy5tYXhMZW5ndGhNZXNzYWdlO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxufTtcclxuXHJcbiIsIlxyXG52YXIgaHRtbCA9IFwiPGRpdiBjbGFzcz1cXFwibW9kYWwgZmFkZVxcXCJyb2xlPVxcXCJkaWFsb2dcXFwiPlxcclxcbiAgPGRpdiBjbGFzcz1cXFwibW9kYWwtZGlhbG9nXFxcIj5cXHJcXG4gIFxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJtb2RhbC1jb250ZW50XFxcIj5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJtb2RhbC1oZWFkZXJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJjbG9zZVxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCI+JnRpbWVzOzwvYnV0dG9uPlxcclxcbiAgICAgICAgPGg0IGNsYXNzPVxcXCJtb2RhbC10aXRsZVxcXCI+Q29uZmlybWF0aW9uPC9oND5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5XFxcIj5cXHJcXG4gICAgICAgIDxwIGNsYXNzPVxcXCJtb2RhbC10ZXh0XFxcIj5BcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY29tcGxldGUgdGhpcyBvcGVyYXRpb24/PC9wPlxcclxcbiAgICAgIDwvZGl2PlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+XFxyXFxuICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdFxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCI+Tm88L2J1dHRvbj5cXHJcXG4gICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIj5ZZXM8L2J1dHRvbj5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIFxcclxcbiAgPC9kaXY+XFxyXFxuPC9kaXY+XCI7XHJcbnZhciBsb2dnZXIgPSByZXF1aXJlKFwiLi8uLi91dGlscy9sb2dnZXIuanNcIik7XHJcbnZhciBldmVudHMgPSByZXF1aXJlKFwiLi8uLi91dGlscy9ldmVudHMuanNcIik7XHJcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi8uLi91dGlscy9jb25zdGFudHMuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXQganF1ZXJ5KCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJqcXVlcnlcIik7XHJcblx0fSxcclxuXHRzZXQganF1ZXJ5KHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImpxdWVyeVwiLCB2YWwpO1xyXG5cdH0sXHJcblx0Z2V0IHllcygpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwieWVzXCIpO1xyXG5cdH0sXHJcblx0c2V0IHllcyh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ5ZXNcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCBubygpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwibm9cIik7XHJcblx0fSxcclxuXHRzZXQgbm8odmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibm9cIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCB0aXRsZSgpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwidGl0bGVcIik7XHJcblx0fSxcclxuXHRzZXQgdGl0bGUodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgdmFsKTtcclxuXHR9LFxyXG5cdGdldCBtZXNzYWdlKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJtZXNzYWdlXCIpO1xyXG5cdH0sXHJcblx0c2V0IG1lc3NhZ2UodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibWVzc2FnZVwiLCB2YWwpO1xyXG5cdH0sXHRcdFxyXG5cdGNyZWF0ZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5yZW5kZXIoKTtcclxuXHR9LFx0XHJcblx0YXR0YWNoZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5kYXRhQmluZCgpO1xyXG5cdH0sXHJcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLmlubmVySFRNTCA9IGh0bWw7XHJcblx0XHR0aGlzLmNvbnRlbnQgPSB7XHJcblx0XHRcdG1haW5Nb2RhbDogdGhpcy5xdWVyeVNlbGVjdG9yKFwiZGl2Lm1vZGFsXCIpLFxyXG5cdFx0XHRtb2RhbFRpdGxlOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJoNC5tb2RhbC10aXRsZVwiKSxcclxuXHRcdFx0bW9kYWxNZXNzYWdlOiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJwLm1vZGFsLXRleHRcIiksXHJcblx0XHRcdHllc0J1dHRvbjogdGhpcy5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uLmJ0bi5idG4tc3VjY2Vzc1wiKSxcclxuXHRcdFx0bm9CdXR0b246IHRoaXMucXVlcnlTZWxlY3RvcihcImJ1dHRvbi5idG4uYnRuLWRlZmF1bHRcIilcclxuXHRcdH07XHJcblx0fSxcclxuXHRkYXRhQmluZDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYodGhpcy5jb250ZW50Lm1vZGFsVGl0bGUpIHRoaXMuY29udGVudC5tb2RhbFRpdGxlLnRleHRDb250ZW50ID0gdGhpcy50aXRsZTtcclxuXHRcdGlmKHRoaXMuY29udGVudC5tb2RhbE1lc3NhZ2UpIHRoaXMuY29udGVudC5tb2RhbE1lc3NhZ2UudGV4dENvbnRlbnQgPSB0aGlzLm1lc3NhZ2U7XHJcblx0XHRpZih0aGlzLmNvbnRlbnQueWVzQnV0dG9uKSB0aGlzLmNvbnRlbnQueWVzQnV0dG9uLnRleHRDb250ZW50ID0gdGhpcy55ZXM7XHJcblx0XHRpZih0aGlzLmNvbnRlbnQubm9CdXR0b24pIHRoaXMuY29udGVudC5ub0J1dHRvbi50ZXh0Q29udGVudCA9IHRoaXMubm87XHJcblx0XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgJCA9IHNlbGYuZ2V0SnF1ZXJ5KCk7XHJcbiAgICAgICAgJChzZWxmKS5jaGlsZHJlbihcIi5tb2RhbFwiKS5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRldmVudHMucmFpc2Uoc2VsZiwgY29uc3RhbnRzLm9uTW9kYWxEaXNtaXNzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2VsZi5jb250ZW50Lnllc0J1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZXZlbnRzLnJhaXNlKHNlbGYsIGNvbnN0YW50cy5vbk1vZGFsQ29uZmlybWF0aW9uLCBlKTtcclxuICAgICAgICB9O1x0XHRcclxuXHR9LFxyXG5cdG9wZW46IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciAkID0gdGhpcy5nZXRKcXVlcnkoKTtcclxuXHRcdGlmICghJCkge1xyXG5cdFx0XHRsb2dnZXIud2FybihcIk5vIGpxdWVyeSBmb3VuZCBmb3IgPGNvbmZpcm1hdGlvbi1tb2RhbD4gb24gcHJvcGVydHkgJ1wiICsgdGhpcy5qcXVlcnkgKyBcIicuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0JCh0aGlzLmNvbnRlbnQubWFpbk1vZGFsKS5tb2RhbChcInNob3dcIik7XHJcblx0fSxcclxuXHRjbG9zZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyICQgPSB0aGlzLmdldEpxdWVyeSgpO1xyXG5cdFx0aWYgKCEkKSB7XHJcblx0XHRcdGxvZ2dlci53YXJuKFwiTm8ganF1ZXJ5IGZvdW5kIGZvciA8Y29uZmlybWF0aW9uLW1vZGFsPiBvbiBwcm9wZXJ0eSAnXCIgKyB0aGlzLmpxdWVyeSArIFwiJy5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbW9kYWwgPSB0aGlzLmNvbnRlbnQubWFpbk1vZGFsO1xyXG5cdFx0JChtb2RhbCkubW9kYWwoXCJoaWRlXCIpO1xyXG5cdH0sXHJcblx0Z2V0SnF1ZXJ5OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIXRoaXMuanF1ZXJ5KSB7XHJcblx0XHRcdGxvZ2dlci53YXJuKFwiTm8ganF1ZXJ5IGF0dHJpYnV0ZSBkZWZpbmVkIG9uIDxjb25maXJtYXRpb24tbW9kYWw+XCIpO1xyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciAkID0gd2luZG93W3RoaXMuanF1ZXJ5XTtcclxuXHRcdHJldHVybiAkO1xyXG5cdH0sXHJcblx0ZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xyXG5cdH1cclxufTtcclxuXHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldCB1cmwoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcInVybFwiKTtcclxuXHR9LFxyXG5cdHNldCB1cmwodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwidXJsXCIsIHZhbCk7XHJcblx0fSxcclxuXHRnZXQgZXJyb3JUYWcoKSB7XHJcblx0ICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImVycm9yVGFnXCIpO1xyXG5cdH0sXHJcblx0c2V0IGVycm9yVGFnKHZhbCkge1xyXG5cdCAgICB0aGlzLnNldEF0dHJpYnV0ZShcImVycm9yVGFnXCIsIHZhbCk7XHJcblx0fSxcdFx0XHJcblx0Z2V0IGxvYWRlclRhZygpIHtcclxuXHQgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwibG9hZGVyVGFnXCIpO1xyXG5cdH0sXHJcblx0c2V0IGxvYWRlclRhZyh2YWwpIHtcclxuXHQgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsb2FkZXJUYWdcIiwgdmFsKTtcclxuXHR9LFx0XHJcblx0Z2V0IGFqYXhTZXJ2aWNlKCkge1xyXG5cdCAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJhamF4LXNlcnZpY2VcIik7XHJcblx0fSxcclxuXHRzZXQgYWpheFNlcnZpY2UodmFsKSB7XHJcblx0ICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYWpheC1zZXJ2aWNlXCIsIHZhbCk7XHJcblx0fSwgIFx0XHJcblx0YXR0YWNoZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG5cdCAgICB0aGlzLnJlbmRlcigpO1xyXG5cdH0sXHJcblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLnJlbmRlcigpO1xyXG5cdH0sXHJcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgJCA9IHdpbmRvd1t0aGlzLmFqYXhTZXJ2aWNlXTtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHNlbGYuaW5uZXJIVE1MID0gXCJcIjtcclxuXHRcdHNlbGYucmVuZGVyTG9hZGVyKCk7XHJcblx0XHQkLmFqYXgoe1xyXG5cdFx0XHR1cmw6IHNlbGYudXJsLFxyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0c2VsZi5pbm5lckhUTUwgPSByZXN1bHQ7XHJcblx0XHRcdH0sXHJcblx0XHRcdGVycm9yOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c2VsZi5yZW5kZXJFcnJvcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG4gICAgZ2V0TG9hZGVyRWxlbWVudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5sb2FkZXJUYWcpIHtcclxuICAgICAgICAgICAgdmFyIGxvYWRlclRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICBsb2FkZXJUYWcudGV4dENvbnRlbnQgPSBcIkxvYWRpbmcuLi5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGxvYWRlclRhZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLmxvYWRlclRhZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldEVycm9yRWxlbWVudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5lcnJvclRhZykge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgIGVycm9yRWxlbWVudC50ZXh0Q29udGVudCA9IFwiQW4gZXJyb3IgaGFzIG9jY3VycmVkIGxvYWRpbmcgdGhlIGNvbnRlbnQuXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBlcnJvckVsZW1lbnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5lcnJvclRhZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgICAgICAgIFxyXG4gICAgcmVuZGVyRXJyb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZXJyb3JFbGVtZW50ID0gdGhpcy5nZXRFcnJvckVsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZXJyb3JFbGVtZW50KTtcclxuICAgIH0sXHJcbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbG9hZGVyVGFnID0gdGhpcy5nZXRMb2FkZXJFbGVtZW50KCk7XHJcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGxvYWRlclRhZyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpc0llOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgaXNJRSA9IC8qQGNjX29uIUAqL2ZhbHNlIHx8ICEhZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xyXG5cdFx0cmV0dXJuIGlzSUU7XHJcblx0fVxyXG59OyIsInZhciBldmVudHMgPSByZXF1aXJlKFwiLi8uLi91dGlscy9ldmVudHMuanNcIik7XHJcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi8uLi91dGlscy9jb25zdGFudHMuanNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0dmFyIG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNvbmZpcm1hdGlvbi1tb2RhbFwiKTtcclxuXHJcblx0bW9kYWwudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xyXG5cdG1vZGFsLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XHJcblx0bW9kYWwueWVzID0gb3B0aW9ucy55ZXM7XHJcblx0bW9kYWwubm8gPSBvcHRpb25zLm5vO1xyXG5cdG1vZGFsLmpxdWVyeSA9IG9wdGlvbnMuanF1ZXJ5IHx8IFwiJFwiO1xyXG5cclxuXHRpZiAoXyhvcHRpb25zLm9uQ29uZmlybWF0aW9uKS5pc0Z1bmN0aW9uKCkpIHtcclxuXHRcdGV2ZW50cy5hdHRhY2hMaXN0ZW5lcihtb2RhbCwgY29uc3RhbnRzLm9uTW9kYWxDb25maXJtYXRpb24sIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdG9wdGlvbnMub25Db25maXJtYXRpb24oZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmIChfKG9wdGlvbnMub25EaXNtaXNzKS5pc0Z1bmN0aW9uKCkpIHtcclxuXHRcdGV2ZW50cy5hdHRhY2hMaXN0ZW5lcihtb2RhbCwgY29uc3RhbnRzLm9uTW9kYWxEaXNtaXNzLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRvcHRpb25zLm9uRGlzbWlzcyhlKTtcclxuXHRcdFx0bW9kYWwuZGVzdHJveSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTtcclxuXHRtb2RhbC5vcGVuKCk7XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG5cdC8vIEV2ZW50c1xyXG5cdGJlZm9yZVZhbGlkYXRlOiBcImJlZm9yZS12YWxpZGF0ZVwiLFxyXG5cdG9uQ2xpZW50VmFsaWRhdGlvbkZhaWx1cmU6IFwib24tY2xpZW50LXZhbGlkYXRpb24tZmFpbHVyZVwiLFxyXG5cdG9uU2VydmVyVmFsaWRhdGlvbkZhaWx1cmU6IFwib24tc2VydmVyLXZhbGlkYXRpb24tZmFpbHVyZVwiLFxyXG5cdG9uU2VydmVyVmFsaWRhdGlvblN1Y2Nlc3M6IFwib24tc2VydmVyLXZhbGlkYXRpb24tc3VjY2Vzc1wiLFxyXG5cdGJlZm9yZVN1Ym1pdDogXCJiZWZvcmUtc3VibWl0XCIsXHJcblx0b25TdWJtaXRSZXNwb25zZTogXCJvbi1zdWJtaXQtcmVzcG9uc2VcIixcclxuXHRvblN1Ym1pdEVycm9yOiBcIm9uLXN1Ym1pdC1lcnJvclwiLFxyXG5cdGNsb2FraW5nQ2xhc3M6IFwiaW5pdGlhbC1jbG9ha1wiLFxyXG5cdG9uTW9kYWxEaXNtaXNzOiBcIm9uLW1vZGFsLWRpc21pc3NcIixcclxuXHRvbk1vZGFsQ29uZmlybWF0aW9uOiBcIm9uLW1vZGFsLWNvbmZpcm1hdGlvblwiLFxyXG59OyIsInZhciByZWdpc3RlckVsZW1lbnQgPSByZXF1aXJlKFwiLi9yZWdpc3RlckVsZW1lbnQuanNcIik7XHJcbnZhciBzYWZlRXh0ZW5kID0gcmVxdWlyZShcIi4vc2FmZUV4dGVuZC5qc1wiKTtcclxudmFyIHRhZ1Byb3RvdHlwZXMgPSByZXF1aXJlKFwiLi90YWctcHJvdG90eXBlcy5qc1wiKTtcclxuXHJcbnZhciBnZXRUYWdQcm90b3R5cGUgPSBmdW5jdGlvbiAodGFnTmFtZSkge1xyXG5cdHZhciBwcm90byA9IHRhZ1Byb3RvdHlwZXMuZ2V0UHJvdG90eXBlKHRhZ05hbWUpO1xyXG5cdGlmICghcHJvdG8pIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIGEgcHJvdG90eXBlIGZvciB0YWcgPFwiICsgdGFnTmFtZSArIFwiPlwiKTtcclxuXHR9XHJcblx0cmV0dXJuIHByb3RvO1xyXG59O1xyXG5cclxudmFyIENyZWF0ZVRhZ1N0YXRlbWVudCA9IGZ1bmN0aW9uICh0YWdOYW1lKSB7XHJcblx0dGhpcy50YWdOYW1lID0gdGFnTmFtZTtcclxuXHJcblx0dGhpcy5mcm9tID0gZnVuY3Rpb24gKGVsZW1lbnRQcm90b3R5cGUpIHtcclxuXHRcdHJldHVybiByZWdpc3RlckVsZW1lbnQodGhpcy50YWdOYW1lLCBlbGVtZW50UHJvdG90eXBlKTtcclxuXHR9O1xyXG5cclxuXHR0aGlzLmV4dGVuZGluZyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xyXG5cdFx0dmFyIGJhc2VFbGVtZW50UHJvdG90eXBlID0gXyhhcmd1bWVudCkuaXNTdHJpbmcoKSA/IGdldFRhZ1Byb3RvdHlwZShhcmd1bWVudCkgOiBhcmd1bWVudDtcclxuXHRcdHZhciBleHRlbmRpbmdTdGF0ZW1lbnQgPSBuZXcgRXh0ZW5kaW5nU3RhdGVtZW50KHRoaXMudGFnTmFtZSwgYmFzZUVsZW1lbnRQcm90b3R5cGUpO1xyXG5cdFx0cmV0dXJuIGV4dGVuZGluZ1N0YXRlbWVudDtcclxuXHR9O1xyXG59O1xyXG5cclxudmFyIEV4dGVuZGluZ1N0YXRlbWVudCA9IGZ1bmN0aW9uICh0YWdOYW1lLCBiYXNlRWxlbWVudFByb3RvdHlwZSkge1xyXG5cdHRoaXMudGFnTmFtZSA9IHRhZ05hbWU7XHJcblx0dGhpcy5iYXNlRWxlbWVudFByb3RvdHlwZSA9IGJhc2VFbGVtZW50UHJvdG90eXBlO1xyXG5cclxuXHR0aGlzLmZyb20gPSBmdW5jdGlvbiAoZWxlbWVudFByb3RvdHlwZSkge1xyXG5cdFx0dmFyIHByb3RvID0gc2FmZUV4dGVuZCh0aGlzLmJhc2VFbGVtZW50UHJvdG90eXBlLCBlbGVtZW50UHJvdG90eXBlKTtcclxuXHRcdHJldHVybiByZWdpc3RlckVsZW1lbnQodGhpcy50YWdOYW1lLCBwcm90byk7XHJcblx0fTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcclxuXHR2YXIgY3JlYXRlVGFnU3RhdGVtZW50ID0gbmV3IENyZWF0ZVRhZ1N0YXRlbWVudCh0YWdOYW1lKTtcclxuXHRyZXR1cm4gY3JlYXRlVGFnU3RhdGVtZW50O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbnB1dFRleHQ6IHJlcXVpcmUoXCIuLy4uL2lucHV0L2lucHV0LXRleHQuanNcIiksXHJcblx0aW5wdXRDaGVja2JveDogcmVxdWlyZShcIi4vLi4vaW5wdXQvaW5wdXQtY2hlY2tib3guanNcIiksXHJcblx0aW5wdXRUZXh0YXJlYTogcmVxdWlyZShcIi4vLi4vaW5wdXQvaW5wdXQtdGV4dGFyZWEuanNcIiksXHJcblx0aW5wdXRSYWRpbzogcmVxdWlyZShcIi4vLi4vaW5wdXQvaW5wdXQtcmFkaW8uanNcIiksXHJcblx0aW5wdXRSYWRpb0dyb3VwOiByZXF1aXJlKFwiLi8uLi9pbnB1dC9pbnB1dC1yYWRpby1ncm91cC5qc1wiKSxcclxuXHRpbnB1dFNlbGVjdDogcmVxdWlyZShcIi4vLi4vaW5wdXQvaW5wdXQtc2VsZWN0LmpzXCIpLFxyXG5cdHBhcnRpYWxBamF4OiByZXF1aXJlKFwiLi8uLi9taXNjL3BhcnRpYWwtYWpheC5qc1wiKSxcclxuXHRmb3JtQWpheDogcmVxdWlyZShcIi4vLi4vZm9ybS9mb3JtLWFqYXguanNcIiksXHJcblx0Y29uZmlybWF0aW9uTW9kYWw6IHJlcXVpcmUoXCIuLy4uL21pc2MvY29uZmlybWF0aW9uLW1vZGFsLmpzXCIpLFxyXG5cdGNvbGxlY3Rpb25TZWFyY2hGb3JtOiByZXF1aXJlKFwiLi8uLi9jb2xsZWN0aW9uL2NvbGxlY3Rpb24tc2VhcmNoLWZvcm0uanNcIiksXHJcblx0Y29sbGVjdGlvbkVsZW1lbnRzOiByZXF1aXJlKFwiLi8uLi9jb2xsZWN0aW9uL2NvbGxlY3Rpb24tZWxlbWVudHMuanNcIiksXHJcblx0Y29sbGVjdGlvbkNvbnRhaW5lcjogcmVxdWlyZShcIi4vLi4vY29sbGVjdGlvbi9jb2xsZWN0aW9uLWNvbnRhaW5lci5qc1wiKSxcclxuXHRmZWVkYmFja1Rva2VuOiByZXF1aXJlKFwiLi8uLi9jb2xsZWN0aW9uL2ZlZWRiYWNrLXRva2VuLmpzXCIpLFxyXG5cdG51bWJlck9mUmVzdWx0czogcmVxdWlyZShcIi4vLi4vY29sbGVjdGlvbi9udW1iZXItb2YtcmVzdWx0cy5qc1wiKVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHJhaXNlOiBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnROYW1lLCBvYmopIHtcclxuXHRcdGlmICghZXZlbnROYW1lKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk5vdCB2YWxpZCBldmVudCBuYW1lXCIpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSk7XHJcblx0XHRldmVudC5jb250ZW50ID0gb2JqO1xyXG5cdFx0ZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuXHR9LFxyXG5cdGF0dGFjaExpc3RlbmVyOiBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaykge1xyXG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcclxuXHR9XHJcbn07IiwiLy8gQ29weSBhbGwgb2YgdGhlIHByb3BlcnRpZXMgaW4gdGhlIHNvdXJjZSBvYmplY3RzXHJcbi8vIG92ZXIgdG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdCwgXHJcbi8vIGFuZCByZXR1cm4gdGhlIGRlc3RpbmF0aW9uIG9iamVjdC4gXHJcbi8vIEl0J3MgaW4tb3JkZXIsIHNvIHRoZSBsYXN0IHNvdXJjZSB3aWxsIG92ZXJyaWRlIFxyXG4vLyBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIG5hbWUgaW4gcHJldmlvdXMgYXJndW1lbnRzLlxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkZXN0aW5hdGlvbiwgc291cmNlKSB7XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xyXG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3ApO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXN0aW5hdGlvbiwgcHJvcCwgZGVzY3JpcHRvcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVzdGluYXRpb247XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0ZGlzYWJsZTogZmFsc2UsXHJcblx0bG9nOiBmdW5jdGlvbiAodGV4dCkge1xyXG5cdFx0aWYgKCF0aGlzLmRpc2FibGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2codGV4dCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHR3YXJuOiBmdW5jdGlvbiAodGV4dCkge1xyXG5cdFx0aWYgKCF0aGlzLmRpc2FibGUpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKHRleHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4vZXh0ZW5kLmpzXCIpO1xyXG52YXIgdGFnUHJvdG90eXBlcyA9IHJlcXVpcmUoXCIuL3RhZy1wcm90b3R5cGVzLmpzXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFnTmFtZSwgZWxlbWVudCkge1xyXG4gICAgdmFyIGVsZW1lbnRQcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSk7XHJcblxyXG4gICAgdmFyIHByb3RvID0gZXh0ZW5kKGVsZW1lbnRQcm90b3R5cGUsIGVsZW1lbnQpO1xyXG5cclxuICAgIHRhZ1Byb3RvdHlwZXMuYWRkUHJvdG90eXBlKHRhZ05hbWUsIGVsZW1lbnRQcm90b3R5cGUpO1xyXG4gICAgdmFyIGh0bWxFbGVtZW50ID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KHRhZ05hbWUsIHtcclxuICAgICAgICBwcm90b3R5cGU6IGVsZW1lbnRQcm90b3R5cGVcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBodG1sRWxlbWVudDtcclxufTsiLCIvLyBDb3B5IGFsbCBvZiB0aGUgcHJvcGVydGllcyBpbiB0aGUgc291cmNlIG9iamVjdHNcclxuLy8gb3ZlciB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LCBcclxuLy8gYW5kIHJldHVybiB0aGUgZGVzdGluYXRpb24gb2JqZWN0LiBcclxuLy8gSXQncyBpbi1vcmRlciwgc28gdGhlIGxhc3Qgc291cmNlIHdpbGwgb3ZlcnJpZGUgXHJcbi8vIHByb3BlcnRpZXMgb2YgdGhlIHNhbWUgbmFtZSBpbiBwcmV2aW91cyBhcmd1bWVudHMuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcclxuXHR2YXIgY2xvbmVkRGVzdGluYXRpb24gPSB7fTtcclxuXHJcbiAgICBmb3IgKHZhciBwcm9wMSBpbiBkZXN0aW5hdGlvbikge1xyXG4gICAgICAgIHZhciBkZXNjcmlwdG9yMSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZGVzdGluYXRpb24sIHByb3AxKTtcclxuICAgICAgICBpZihkZXNjcmlwdG9yMSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNsb25lZERlc3RpbmF0aW9uLCBwcm9wMSwgZGVzY3JpcHRvcjEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIHByb3AyIGluIHNvdXJjZSkge1xyXG5cdFx0dmFyIGRlc2NyaXB0b3IyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3AyKTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjbG9uZWREZXN0aW5hdGlvbiwgcHJvcDIsIGRlc2NyaXB0b3IyKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9uZWREZXN0aW5hdGlvbi5zdXBlciA9IGRlc3RpbmF0aW9uO1xyXG4gICAgcmV0dXJuIGNsb25lZERlc3RpbmF0aW9uO1xyXG59O1xyXG5cclxudmFyIGNsb25lT2JqZWN0ID0gZnVuY3Rpb24gKHNvdXJjZSkge1xyXG4gICAgdmFyIGtleSx2YWx1ZTtcclxuICAgIHZhciBjbG9uZSA9IE9iamVjdC5jcmVhdGUoc291cmNlKTtcclxuXHJcbiAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSBzb3VyY2Vba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgIGNsb25lW2tleV0gPSBjbG9uZU9iamVjdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjbG9uZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xvbmU7XHJcbn07XHJcblxyXG4iLCJ2YXIgdGFnUHJvdG90eXBlcyA9IHt9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0YWRkUHJvdG90eXBlOiBmdW5jdGlvbiAodGFnTmFtZSwgcHJvdG8pIHtcclxuXHRcdHRhZ1Byb3RvdHlwZXNbdGFnTmFtZV0gPSBwcm90bztcclxuXHR9LFxyXG5cdGdldFByb3RvdHlwZTogZnVuY3Rpb24gKHRhZ05hbWUpIHtcclxuXHRcdHJldHVybiB0YWdQcm90b3R5cGVzW3RhZ05hbWVdO1xyXG5cdH1cclxufTsiXX0=

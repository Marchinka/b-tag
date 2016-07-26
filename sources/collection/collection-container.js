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

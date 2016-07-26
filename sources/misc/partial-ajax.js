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


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
(function(currentDocument) {

	window.testHelpers = {
		createElement: function (tagName, attributes) {
			var element = document.createElement(tagName);
			if (attributes) {
				for (var prop in attributes) {
					element[prop] = attributes[prop];
				}
			}
			return element;
		},
		isIe: function () {
			var isIE = /*@cc_on!@*/false || !!document.documentMode;
			return isIE;
		},
		delay : function (time) {
			var d1 = new Date();
  			var d2 = new Date();
  			while (d2.valueOf() < d1.valueOf() + time) {
    			d2 = new Date();
  			}
		}		
	}

})(document);
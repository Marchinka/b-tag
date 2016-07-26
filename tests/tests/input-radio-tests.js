(function(currentDocument) {
	describe("<input-radio/>", function() {
		describe("is rendered with inner <input/>", function () {
		    it("in its inner content", function() {
				// SETUP
				var element = testHelpers.createElement("input-radio");

				// EXERCISE
				var innerInput = element.querySelector("input");

				// ASSERT
				expect(innerInput).not.null;
			});

		    it("with 'name' attribute equal to main tag 'field' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-radio");
				var attributeValue = "field name"
				element.setAttribute("field", attributeValue);

				// EXERCISE
				var innerInput = element.querySelector("input");

				// ASSERT
				expect(innerInput.name).to.equal(attributeValue);
			});

		    it("without 'readonly' attribute if main tag does not have 'readonly' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-radio");
				element.readonly = false;

				// EXERCISE
				var innerInput = element.querySelector("input");

				// ASSERT
				expect(innerInput.hasAttribute("readonly")).to.be.false;
			});

		    it("with 'readonly' attribute if main tag has 'readonly' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-radio");
				element.readonly = true;

				// EXERCISE
				var innerInput = element.querySelector("input");

				// ASSERT
				expect(innerInput.hasAttribute("disabled")).to.be.true;
			});
		});

		describe("is rendered with inner <label/>", function () {
		    it("in its inner content", function() {
				// SETUP
				var element = testHelpers.createElement("input-radio");

				// EXERCISE
				var label = element.querySelector("label");

				// ASSERT
				expect(label).not.null;
			});
		    
		    it("with text content equal to main tag 'label' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-radio");
				var attributeValue = "attribute value"
				element.setAttribute("label", attributeValue);

				// EXERCISE
				var label = element.querySelector("label");

				// ASSERT
				expect(label.textContent).to.contain(attributeValue);
			});
		});			
	});
})(document);
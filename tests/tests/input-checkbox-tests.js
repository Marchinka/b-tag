(function(currentDocument) {
	describe("<input-checkbox/>", function() {
		describe("is rendered with inner <input/>", function () {
			baseTests.input(currentDocument, "input-checkbox");

		    it("with 'value' attribute equal to main tag 'value' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-checkbox");
				element.value = true;

				// EXERCISE
				var innerInput = element.querySelector("input");

				// ASSERT
				expect(innerInput.value).to.equal("true");
				expect(innerInput.value).to.equal(innerInput.value);
			});				
		});

		describe("is rendered with inner <label/>", function () {
			baseTests.label(currentDocument, "input-checkbox");
		});		

		describe("is rendered with inner .error help-block", function () {
			baseTests.error(currentDocument, "input-checkbox");
		});		

		describe("is rendered with inner .warning help-block", function () {
			baseTests.warning(currentDocument, "input-checkbox");
		});			

		describe("is rendered with inner .form-group", function () {
			baseTests.formGroup(currentDocument, "input-checkbox");
		});				
	});
})(document);
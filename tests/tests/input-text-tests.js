(function(currentDocument) {
	describe("<input-text/>", function() {
		describe("is rendered with inner <input/>", function () {
			baseTests.input(currentDocument, "input-text");

		    it("with 'value' attribute equal to main tag 'value' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-text");
				var attributeValue = "field value"
				element.value = attributeValue;

				// EXERCISE
				var innerInput = element.querySelector("input");

				// ASSERT
				expect(innerInput.value).to.equal(attributeValue);
				expect(innerInput.value).to.equal(innerInput.value);
			});	

		    it("with 'placeholder' attribute equal to main tag 'placeholder' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-text");
				var attributeValue = "placeholder name"
				element.setAttribute("placeholder", attributeValue);

				// EXERCISE
				var innerInput = element.querySelector("input");

				// ASSERT
				if (!testHelpers.isIe()) {
					expect(innerInput.placeholder).to.equal(attributeValue);
				}
			});			
		});

		describe("is rendered with inner <label/>", function () {
			baseTests.label(currentDocument, "input-text");
		});		

		describe("is rendered with inner .error help-block", function () {
			baseTests.error(currentDocument, "input-text");
		});		

		describe("is rendered with inner .warning help-block", function () {
			baseTests.warning(currentDocument, "input-text");
		});			

		describe("is rendered with inner .form-group", function () {
			baseTests.formGroup(currentDocument, "input-text");
		});	

		describe("with 'required' attribute", function () {
			describe("validate method", function () {
			    it("returns true if value is populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-text");
					element.value = "field value";
					element.required = true;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns false if value is not populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-text");
					element.value = "";
					element.required = true;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.false;
				});				
			});			
		});

		describe("without 'required' attribute", function () {
			describe("validate method", function () {
			    it("returns true if value is populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-text");
					element.value = "field value";
					element.required = false;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns true if value is not populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-text");
					element.value = "";
					element.required = false;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});	
			});
		});

		describe("with 'regex' attribute", function () {
			describe("validate method", function () {
			    it("returns true if value matches the regex", function() {
					// SETUP
					var element = testHelpers.createElement("input-text");
					element.value = "12234455";
					element.regex = "4";

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns false if value does not match the regex", function() {
					// SETUP
					var element = testHelpers.createElement("input-text");
					element.value = "ffff";
					element.regex = "4";

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.false;
				});				
			});
		});

		describe("with 'maxLength' attribute", function () {
			describe("validate method", function () {
			    it("returns true if value is in the limit", function() {
					// SETUP
					var element = testHelpers.createElement("input-text");
					element.value = "tre";
					element.maxLength = "4";

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns false if value is not in the limit", function() {
					// SETUP
					var element = testHelpers.createElement("input-text");
					element.value = "sedici";
					element.maxLength = "4";

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.false;
				});				
			});
		});				
	});
})(document);
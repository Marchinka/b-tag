(function(currentDocument) {
	describe("<input-textarea/>", function() {
		describe("is renderd with inner <textarea/>", function () {
		    it("in its inner content", function() {
				// SETUP
				var element = testHelpers.createElement("input-textarea");

				// EXERCISE
				var innerInput = element.querySelector("textarea");

				// ASSERT
				expect(innerInput).not.null;
			});

		    it("with 'name' attribute equal to main tag 'field' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-textarea");
				var attributeValue = "field name"
				element.setAttribute("field", attributeValue);

				// EXERCISE
				var innerInput = element.querySelector("textarea");

				// ASSERT
				expect(innerInput.name).to.equal(attributeValue);
			});

		    it("with 'id' attribute equal to main tag 'field' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-textarea");
				var attributeValue = "field name"
				element.setAttribute("field", attributeValue);

				// EXERCISE
				var innerInput = element.querySelector("textarea");

				// ASSERT
				expect(innerInput.id).to.equal(attributeValue);
			});

		    it("without 'readonly' attribute if main tag does not have 'readonly' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-textarea");
				element.readonly = false;

				// EXERCISE
				var innerInput = element.querySelector("textarea");

				// ASSERT
				expect(innerInput.hasAttribute("readonly")).to.be.false;
			});

		    it("with 'readonly' attribute if main tag has 'readonly' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-textarea");
				element.readonly = true;

				// EXERCISE
				var innerInput = element.querySelector("textarea");

				// ASSERT
				expect(innerInput.hasAttribute("readonly")).to.be.true;
			});
		});

		describe("is rendered with inner <label/>", function () {
			baseTests.label(currentDocument, "input-textarea");
		});		

		describe("is rendered with inner .error help-block", function () {
			baseTests.error(currentDocument, "input-textarea");
		});		

		describe("is rendered with inner .warning help-block", function () {
			baseTests.warning(currentDocument, "input-textarea");
		});			

		describe("is rendered with inner .form-group", function () {
			baseTests.formGroup(currentDocument, "input-textarea");
		});	

		describe("with 'required' attribute", function () {
			describe("validate method", function () {
			    it("returns true if value is populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-textarea");
					element.value = "field value";
					element.required = true;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns false if value is not populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-textarea");
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
					var element = testHelpers.createElement("input-textarea");
					element.value = "field value";
					element.required = false;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns true if value is not populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-textarea");
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
					var element = testHelpers.createElement("input-textarea");
					element.value = "12234455";
					element.regex = "4";

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns false if value does not match the regex", function() {
					// SETUP
					var element = testHelpers.createElement("input-textarea");
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
					var element = testHelpers.createElement("input-textarea");
					element.value = "tre";
					element.maxLength = "4";

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns false if value is not in the limit", function() {
					// SETUP
					var element = testHelpers.createElement("input-textarea");
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
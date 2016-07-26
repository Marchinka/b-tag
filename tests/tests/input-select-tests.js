(function(currentDocument) {
	describe("<input-select/>", function() {
		describe("is rendered with inner <select/>", function () {
		    it("in its inner content", function() {
				// SETUP
				var element = testHelpers.createElement("input-select");

				// EXERCISE
				var innerInput = element.querySelector("select");

				// ASSERT
				expect(innerInput).not.null;
			});

		    it("with 'name' attribute equal to main tag 'field' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-select");
				var attributeValue = "field name"
				element.setAttribute("field", attributeValue);

				// EXERCISE
				var innerInput = element.querySelector("select");

				// ASSERT
				expect(innerInput.name).to.equal(attributeValue);
			});

		    it("with 'id' attribute equal to main tag 'field' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-select");
				var attributeValue = "field name"
				element.setAttribute("field", attributeValue);

				// EXERCISE
				var innerInput = element.querySelector("select");

				// ASSERT
				expect(innerInput.id).to.equal(attributeValue);
			});

		    it("without 'readonly' attribute if main tag does not have 'readonly' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-select");
				element.readonly = false;

				// EXERCISE
				var innerInput = element.querySelector("select");

				// ASSERT
				expect(innerInput.hasAttribute("readonly")).to.be.false;
			});

		    it("with 'readonly' attribute if main tag has 'readonly' attribute", function() {
				// SETUP
				var element = testHelpers.createElement("input-select");
				element.readonly = true;

				// EXERCISE
				var innerInput = element.querySelector("select");

				// ASSERT
				expect(innerInput.hasAttribute("readonly")).to.be.true;
			});
		});

		describe("is rendered with inner <label/>", function () {
			baseTests.label(currentDocument, "input-select");
		});		

		describe("is rendered with inner .error help-block", function () {
			baseTests.error(currentDocument, "input-select");
		});		

		describe("is rendered with inner .warning help-block", function () {
			baseTests.warning(currentDocument, "input-select");
		});			

		describe("is rendered with inner .form-group", function () {
			baseTests.formGroup(currentDocument, "input-select");
		});	

		describe("with 'required' attribute", function () {
			describe("validate method", function () {
			    it("returns true if value is populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-select");
					var option = testHelpers.createElement("option");
					option.value = 1;
					option.textContent = "Option";
					element.appendChild(option);					
					element.value = 1;
					element.required = true;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns false if value is not populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-select");
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
					var element = testHelpers.createElement("input-select");
					var option = testHelpers.createElement("option");
					option.value = 1;
					option.textContent = "Option";
					element.appendChild(option);
					element.value = 1;
					element.required = false;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns true if value is not populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-select");
					element.value = "";
					element.required = false;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});	
			});
		});			
	});
})(document);
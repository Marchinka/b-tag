(function(currentDocument) {
	describe("<input-radio-group/>", function() {
		describe("with inner <input-radio/>", function() {
			describe("value property", function() {
			    it("returns the value of the checked radio", function() {
					// SETUP
					var radioInput = testHelpers.createElement("input-radio", { 
						value: "option",
						checked: true 
					});
					var radioGroup = testHelpers.createElement("input-radio-group", { 
						field: "radioElement" 
					});
					radioGroup.appendChild(radioInput);

					// EXERCISE
					var value = radioGroup.value;

					// ASSERT
					expect(value).to.be.equal("option");
				});
			});
		});

		describe("is rendered with inner <label/>", function () {
			baseTests.label(currentDocument, "input-radio-group");
		});		

		describe("is rendered with inner .error help-block", function () {
			baseTests.error(currentDocument, "input-radio-group");
		});		

		describe("is rendered with inner .warning help-block", function () {
			baseTests.warning(currentDocument, "input-radio-group");
		});			

		describe("is rendered with inner .form-group", function () {
			baseTests.formGroup(currentDocument, "input-radio-group");
		});	

		describe("with 'required' attribute", function () {
			describe("validate method", function () {
			    it("returns true if value is populated", function() {
					// SETUP
					var radioInput = testHelpers.createElement("input-radio", { 
						value: "option",
						checked: true 
					});
					var radioGroup = testHelpers.createElement("input-radio-group", { 
						field: "radioElement",
						required: "true"
					});
					radioGroup.appendChild(radioInput);

					// EXERCISE
					var validationResult = radioGroup.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns false if value is not populated", function() {
					// SETUP
					// SETUP
					var radioInput = testHelpers.createElement("input-radio", { 
						value: "option",
						checked: false 
					});
					var radioGroup = testHelpers.createElement("input-radio-group", { 
						field: "radioElement",
						required: "true"
					});
					radioGroup.appendChild(radioInput);

					// EXERCISE
					var validationResult = radioGroup.validate();

					// ASSERT
					expect(validationResult).to.be.false;
				});				
			});			
		});

		describe("without 'required' attribute", function () {
			describe("validate method", function () {
			    it("returns true if value is populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-radio-group");
					element.value = "field value";
					element.required = false;

					// EXERCISE
					var validationResult = element.validate();

					// ASSERT
					expect(validationResult).to.be.true;
				});

			    it("returns true if value is not populated", function() {
					// SETUP
					var element = testHelpers.createElement("input-radio-group");
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
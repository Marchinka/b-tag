var baseInputTests = function (document, tag) {

    it("in its inner content", function() {
		// SETUP
		var element = testHelpers.createElement(tag);

		// EXERCISE
		var innerInput = element.querySelector("input");

		// ASSERT
		expect(innerInput).not.null;
	});

    it("with 'name' attribute equal to main tag 'field' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "field name"
		element.setAttribute("field", attributeValue);

		// EXERCISE
		var innerInput = element.querySelector("input");

		// ASSERT
		expect(innerInput.name).to.equal(attributeValue);
	});

    it("with 'id' attribute equal to main tag 'field' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "field name"
		element.setAttribute("field", attributeValue);

		// EXERCISE
		var innerInput = element.querySelector("input");

		// ASSERT
		expect(innerInput.id).to.equal(attributeValue);
	});

    it("without 'readonly' attribute if main tag does not have 'readonly' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		element.readonly = false;

		// EXERCISE
		var innerInput = element.querySelector("input");

		// ASSERT
		expect(innerInput.hasAttribute("readonly")).to.be.false;
	});

    it("with 'readonly' attribute if main tag has 'readonly' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		element.readonly = true;

		// EXERCISE
		var innerInput = element.querySelector("input");

		// ASSERT
		expect(innerInput.hasAttribute("readonly")).to.be.true;
	});
};

var baseLabelTests = function (document, tag) {
    it("in its inner content", function() {
		// SETUP
		var element = testHelpers.createElement(tag);

		// EXERCISE
		var label = element.querySelector("label");

		// ASSERT
		expect(label).not.null;
	});

    it("with 'for' attribute equal to main tag 'field' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "field name"
		element.setAttribute("field", attributeValue);

		// EXERCISE
		var label = element.querySelector("label");

		// ASSERT
		expect(label.htmlFor).to.equal(attributeValue);
	});

    it("with text content equal to main tag 'label' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "attribute value"
		element.setAttribute("label", attributeValue);

		// EXERCISE
		var label = element.querySelector("label");

		// ASSERT
		expect(label.textContent).to.contain(attributeValue);
	});	
};

var baseErrorTests = function (document, tag) {
    
    it("in its inner content", function() {
		// SETUP
		var element = testHelpers.createElement(tag);

		// EXERCISE
		var errorSpan = element.querySelector(".error.help-block");

		// ASSERT
		expect(errorSpan).not.null;
	});

    it("with text content equal to main tag 'error' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "attribute value"
		element.setAttribute("error", attributeValue);

		// EXERCISE
		var errorSpan = element.querySelector(".error.help-block");

		// ASSERT
		expect(errorSpan.textContent).to.be.equal(attributeValue);
	});	
};

var baseWarningTests = function (document, tag) {
    
    it("in its inner content", function() {
		// SETUP
		var element = testHelpers.createElement(tag);

		// EXERCISE
		var warningSpan = element.querySelector(".warning.help-block");

		// ASSERT
		expect(warningSpan).not.null;
	});

    it("with text content equal to main tag 'warning' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "attribute value"
		element.setAttribute("warning", attributeValue);

		// EXERCISE
		var warningSpan = element.querySelector(".warning.help-block");

		// ASSERT
		expect(warningSpan.textContent).to.be.equal(attributeValue);
	});	
};

var baseFormGroupTests = function (document, tag) {
    
    it("in its inner content", function() {
		// SETUP
		var element = testHelpers.createElement(tag);

		// EXERCISE
		var warningSpan = element.querySelector(".form-group");

		// ASSERT
		expect(warningSpan).not.null;
	});

    it("has not 'has-error' nor 'has-warning' class if main tag has no 'error' or 'warning' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);

		// EXERCISE
		var errorDiv = element.querySelector(".form-group.has-error");
		var warningDiv = element.querySelector(".form-group.has-warning");

		// ASSERT
		expect(errorDiv).null;
		expect(warningDiv).null;
	});

    it("has 'has-error' class if main tag has 'error' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "attribute value"
		element.setAttribute("error", attributeValue);

		// EXERCISE
		var errorDiv = element.querySelector(".form-group.has-error");
		var warningDiv = element.querySelector(".form-group.has-warning");

		// ASSERT
		expect(errorDiv).not.null;
		expect(warningDiv).null;
	});

    it("has 'has-warning' class if main tag has 'warning' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "attribute value"
		element.setAttribute("warning", attributeValue);

		// EXERCISE
		var errorDiv = element.querySelector(".form-group.has-error");
		var warningDiv = element.querySelector(".form-group.has-warning");

		// ASSERT
		expect(errorDiv).null;
		expect(warningDiv).not.null;
	});

    it("has 'has-error' class if main tag has both 'error' and 'warning' attribute", function() {
		// SETUP
		var element = testHelpers.createElement(tag);
		var attributeValue = "attribute value"
		element.setAttribute("error", attributeValue);
		element.setAttribute("warning", attributeValue);

		// EXERCISE
		var errorDiv = element.querySelector(".form-group.has-error");
		var warningDiv = element.querySelector(".form-group.has-warning");

		// ASSERT
		expect(errorDiv).not.null;
		expect(warningDiv).null;
	});	
};

var baseFormTests = function (tag) {
	describe("method validate", function () {
	    it("returns false if inner <input> tag's validate returns false", function() {
			// SETUP
			var element = testHelpers.createElement(tag);
			var notValidInput = testHelpers.createElement("input-text", {
				required: true,
				value: ""
			});
			var validInput = testHelpers.createElement("input-text", {
				required: false,
				value: ""
			});
			element.appendChild(notValidInput);
			element.appendChild(validInput);

			// EXERCISE
			var validationResult = element.validate();

			// ASSERT
			expect(validationResult).to.be.false;
		});

	    it("returns true if inner <input> tag's validate returns true", function() {
			// SETUP
			var element = testHelpers.createElement(tag);
			var firstInput = testHelpers.createElement("input-text", {
				required: true,
				value: "input value"
			});
			var secondInput = testHelpers.createElement("input-text", {
				required: false,
				value: ""
			});
			element.appendChild(firstInput);
			element.appendChild(secondInput);

			// EXERCISE
			var validationResult = element.validate();

			// ASSERT
			expect(validationResult).to.be.true;
		});
	});

	describe("getData method", function () {
	    it("returns the serialization of inner inputs", function() {
			// SETUP
			var element = testHelpers.createElement(tag);
			var firstInput = testHelpers.createElement("input-text", {
				field: "firstField",
				value: "Some Text"
			});
			var secondInput = testHelpers.createElement("input-text", {
				field: "secondField",
				value: "1223"
			});
			element.appendChild(firstInput);
			element.appendChild(secondInput);

			// EXERCISE
			var data = element.getData();

			// ASSERT
			expect(data.firstField).to.be.equal("Some Text");
			expect(data.secondField).to.be.equal("1223");
		});
	});

	describe("setData method", function () {
	    it("sets the correct values on inputs", function() {
			// SETUP
			var element = testHelpers.createElement(tag);
			var firstInput = testHelpers.createElement("input-text", {
				field: "firstField",
				value: "Some Text"
			});
			var secondInput = testHelpers.createElement("input-text", {
				field: "secondField",
				value: "1223"
			});
			element.appendChild(firstInput);
			element.appendChild(secondInput);
			var data = {
				firstField: "Another Text",
				secondField: "666",
				thirdField: "12/06/2014"
			};

			// EXERCISE
			element.setData(data);

			// ASSERT
			expect(firstInput.value).to.be.equal(data.firstField);
			expect(secondInput.value).to.be.equal(data.secondField);
		});

		describe("with data fields not matching any input field property", function () {
		    it("it sets no different values on inputs", function() {
				// SETUP
				var element = testHelpers.createElement(tag);
				var firstInput = testHelpers.createElement("input-text", {
					field: "firstField",
					value: "Some Text"
				});
				var secondInput = testHelpers.createElement("input-text", {
					field: "secondField",
					value: "1223"
				});
				element.appendChild(firstInput);
				element.appendChild(secondInput);
				var data = {
					one: "Another Text",
					two: "666",
					three: "12/06/2014"
				};

				// EXERCISE
				element.setData(data);

				// ASSERT
				expect(firstInput.value).not.to.be.equal(data.firstField);
				expect(secondInput.value).not.to.be.equal(data.secondField);
			});
		});
	});

	describe("clearData method", function () {
	    it("clears error and warnings", function() {
			// SETUP
			var element = testHelpers.createElement(tag);
			var firstInput = testHelpers.createElement("input-text", {
				field: "firstField",
				value: "Some Text"
			});
			var secondInput = testHelpers.createElement("input-text", {
				field: "secondField",
				value: "1223"
			});
			element.appendChild(firstInput);
			element.appendChild(secondInput);

			// EXERCISE
			element.clearData();

			// ASSERT
			expect(firstInput.value).to.be.equal("");
			expect(secondInput.value).to.be.equal("");
		});
	});

	describe("setErrors", function () {
	    it("sets the value on error field", function() {
			// SETUP
			var element = testHelpers.createElement(tag);
			var firstInput = testHelpers.createElement("input-text", {
				field: "firstField",
				value: "Some Text"
			});
			element.appendChild(firstInput);
			var error = {
				field: "firstField",
				message: "Error description"
			};
			var errors = [ error ];

			// EXERCISE
			element.setErrors(errors);

			// ASSERT
			expect(firstInput.error).to.be.equal(error.message);
		});
	});

	describe("setWarning", function () {
	    it("sets the value on warning field", function() {
			// SETUP
			var element = testHelpers.createElement(tag);
			var firstInput = testHelpers.createElement("input-text", {
				field: "firstField",
				value: "Some Text"
			});
			element.appendChild(firstInput);
			var warning = {
				field: "firstField",
				message: "Warning description"
			};
			var warnings = [ warning ];

			// EXERCISE
			element.setWarnings(warnings);

			// ASSERT
			expect(firstInput.warning).to.be.equal(warning.message);
		});
	});	
};

window.baseTests = {
	input: baseInputTests,
	label: baseLabelTests,
	error: baseErrorTests,
	warning: baseWarningTests,
	formGroup: baseFormGroupTests,
	baseFormTests: baseFormTests
};

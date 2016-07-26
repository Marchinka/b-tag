(function(document) {

	b.tag.createTag("base-tag").from({
		baseNumber: 2,
		baseMethod: function () {
			return this.baseNumber + this.innerMethod();
		},
		innerMethod: function () {
			return 3;
		}
	});

	b.tag.createTag("extended-tag")
		.extending("base-tag")
		.from({
			baseNumber: 4,
			baseMethod: function () {
				return 4 + this.super.baseMethod.call(this);
			}
	});	

	describe("extend tag", function() {
		it("create a tag inheriting base methods", function() {
			// SETUP
			var element = testHelpers.createElement("extended-tag");

			// EXERCISE
			var hasMethod = _(element.innerMethod).isFunction();

			// ASSERT
			expect(hasMethod).to.be.true;
		});

		it("create a tag overriding base functions when redefined", function() {
			// SETUP
			var element = testHelpers.createElement("extended-tag");

			// EXERCISE
			var result = element.baseMethod();

			// ASSERT
			expect(result).to.be.equal(11); 
			// Call to super class' base method, but with sub class' this.
			// So baseNumber values is not 2 but 4
		});
	});
})(document);